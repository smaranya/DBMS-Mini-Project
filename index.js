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

app.post('/', (req, res) =>{
    const admin = req.body.email;
    const password = req.body.password;
    if (admin === "XYZ@gmail.com" && password === "XYZ@123") {
        var query = "select * from USER";
        mysql.query(query, (error, result) => {
            if (error) throw error;
            res.render("landing", {result} );
        });
    }
    else {
        // var query2 = "select FNAME from USER WHERE USER_EMAIL = ? AND USER_PASSWORD = ?";
        // mysql.query(query2, admin, password, (error, result) =>{
        //     if(error) throw error;
            res.render('userland', {result});
        // })
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
    let n = req.body.n;
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
            
            let values2 = [];
            if(n==1){
                values2 = [
                    [result.insertId, accNumber1, accType1, currentBal1]
                ]
            }
            else if(n==2){
            values2 =[
                [result.insertId, accNumber1, accType1, currentBal1],
                [result.insertId, accNumber2, accType2, currentBal2],
            ];
            }
            else if(n==3){
                values2 =[
                    [result.insertId, accNumber1, accType1, currentBal1],
                    [result.insertId, accNumber2, accType2, currentBal2],
                    [result.insertId, accNumber3, accType3, currentBal3],
                ]
            }

            mysql.query(sql2, [values2], function(error, result){
                if(error) throw error;
                console.log();
                res.render('landing', {result});
            })
        })
    });

    app.get('/landing', (req, res) =>{
        res.render('landing')
    })

    // app.get('/landing', (req, res) => {
    //     const admin = req.query.admin;
    //     const password = req.query.password;
    //     if (admin === "admin@" && password === "admin@123") {
    //         var query = "select * from student";
    //         mysql.query(query, (error, result) => {
    //             if (error) throw error;
    //             res.render("adminHome", { result, success: true });
    //         });
    //     }
    //     else {
    //         res.render('home', { success: false });
    //     }
    // })

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