const express = require('express');
const mysql = require('./sqlConnection').con;
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const { con } = require('./sqlConnection');
const { getMaxListeners } = require('process');
dotenv.config();
const port = process.env.PORT;
let alert = require('alert');


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
    if (admin === "sam@gmail.com" && password === "sam@123") {
        var query = "select * from USER WHERE USER_EMAIL != ?";
        var query2 = "SELECT * from TRANSACTIONS WHERE USER_ID = (SELECT USER_ID FROM USER WHERE USER_EMAIL = ?)";
        mysql.query(query, admin, (error, result) => {
            mysql.query(query2, admin, (error, adminpay) =>{
                res.render("landing", {result, adminpay});
            })
        });
    }
    else{
        // popup.alert({
        //     content: 'Invalid Admin Credentials'
        // })
        res.redirect('/');
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
                res.redirect(301, '/');
            })
        })
    });

    app.get('/landing', (req, res) =>{
        let admin = "sam@gmail.com";
        var query = 'select * from USER WHERE USER_EMAIL != ?';
        var query2 = 'SELECT * from TRANSACTIONS WHERE TRANSACTIONS.USER_ID = USER.USER_ID AND USER.USER_EMAIL = ?';
        mysql.query(query, admin, (error, result) => {
            mysql.query(query2, admin, (error, adminpay) =>{
                res.render("landing", {result});
            })
        });
    })

  

    app.get('/add', (req, res) =>{
        res.render('pay_add', {
            title: 'Transaction form page'
        })
    })

    app.post('/save', (req, res) =>{
        let sql1 = 'SELECT * FROM USER WHERE USER_EMAIL = ?';
        let email = req.body.email;
        let accNo = req.body.accNo;
        let date = req.body.pay_date;
        let amt = req.body.pay_amt;
        let desc = req.body.pay_desc;
        let rec_name = req.body.rec_name;
        let pay_method = req.body.paymentMethod;
        let rec_acc;
        let rec_phone;
        let enterprise;
        if(pay_method == 'enterprise'){
            enterprise = true,
            rec_acc = null,
            rec_phone = null
        }
        else if(pay_method == 'phoneNumber'){
            enterprise = false,
            rec_acc = null,
            rec_phone = req.body.phoneNumber
        }
        else{
            enterprise = false,
            rec_acc = req.body.recAcc,
            rec_phone = null
        }
        mysql.query(sql1, email, (err, result) =>{
            uid = result[0].USER_ID;
            let sql2 = 'SELECT * FROM ACCOUNT WHERE ACC_NO = ?'
            mysql.query(sql2, accNo, (err, acc) =>{
                actid = acc[0].ACC_ID;
                let sql = "INSERT INTO TRANSACTIONS(USER_ID, ACC_ID, PAY_AMT, PAY_DATE, PAY_DESC, REC_NAME) VALUES ?";
                let data = [
                    [uid, actid, amt, date, desc, rec_name]
                ];
                mysql.query(sql, [data], (err, pay)=> {
                    if(err) throw err;
                    let sqlpay = "INSERT INTO PAYMENT_OPTIONS(PAY_ID, ENTERPRISE, REC_ACC, PAY_PHONE) VALUES ?"
                    let values = [
                        [pay.insertId, enterprise, rec_acc, rec_phone]
                    ];
                    mysql.query(sqlpay, [values], (err, payopt) =>{            
                        res.redirect('/');
                    })
                })
            })
        })
    });

    app.get("/rewards", (req, res) =>{
        var query = "SELECT * FROM REWARDS";
        var fname = req.query.Fname;
        
        mysql.query(query, (error, result) => {
            res.render('rewards', {result});
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

app.get('/claim', (req, res) =>{
    const code = req.query.code;
    const email = req.query.email;
    
    var query = "select * from USER where USER_EMAIL=?";
    var query2 = "update rewards set USER_ID = ? where CODE = ?";
    mysql.query(query,email,(error,result)=>{
        var uid = result[0].USER_ID;
        let data = [uid, code];
        mysql.query(query2, data ,(err,result1)=>{
                res.redirect("/rewards");
        })
    })
    //var lname = req.body.Lname;
    // let sqlname = "SELECT USER_ID FROM USER WHERE FNAME = ?";
    // var query2 = 'UPDATE REWARDS SET USER_ID = ? WHERE CODE = ?'; 
    // mysql.query(sqlname, fname, (error, result) =>{
    //     console.log({result});
    //     // let data = [uid, code];
    //     // mysql.query(query2, data, (error, results) =>{
    //     //     console.log(data);
    //     //     res.redirect('/rewards');
    //     // })
    // })
})

app.get('/delete-user',(req,res)=>{
    const id = req.query.id;
    var query = "delete from USER where USER_ID = ?";
    var query2 = "delete from ACCOUNT where USER_ID = (SELECT USER_ID FROM USER WHERE USER_ID = ?)";
    // query += "delet from TRANSACTIONS where USER_ID = ?";
    mysql.query(query,[id],(error,result)=>{
        mysql.query(query2, [id], (error, result) =>{
            if(error) throw error;
            res.redirect('landing')
        })
    })
})

app.get('/userLand',(req,res)=>{
    const {password} = req.query
    var query2 = "select * from USER WHERE USER_PASSWORD = ?";
    var querypay = "select * from TRANSACTIONS WHERE USER_ID = ?";
    mysql.query(query2, password, (error, result) =>{
        uid =result[0].USER_ID;
        mysql.query(querypay, uid, (error, pay) => {
            if(error) throw error;
            res.render('userland', {result, pay});
        })
    })
})

app.get('/userLogin',(req,res)=>{
    res.render("userlogin");
})