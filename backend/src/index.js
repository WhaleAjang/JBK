const express = require('express');
const path = require('path'); //어디서 실행하든 다 되게 하려면 path 모듈 사용 : 절대경로
const app = express();  //앱 객체 생성
const cors = require('cors');
const port = 4000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('연결완료');
    })  
    .catch(err => {
        console.log(err);
    } )

app.get('/', (req,res, next) => {
    setImmediate(() => {next(new Error('it is an error'))});
    //res.send('Hello, world!하이');
})


//index.js 파일이 지저분해지기에 각각의 router코드는 각각의 파일에서 생성
//users로 요청이 왔을 시엔 routes/users로 보낸다
app.use('/users',require('./routes/users'));
//product 요청이 왔을시 products 라우터로 전송
app.use('/products',require('./routes/products'));

app.post('/', (req,res) => {
    console.log(req.body);
    res.json(req.body);
})
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); //express에서 제공하는 errorstatus가 있다면 그걸 클라이언트한테 보내주고 없다면 임의로 500을 보낸다
    res.send(error.message || '서버에서 에러가 났습니다'); //지정한 error msg가 있다면 그걸 전달하고 없다면 해당 메시지를 보낸다
})

app.use(express.static('uploads')); //uploads 폴더 안에 있는 정적인 파일 제공 현재는 상대경로
app.use(express.static(path.join(__dirname, '../uploads'))); //절대경로 사용
app.listen(4000, () => {
    console.log(`${port}번에서 실행이 되었습니다.`);
})
