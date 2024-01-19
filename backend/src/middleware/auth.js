//토큰을 request header에서 읽어와서 해당되는 유저를 찾아내고 반환하는 미들웨어
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let auth = async(req,res,next) => {
    const authHeader = req.headers['authorization'];
    
    //auth header의 상태  :  Bearer + '토큰' -> split 필요
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    try{
        //token 복호화
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        //복호화한 값을 userID로 가지는 user 찾기
        const user = await User.findOne({_id : decode.userId});
        if (!user) {
            return res.status(400).send("없는 유저입니다.");
        }

        req.user = user;
        next();
    } catch (error) {
        //에러가 있는 경우
        next(error);
    }
}

module.exports = auth;