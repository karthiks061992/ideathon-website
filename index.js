const express=require("express");
const bodyparser=require("body-parser");
const fileUpload = require("express-fileupload");
const app=express();
app.use(bodyparser.json());
var dbo;
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
var fs=require('fs');
var login_mail;
var login_password;
const mongo=require('mongodb').MongoClient;
mongo.connect("mongodb+srv://karthik:karthik@cluster0.m6yhb.mongodb.net/ctf?retryWrites=true&w=majority",(err,db)=>{
    if(err)
    {
        console.log("the database failed to connect");
    }
    else{
        console.log("the database was connected successfully");
        dbo=db.db('ctf');
        console.log("database object was set successfully");
    }
})
app.post("/register",(req,res)=>{
    var mail_register=req.body.email;
    var password_register=req.body.password;
    //console.log(mail_register);
    //console.log(password_register);
    var randomnumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    var data={
        "email":mail_register,
        "password":password_register,
        "name":req.body.name,
        "number":randomnumber
    }
    dbo.collection("users").find({email:mail_register}).toArray(function(err,result){
        if(err)
        {
            throw err;
        }
        else if(result==false)
        {
            dbo.collection("users").insertOne(data,(err)=>{
                if(err)
                {
                    throw err;
                }
                else{
                    res.render('login');
                }
            });
        }
        else{
            res.render('aldreadyreg');
        }
    });
   
});
app.get("/",(req,res)=>{
    res.render('index');
})
app.post("/login",(req,res)=>{
    login_mail=req.body.mail;
    login_password=req.body.password;
    var data_login={
        email:login_mail,
        password:login_password
    }
   // console.log(login_mail);
    dbo.collection("users").find(data_login).toArray(function(err,result){
        if(err)
        {
            throw err;
        }
        else if(result==false)
        {
            res.render('index');
        }
        else{
            var num=result[0].number;
            num=String(num);
            //console.log(num);
            dbo.collection('questions').find({number:num}).toArray(function(err,res1){
                if(err)
                {
                    throw err;
                }
                else{
                    //console.log(res1[0].question);
                  res.render('attach',{ques:res1[0].question});
                }
            })
        }
    })
})
app.get("/login.html",(req,res)=>{
    res.render('login');
})
app.get("/index.html",(req,res)=>{
    res.render('index');
})
app.use(fileUpload());
app.post("/file",(req,res)=>{
    //sampleFile.mv('C:\Users\karthik\Desktop');
    var find={
        email:login_mail,
        password:login_password,
    }
    var update={
        $set:{"drive_link":req.body.drive_link}
    }

    // console.log(req.file.file);
    dbo.collection("users").update(find,update,(err)=>{
        if(err)
        {
            throw err;
        }
        else{
            res.render('thanks');
        }
    })
   
});
app.listen(process.env.PORT||3000,(err)=>{
    if(err)
    {
        console.log("the server failed to start");
    }
    else{
        console.log("the server was successfully started")
    }
});
