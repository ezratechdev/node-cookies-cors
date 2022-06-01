import express , { Request , Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// 
import ResponseFunc from './global/utils/ResponseFunc';
import path from 'path';


// constants
const PORT = process.env.PORT || 5200;
const app = express();
const Server = http.createServer(app);
const production = false;


// middlewares

app.use(express.json({ limit : '10kb'}));
app.use(express.urlencoded({ extended : true}));
app.use(cookieParser('data'));
app.use(express.static(path.join(__dirname,'/public')));
app.use(cors({
    origin:'http://127.0.0.1/5200',
}));


// 
app.get('/' , (req , res) =>{
    res.sendFile(`${path.join(__dirname)}/public/index.htm`);
});

app.post('/takeMyCookie' , function(req:any ,res , next){
    // i am a middleware
    if(!req.body.name) {
        res.json({
            ...ResponseFunc({
                status:404,
                message:`Name was not passed`,
            })
        });
    } else{
        req.name = req.body.name;
        next();
    }
} , (req:any , res) =>{
    // set secure to false as localhost runs on http to be specific : http://127.0.0.1/
    // in production set secure as true
    res.cookie('name' , `${req.name}` , { signed: true , maxAge: 1000 * 60 * 60 * 24 * 30 , httpOnly : true , secure: false , sameSite:true});
    res.json({
        ...ResponseFunc({
            status:200,
            message:`Name resaved`,
        })
    })
});

app.get('/getMyCookie' , function(req:any , res , next){
    if(!req.signedCookies['name']) {
        res.json({
            ...ResponseFunc({
                status:404,
                message:`Name not found try adding one`,
            })
        })
    } else next();
} , (req , res) =>{
    res.json({
        ...ResponseFunc({
            status:200,
            message:`Cookie found`,
            cookie:req.signedCookies['name'],
        }),
    })
});


// error 404

app.use((req:Request , res:Response) =>{
    res.json({
        ...ResponseFunc({
            status:404,
            message:`Error 404.Path not found`,
        })
    })
});

// server listens

Server.listen(PORT , () =>{
    !production && console.log(`Server running on port ${PORT}`);
});
