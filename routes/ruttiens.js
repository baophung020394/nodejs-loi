var express = require('express');
var router = express.Router();
const {check, validationResult, body} = require('express-validator');
const { connection } = require('../config/helper');
const { database } = require('../config/helper2');

// GET ALL ORDERS
router.get('/', (req, res) => {
  database.table('ruttiens')
      .getAll()
      .then(ruttiens => {
          if (ruttiens.length > 0) {
              res.json(ruttiens);
          } else {
              res.json({ message: "No ruttiens found" });
          }

      }).catch(err => res.json(err));
});

/* GET naptiens listing. */
// router.get('/', function (req, res, next) {
//     connection.query('SELECT * from ruttiens', function (error, results) {
//       console.log(results)
//         if (results.length > 0) {
//             res.json({
//                 count: results.length,
//                 ruttiens: results
//             });
//         }
//         else {
//             res.json({
//                 message: 'NO PAYMENT FOUND'
//             });
//         }

//     });
  
// });

/* GET ONE PAYMENT MATCHING ID */
router.get('/:idRut', (req, res) => {
    let idRut = req.params.idRut;
    connection.query(`SELECT * from ruttiens WHERE idRut = ${idRut}`, function (error, results) {
        if(results.length > 0) {
          res.json({ 
            results 
          });
        }
        else {
          res.json({ 
            message:  `NO PAYMENT FOUND WITH ID : ${idRut}`,
            error: error
          });
        }
       
      });
});

/* CREATE ONE PAYMENT */
router.post('/create', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
  
        let soTienRut = req.body.soTienRut;
        let maRut = req.body.maRut;
        let status = req.body.status;
        let bankName = req.body.bankName;
        let accountName = req.body.accountName;
        let accountNumber = req.body.accountNumber;

      var post = {soTienRut: soTienRut, maRut: maRut, status: status, bankName: bankName, accountName: accountName, accountNumber: accountNumber} ;
      connection.query(`INSERT INTO ruttiens SET ?` , post , function (error, results) {
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

router.patch('/update/:idRut', async (req, res) => {
    
    let idRut = req.body.idRut;     // Get the User ID from the parameter
    let ruttiensSoTienRut = req.body.soTienRut;
    let ruttiensStatus = req.body.status;
    console.log(idRut)
    connection.query(`UPDATE ruttiens SET soTienRut=${ruttiensSoTienRut}, status = '${ruttiensStatus}' WHERE idRut = ${idRut}`, (error, results) => {
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

router.delete('/delete/:idRut', (req, res) => {
    let idRut = req.params.idRut;     // Get the User ID from the parameter
  
    connection.query(`DELETE FROM ruttiens WHERE idRut = ${idRut}`, (error, results) => {
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
