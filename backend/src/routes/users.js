const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product')
const Payment = require('../models/Payment')
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const async = require('async')
//client의 요청을 수행함

//인증이 되어있는 user의 정보를 토큰과 함께 client로 다시 보내주는 기능
//토큰을 확인하고 그 토큰에서 읽어온 userID를 통해 user정보를 가져오는 건 auth 미들웨어
//미들웨어에서 res.user에 user 정보를 넣어줌
//미들웨어 auth.js
router.get('/auth', auth, async (req,res,next) => {
    //auth 미들웨어를 통해 user를 받아옴
    return res.json({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    })
})

//보낸 req를 parsing해서 body로 보내야함 -> express.json() 사용
router.post('/register', async (req,res,next) => {
    //유저 데이터를 저장
    try{
        const user = new User(req.body);
        await user.save();  //저장이 될 때까지 대기
        //다른방법
        // user.save().then(())
        // .catch
        //성공시
        return res.sendStatus(200);
    }catch (error) {
        //에러발생시 에러 처리기로 error 전달
        next(error);
    }
})


router.post('/login', async(req,res,next) => {
    //req.body에는 유저가 입력한 이메일과 비밀번호가 들어있는 상태
    try{    
        //findOne : 해당 값이 있는 row를 찾아 리턴
        //존재하는 유저인지를 체크
    
        const user = await User.findOne({email : req.body.email})

        if (!user) {
            //해당되는 유저가 없는 경우  400: client 에러
            return res.status(400).send("Auth failed, email not found");
        }
        //comparePassword : User model에서 생성한 비밀번호 대조 함수
        const isMatch = await user.comparePassword(req.body.password);

        if(!isMatch) {
            //비밀번호 오류
            return res.status(400).send("Wrong password");
        }
        //console.log("good");
        const payload =  {
            //payload에 들어가는 값은 user의 ID임
            //mongoDB에서 유저 아이디는 objectID로 되어있다 -> string 변환
            userId : user._id.toHexString(),
        }
        //로그인 성공 시 token 생성
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '1h'})

        //slice에서 userData actionPayload 에 들어가는 부분
        //client에게 유저정보와, 토큰 전달
        return res.json({user, accessToken})

    }catch (error) {
        next(error);
    }
})

//users/logout api요청 처리 auth를 통해 올바른 유저인지 확인
router.post('/logout',auth, async (req,res,next) => {
    //유저 데이터를 저장
    try{
        return res.sendStatus(200);
    }catch (error) {
        //에러발생시 에러 처리기로 error 전달
        next(error);
    }
})

//카트에 정보 물건 담기
router.post('/cart',auth, async (req,res,next) => {
    //유저 데이터를 저장
    try{
        //먼저 User Collection에 해당 유저의 정보를 가져오기
        const userInfo = await User.findOne({_id : req.user._id})

        //가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
        let duplicate = false;
        userInfo.cart.forEach((item) => {
            if(item.id === req.body.productId){
                duplicate = true;
            }
        })
        //상품이 이미 있을 때 => 수량만 늘려야됨
        if (duplicate) {
            const user = await User.findOneAndUpdate(
                {_id: req.user.id, "cart.id": req.body.productId},
                //$inc : increment 1만큼 숫자 증가
                {$inc: {"cart.$.quantity" : 1}},
                //업데이트 된 정보를 반환할 수 있게 해준다
                {new : true}
            )
            return res.status(200).send(user.cart);
        }
        //상품이 없을 때
        else {
            const user = await User.findOneAndUpdate(
                {_id: req.user._id},
                {
                    $push: {
                        cart: {
                            id: req.body.productId,
                            quantity : 1,
                            date : Date.now()
                        }
                    }
                },
                {new: true}
            )
            
            return res.status(201).send(user.cart)
        }
    }catch (error) {
        //에러발생시 에러 처리기로 error 전달
        next(error);
    }
})

//user cart 부분에서 상품 삭제
router.delete('/cart', auth, async(req,res,next) => {
    try {
        //먼저 cart안에 지우려고 한 상품을 지워주기
        console.log(req.user._id)   //이게 없다고 뜨는데
        const userInfo = await User.findOneAndUpdate(
            //찾고
            {_id: req.user._id},
            //업데이트
            {
                "$pull":
                {"cart": {"id":req.query.productId}}
            },
            //옵션 바뀐 값 반환
            {new: true}
        )
        if(!userInfo){
            console.log("없음!")
        }
        //유저의 카트 정보 가져와서
        const cart = userInfo.cart;
        console.log("cart",cart);
        //상품 아이디 가져오기
        const array = cart.map(item => {
            return item.id
        })
        //가져온 아이디에 해당하는 상품 정보 가져오기
        const productInfo = await Product
            .find({_id : {$in:array}})
            .populate('writer')
        
        return res.json({
            productInfo,
            cart
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.post('/payment', auth, async(req,res) => {
    //user collection 안에 history 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: new Date().toISOString(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: crypto.randomUUID()
        })
    })
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.product = history;

    //user collection
    await User.findOneAndUpdate(
        {_id: req.user._id},
        {$push : {
            history: {$each: history}
        },
        //카트 비우기
        $set: {cart: []}
        }
    )

    //payment collection
    const payment = new Payment(transactionData);
    const paymentDocs = await payment.save();
    
    console.log(paymentDocs);
    //  {
    //     dateOfPurchase: '2023-11-29T03:29:09.067Z',
    //     name: '스누피',
    //     id: '6553845fd56d316508249f2d',
    //     price: 90000,
    //     quantity: 3,
    //     paymentId: 'd90f3a74-397c-49f6-b83e-a251f90cddc1'
    //   },

    //팔린만큼 product sold부분 update해주기
    let products = [];
    paymentDocs.product.forEach(item => {
        products.push({id:item.id, quantity : item.quantity})
    })

    async.eachSeries(products, async(item) => {
        await Product.updateOne(
            {_id: item.id},
            {
                $inc: {
                    "sold":item.quantity
                }
            }
        )
    },
    (err) => {
        if(err) return res.status(500).send(err)
        return res.sendStatus(200)
    })
})

module.exports = router;