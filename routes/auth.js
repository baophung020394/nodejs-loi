const express = require('express');
const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const { connection } = require('../config/helper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require("../config/auth.config");
// LOGIN ROUTE
// router.get('/login', (req, res) => {
//     connection.query(`SELECT * from users`, function (error, results) {
//         if(results.length > 0) {
//           res.json({ 
//             results 
//           });
//         }
//         else {
//           res.json({ 
//             message:  `NO USER FOUND WITH ID`,
//             error: error
//           });
//         }
//       });
// })
router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    console.log(password);
    connection.query(`SELECT * FROM users WHERE username='${username}' `, function(err, user) {
        console.log(user)
        if(user) {
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user[0].password
          );

          if(passwordIsValid) {
            username = user.username;
            password = user.password;

            var token = jwt.sign({ id: user.id }, config.secret, {
              expiresIn: 86400 // 24 hours
            });
      
            res.status(200).json({
              id: user[0].id,
              username: user[0].username,
              email: user[0].email,
              accessToken: token,
              err: err
            });
  
          } else {
            res.status(401).send("Username or password incorrect");
          }
    
        } else {
          res.status(401).send("Username or password incorrect");
        }
      // if (!user) {
      //   return res.status(404).send({ message: "User Not found." });
      // }

      // var passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user[0].password
      // );

      // if (!passwordIsValid) {
      //   return res.status(401).send({
      //     accessToken: null,
      //     message: "Invalid Password!"
      //   });
      // }

      // var token = jwt.sign({ id: user.id }, config.secret, {
      //   expiresIn: 86400 // 24 hours
      // });

      // res.status(200).json({
      //   id: user[0].id,
      //   username: user[0].username,
      //   email: user[0].email,
      //   accessToken: token,
      //   err: err
      // });

        //   var authorities = [];
        //   user.getRoles().then(roles => {
        //     for (let i = 0; i < roles.length; i++) {
        //       authorities.push("ROLE_" + roles[i].name.toUpperCase());
        //     }
        //     res.status(200).send({
        //       id: user.id,
        //       username: user.username,
        //       email: user.email,
        //       accessToken: token,
        //     });
        //   });
    })
});

module.exports = router;