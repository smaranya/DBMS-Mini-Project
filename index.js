const express = require('express');
const mysql = require('./sqlConnection').con;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const { con } = require('./sqlConnection');
dotenv.config();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));


app.get('/', (req, res) =>{
    res.render("login");
});

app.post('/login', (req, res)=>{
    let email = req.query.email;
    let password = req.query.password;
    if(email == "admin@gmail.com" && password == "admin@123"){
        let print = 'SELECT * from USER WHERE ADMIN_EMAIL IN(SELECT ADMIN_EMAIL FROM USER WHERE ADMIN_EMAIL = ?)';
                mysql.query(print, adminEmail, function(error, result){
                    if(error) console.log(error)
                    res.render("landing", {users: result});
                })
    }
    else{
        res.render('userland');
    }
})

app.get('/signup', (req, res) =>{
    res.render("signup")
});

app.post('/signup', (req, res) =>{
    let fname = req.body.firstName;
    let mname = req.body.middleName;
    let lname = req.body.lastName;
    let password;
    if(req.body.password == req.body.confirmPassword){
        password = req.body.password;
    }
    let adminEmail;
    if(req.body.userType == 'admin'){
        adminEmail = req.body.userEmail;
    }
    else{
        adminEmail = req.body.adminEmail;
    }
    let userEmail = req.body.userEmail;
    let phoneNumber = req.body.phoneNumber;
    let accNumber1 = req.body.accNumber1;
    let accType1 = req.body.accType1;
    let currentBal1 = req.body.currentBal1;
    let accNumber2, accType2, currentBal2;
    if(req.body.accNumber2 != null){
        accNumber2 = req.body.accNumber2;
        accType2 = req.body.accType2;
        currentBal2 = req.body.currentBal2;
    }
    let accNumber3, accType3, currentBal3;
    if(req.body.accNumber3 != null){
        accNumber3 = req.body.accNumber3;
        accType3 = req.body.accType3;
        currentBal3 = req.body.currentBal3;
    }

        let sql1 = "INSERT INTO USER(USER_PASSWORD, FNAME, MNAME, LNAME, USER_EMAIL, USER_PHONE, ADMIN_EMAIL) VALUES ?";

        let values1 = [
            [password, fname, mname, lname, userEmail, phoneNumber, adminEmail]
        ];

        mysql.query(sql1, [values1], function(error, result){
            if(error) throw error;

            let sql2 = "INSERT INTO ACCOUNT(USER_ID, ACC_NO, ACC_TYPE, ACC_BAL) VALUES ?";

            let values2 =[
                [result.insertId, accNumber1, accType1, currentBal1],
                [result.insertId, accNumber2, accType2, currentBal2]
            ];

            console.log(values2);

            mysql.query(sql2, [values2], function(error, result){
                if(error) throw error;
                res.render('login');
                // if(userEmail == adminEmail){
                // let print = 'SELECT * from USER WHERE ADMIN_EMAIL IN(SELECT ADMIN_EMAIL FROM USER WHERE ADMIN_EMAIL = ?)';
                // mysql.query(print, adminEmail, function(error, result){
                //     if(error) console.log(error)
                //     res.render("landing", {users: result});
                // })
                // }
            })
        })
    });

    app.get('/adminHome', (req, res) => {
        const admin = req.query.admin;
        const password = req.query.password;
        if (admin === "admin" && password === "admin@123") {
            var query = "select * from student";
            mysql.query(query, (error, result) => {
                if (error) throw error;
                res.render("adminHome", { result, success: true });
            });
        }
        else {
            res.render('home', { success: false });
        }
    })

// app.get('/landing', function(req, res){
//     con.connect(function(error){
//         if(error) console.log(error);

//         var data = 'SELECT * from USER';
//         con.query(data, function(error, result){
//             if(error) console.log(error)
//             res.render(__dirname+"/views/landing", {users: result});
//         })

//     })
// })

app.listen(port, ()=>{
    console.log(`Server connected on ${port}`);
});

// let q1 = "SELECT * FROM USER";
// mysql.query(q1, (err, res)=>{
// if(err) throw err;
// console.log(res);
// });