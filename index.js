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


app.get('/', (req, res) =>{
    res.render(__dirname+"/views/login.ejs")
});

app.get('/signup', (req, res) =>{
    res.render(__dirname+"/views/signup.ejs")
});

app.post('/signup', (req, res) =>{
    let userid = 0;
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

    mysql.connect((error) =>{
        if(error) throw error;

        let sql1 = "INSERT INTO USER(USER_PASSWORD, FNAME, MNAME, LNAME, USER_EMAIL, USER_PHONE, ADMIN_EMAIL) VALUES ?";

        let values1 = [
            [password, fname, mname, lname, userEmail, phoneNumber, adminEmail]
        ];

        mysql.query(sql1, [values1], function(error, result){
            if(error) throw error;
            res.render(__dirname+"/views/accDeets.ejs");
 
        })

        
    })
});

app.get("/accDeets", (req, res) =>{
    res.render(__dirname+"/view/accDeets.ejs")
});

app.post("/accDeets", (req, res) =>{
        let sql2 = "INSERT INTO ACCOUNT(USER_ID, ACC_NO, ACC_TYPE, ACC_BAL) VALUES ?";

        let values2 =[
            [userid, accNumber1, accType1, currentBal1],
            [userid, accNumber2, accType2, currentBal2]
        ];

        console.log(values2);

        mysql.query(sql2, [values2], function(error, result){
            if(error) throw error;
            res.send("Account Details for Account "+ result.insertId + "filled");

        })
})

app.get('/landing', function(req, res){
    con.connect(function(error){
        if(error) console.log(error);

        var data = "SELECT * from USER";
        con.query(data, function(error, result){
            if(error) console.log(error)
            res.render(__dirname+"/views/landing", {users: result});
        })

    })
})

app.listen(port, ()=>{
    console.log(`Server connected on ${port}`);
});

// let q1 = "SELECT * FROM USER";
// mysql.query(q1, (err, res)=>{
// if(err) throw err;
// console.log(res);
// });