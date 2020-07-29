var express = require('express');
var router = express.Router();
const {check, validationResult, body} = require('express-validator');
const { connection } = require('../config/helper');

/* GET naptiens listing. */
router.get('/', function (req, res, next) {
  connection.query('SELECT * from categories', function (error, results) {
    if(results) {
      res.json({ 
        count: results.length,
        categories: results 
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
router.get('/:id', (req, res) => {
    let id = req.params.id;
    connection.query(`SELECT * from categories WHERE id = ${id}`, function (error, results) {
      if(results) {
        res.json({ 
          results 
        });
      }
      else {
        res.json({ 
          message:  `NO CATEGORY FOUND WITH ID : ${id}`
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
  
      let categoryName = req.body.categoryName;
      var post = {categoryName: categoryName} ;
      connection.query(`INSERT INTO categories SET ?` , post , function (error, results) {
        // console.log(results.insertId)
        if(results) {
          res.status(201).json({ 
            message: `Create category successful.`
          });
        }
        else {
          res.status(501).json({ 
            message:  `Create category failed.`,
            error: error
          });
        }
       
      });
    }
  
  });
  

  /* UPDATE PAYMENT DATA */
router.patch('/update/:id', (req, res) => {
  let id = req.params.id;     // Get the User ID from the parameter

  let categoryName = req.body.categoryName;

  connection.query(`UPDATE categories SET categoryName = '${categoryName}' WHERE idNap = ${id}`, (error, results) => {
    if (results) {
      res.status(201).json({
        message: `Updated category successful.`
      });
    }
    else {
      res.status(501).json({
        message: `Update category failed.`,
        error: error
      });
    }
  })
});

/** DELETE PAYMENT DATA */

router.delete('/delete/:id', (req, res) => {
  let id = req.params.id;     // Get the User ID from the parameter

  connection.query(`DELETE FROM categories WHERE id = ${id}`, (error, results) => {
    if (results) {
      res.status(201).json({
        message: `DELETED category successful.`
      });
    }
    else {
      res.status(501).json({
        message: `DELETE category failed.`,
        error: error
      });
    }
  })
});


module.exports = router;
