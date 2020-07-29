var express = require('express');
var router = express.Router();
const {check, validationResult, body} = require('express-validator');
const bcrypt = require('bcrypt');
const { connection } = require('../config/helper');

/* GET naptiens listing. */
router.get('/', function (req, res, next) {
  connection.query('SELECT * from naptiens', function (error, results) {
    if(results.length > 0) {
      res.json({ 
        count: results.length,
        naptiens: results 
      });
    }
    else {
      res.json({ 
        message: 'NO PAYMENT FOUND'
      });
    }
   
  });
});

/* GET ONE PAYMENT MATCHING ID */
router.get('/:idNap', (req, res) => {
    let idNap = req.params.idNap;
    connection.query(`SELECT * from naptiens WHERE idNap = ${idNap}`, function (error, results) {
      if(results.length > 0) {
        res.json({ 
          results 
        });
      }
      else {
        res.json({ 
          message:  `NO PAYMENT FOUND WITH ID : ${idNap}`
        });
      }
     
    });
    
});

/* CREATE ONE PAYMENT */
router.post('/create', (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
  
      let soTienNap = req.body.soTienNap;
      let maNap = req.body.maNap;
      let status = req.body.status;
      var post = {soTienNap: soTienNap, maNap: maNap, status: status} ;
      connection.query(`INSERT INTO naptiens SET ?` , post , function (error, results) {
        // console.log(results.insertId)
        if(results) {
          res.status(201).json({ 
            message: `Create payment successful.`
          });
        }
        else {
          res.status(501).json({ 
            message:  `Create payment failed.`,
            error: error
          });
        }
       
      });
    }
  
  });
  

  /* UPDATE PAYMENT DATA */
router.patch('/update/:idNap', (req, res) => {
  let idNap = req.params.idNap;     // Get the User ID from the parameter

  let naptiensSoTienNap = req.body.soTienNap;
  let naptiensStatus = req.body.status;

  connection.query(`UPDATE naptiens SET soTienNap=${naptiensSoTienNap}, status = '${naptiensStatus}' WHERE idNap = ${idNap}`, (error, results) => {
    if (results) {
      res.status(201).json({
        message: `Updated payment successful.`
      });
    }
    else {
      res.status(501).json({
        message: `Update payment failed.`,
        error: error
      });
    }
  })
});

/** DELETE PAYMENT DATA */

router.delete('/delete/:idNap', (req, res) => {
  let idNap = req.params.idNap;     // Get the User ID from the parameter

  connection.query(`DELETE FROM naptiens WHERE idNap = ${idNap}`, (error, results) => {
    if (results) {
      res.status(201).json({
        message: `DELETED payment successful.`
      });
    }
    else {
      res.status(501).json({
        message: `DELETE payment failed.`,
        error: error
      });
    }
  })
});


module.exports = router;
