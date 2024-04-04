const express = require("express")
const app = express()
const PORT = 3000;
const hbs = require('express-handlebars');
const cookieparser = require("cookie-parser");
const path = require("path");
const nocache = require("nocache");
const { resolveMx } = require("dns");
const Datastore = require('nedb')
const database = new Datastore({
    filename: 'users.db',
    autoload: true
});
let isUser
app.use([
    nocache(),
    cookieparser(),
    express.static('static'),
    express.urlencoded({extended: true})
])
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

function findUser(user){
    return new Promise((resolve)=>{
        database.findOne(user, function (err, data) {
            if(data){
                resolve(true)
            }
            else{
                resolve(false)
            }
            });
    })
}
const check = async (n) =>{
    isUser = await findUser(n)
    return isUser
}
app.get('/', function (req,res){
    let userName=req.cookies.login;
    if(userName){
        check(userName).then((isUser)=>{
            if(findUser(userName)){
                let message={text: userName}
                res.render("page.hbs", message)
            }
        })
    }
    else{
        res.redirect('/login')
    }
})
app.get('/logout', function (req,res){
   if(req.cookies.login){
        res.render('logout.hbs')
    }
    else{
        res.redirect('/login')
    }
})
app.get('/out', function (req,res){
    res.clearCookie("login");
    res.redirect("/login");
})
app.get('/index2', function (req,res){
    let userName=req.cookies.login;
    if(userName){
        check(userName).then((isUser)=>{
            if(findUser(userName)){
               let message={text: userName}
                res.render("page2.hbs", message)
            }
        })
    }
    else{
        res.redirect('/login')
    }
})
app.get('/login', function (req,res){
    res.render("login.hbs")
})
app.get('/register', function (req,res){
    res.render("register.hbs")
})
app.post('/loginForm',function (req,res){
    let user={name:req.body.name, pass:req.body.pass}
    check(user).then((isUser)=>{
        if(isUser==true){
            res.cookie("login", user.name, { httpOnly: true, maxAge: 30 * 1000 });
            res.redirect("/")
        }
        else{
            let message={text: "zły login lub hasło"}
            res.render("error.hbs",message)
        }
    })
})
app.post('/registerForm', function (req,res){
    let user ={name:req.body.name,pass: req.body.pass}
    check({name:user.name}).then((isUser)=>{
        if(isUser==true){
            let message={text:"użytkownik o danej nazwie już istnieje"}
            res.render("error.hbs",message)
        }
        else if(user.name.length<3){
            let message={text:"min username length = 3"}
            res.render("error.hbs",message)
        }
        else{
            database.insert(user, function (err, newDoc) {});
            res.cookie("login", user.name, { httpOnly: true, maxAge: 30 * 1000 });
            res.redirect("/")
        }
    })

})
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})