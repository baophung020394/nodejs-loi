var express = require('express');
var router = express.Router();
const {check, validationResult, body} = require('express-validator');
const bcrypt = require('bcrypt');
const { connection } = require('../config/helper');

/* GET users listing. */
router.get('/', function (req, res, next) {
    connection.query('SELECT * from users', function (error, results) {
        if(results) {
          res.json({ 
            count: results.length,
            users: results 
          });
        }
        else {
          res.json({ 
            message: 'NO USER FOUND'
          });
        }
       
      });
});

/* GET ONE USER MATCHING ID */
router.get('/:id', (req, res) => {
    let id = req.params.id;
    connection.query(`SELECT * from users WHERE id = ${id}`, function (error, results) {
        if(results) {
          res.json({ 
            results 
          });
        }
        else {
          res.json({ 
            message:  `NO USER FOUND WITH ID : ${id}`
          });
        }
      });
});

/* GET ONE USER MATCHING ID */
router.post('/create', 
   async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {

    let email = req.body.email;
    let username = req.body.username;
    let password = await bcrypt.hash(req.body.password, 10);
    let full_name = req.body.full_name;
    let level = req.body.level;
    let chietkhau = req.body.chietkhau;
    let money = req.body.money;
    let phone = req.body.phone;
    let address = req.body.address;
    let city = req.body.city;
    let description = req.body.description;
    let active = req.body.active;
    var post = {
        username: username,
        password: password,
        full_name: full_name,
        level: level,
        chietkhau: chietkhau,
        money: money,
        email: email,
        phone: phone,
        address: address,
        city: city,
        description: description,
        active: active
    }
    connection.query(`INSERT INTO users SET ?`, post, function (error, results) {
        // console.log(results.insertId)
        if (results) {
            res.status(201).json({
                message: `Create user successful.`
            });
        }
        else {
            res.status(501).json({
                message: `Create user failed.`,
                error: error
            });
        }

    });
  }

});


/* UPDATE USER DATA */
router.patch('/updateUserMoney/:id', async (req, res) => {
  let userId = req.body.id; 
  let userMoney = req.body.money;
  connection.query(`UPDATE users SET 
        money= ${userMoney}
        WHERE id = ${userId}`, (error, results) => {
        if (results) {
          res.status(201).json({
            message: `Updated user successful.`
          });
        }
        else {
          res.status(501).json({
            message: `Update user failed.`,
            error: error
          });
        }
      })
})
router.patch('/update/:id', async (req, res) => {
  let userId = req.params.id;   
      let userEmail = req.body.money.email;
      let userPassword = req.body.money.password;
      let userFullname = req.body.money.full_name;
      let userChietkhau = req.body.money.chietkhau;
      let userLevel = req.body.money.level;
      let userDescription = req.body.money.description;
      let userPhone = req.body.money.phone;
      let userAddress = req.body.money.address;
      let userActive = req.body.money.active;
      let userCity = req.body.money.city;
      let userMoney = req.body.money.money;
      console.log(req.body.money)
      connection.query(`UPDATE users SET 
        email= '${userEmail}', 
        full_name = '${userFullname}', 
        chietkhau = ${userChietkhau}, 
        level = '${userLevel}', 
        description = '${userDescription}', 
        phone = '${userPhone}', 
        address = '${userAddress}', 
        active = ${userActive}, 
        city = '${userCity}'
        WHERE id = ${userId}`, (error, results) => {
        if (results) {
          res.status(201).json({
            message: `Updated user successful.`
          });
        }
        else {
          res.status(501).json({
            message: `Update user failed.`,
            error: error
          });
        }
      })
  
});


module.exports = router;
