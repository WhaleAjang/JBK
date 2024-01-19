const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //해당 경로에 이미지 저장
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
    //해당이름으로 이미지 저장
})

const upload = multer({storage: storage}).single('file')

//product와 관련된 요청을 수행함

//이미지 업로드 라우터
router.post('/image', auth, async (req,res,next) => {
    upload(req, res, err => {
        if(err) {
            return req.status(500).send(err);
        }
        console.log(res.req.file.filename);
        return res.json({fileName: res.req.file.filename})
    }) 
})

//auth : auth가 true인 사람만 수행할 수 있다
// /products/
router.post('/', auth, async (req,res,next) => {
    try{
        const product = new Product(req.body);
        product.save();
        return res.sendStatus(201);
    } catch(error) { 
        next(error);
    }
})

router.get('/:id', async(req,res,next) => {
    const type = req.query.type;
    //파라미터로 받은 Id
    let productIds = req.params.id;

    if (type === 'array') {
        //id = 111233,34243,26453453 이런 형식으로 전달옴
        // -> ['','',''] 이렇게 배열 안에 들어오도록 하면 된다

        let ids = productIds.split(',');
        productIds = ids.map(item => {
            return item
        })
    }
    //productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져오기
    try {
        const product = await Product
        //하나의 아이디만 검색 -> .find({_id  :productIds})
        //여러개 검색 {$in}
        .find({_id : {$in: productIds}})
        //??
        .populate('writer')

        return res.status(200).send(product);

    } catch (error) {
        next(error)
    }
})

router.get('/', async (req,res,next) => {
    //params로 전달 받음 
    //프론트에서 요청을  localhost:4000/product?order=asc (오름차순) desc: 내림차순
    const order = req.query.order ? req.query.order : 'desc';
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    //지정이 안되어 있다면 20
    const limit = req.query.limit ? req.query.limit : 20; 
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    //http://localhost:4000/products?skip=0&limit=4&filters[continents][0]=1&searchTerm=
    const term = req.query.searchTerm;
    let findArgs = {};
    for (let key in req.query.filters) {
        if (req.query.filters[key].length > 0){
            if (key === 'price') {
                findArgs[key] = {
                    //greater than equal
                    $gte: req.query.filters[key][0],
                    //less than equal
                    $lte:req.query.filters[key][1]
                }

            } else {
                findArgs[key] = req.query.filters[key];
            }
        }
    }
    if (term) {
        findArgs["$text"] = {$search: term};
    }

    console.log(findArgs);

    try{
        //findArgs(필터) 값에 해당하는 product만 가져오기
        const products = await Product.find(findArgs)
            .populate('writer')
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
        //product 전체 개수 가져오기 + 필터(findArgs)
        const productsTotal = await Product.countDocuments(findArgs);
        //남은 게 더 있는지 확인
        const hasMore = skip + limit < productsTotal ? true : false
        return res.status(200).json({
            products,
            hasMore
        })
    } catch(error) { 
        next(error);
    }
})

module.exports = router;