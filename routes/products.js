var express = require('express');
var router = express.Router();
const { connection } = require('../config/helper');
const {database} = require('../config/helper2');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'public/images')
    },
    filename: (req, file, callBack) => {
        callBack(null, `FunOfHeuristic_${file.originalname}`)
    }
})

const upload = multer({ storage: storage })
router.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(req.body.name)
    console.log(req.body.unitPrice)
    console.log(file);
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
})
router.post('/create', upload.array('files') ,
   async (req, res) => {
       console.log(req)
//   const errors = validationResult(req);
 
    
    let name = req.body.name;
    let unitPrice = parseInt(req.body.unitPrice);
    let dealPrice = parseInt(req.body.dealPrice);
    let SKU = req.body.SKU;
    let chietkhauSanpham = req.body.chietkhauSanpham;
    let quantity = parseInt(req.body.quantity);
    let description = req.body.description;
    let short_desc = req.body.short_desc;
    let cat_id = parseInt(req.body.cat_id); 
    // let image = req.file.filename;
    let images = [req.files.map(image => 'https://deploy-lamdaoloi.herokuapp.com' + [image.path.slice(6)])];
    let colors = req.body.colors;
    console.log('cac hinh anh', colors)
    var post = {
        name: name,
        unitPrice: unitPrice,
        dealPrice: dealPrice,
        SKU: SKU,
        chietkhauSanpham: chietkhauSanpham,
        quantity: quantity,
        description: description,
        short_desc: short_desc,
        cat_id: cat_id,
        // image: image,
        images: images.join(';'),
        colors: colors
    }
    // SELECT a.productName, a.unitPrice, a.dealPrice, a.SKU, a.chietkhauSanpham, a.qualityProduct, a.description, a.short_desc, a.createdAt, a.updatedAt, b.cat_id FROM products a LEFT OUTER JOIN categories as b ON a.cat_id = b.id`
    // (productName, unitPrice, dealPrice, SKU, chietkhauSanpham, qualityProduct, description, short_desc, cat_id)
    connection.query(`INSERT INTO products SET ?  `, post, function (error, results) {
        // console.log(results.insertId)
        if (results) {
            res.status(201).json({
                message: `Create product successful.`
            });
        }
        else {
            res.status(501).json({
                message: `Create product failed.`,
                error: error
            });
        }

    });
  

});


router.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req;
    console.log(files);
    if (!files) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send({ sttus: 'ok' });
})







/* GET products listing. */
router.get('/', function (req, res) {       // Sending Page Query Parameter is mandatory http://localhost:3636/api/products?page=1
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
      startValue = (page * limit) - limit;     // 0, 10, 20, 30
      endValue = page * limit;                  // 10, 20, 30, 40
  } else {
      startValue = 0;
      endValue = 10;
  }
  // database.table('products')
  // .getAll()
  // .then(prods => {
  //         if (prods.length > 0) {
  //             res.status(200).json({
  //                 count: prods.length,
  //                 products: prods
  //             });
  //         } else {
  //             res.json({message: "No products found"});
  //         }
  //     })
  database.table('products as p')
      .join([
          {
              table: "categories as c",
              on: `c.id = p.cat_id`
          }
      ])
      .withFields(['c.categoryName as category',
        'p.id',
        'p.name as name',
        'p.unitPrice',
        'p.dealPrice',
        'p.SKU',
        'p.chietkhauSanpham',
        'p.quantity',
        'p.description',
        'p.short_desc',
        'p.createdAt',
        'p.updatedAt',
        'p.images',
        'p.colors'
      ])
      .slice(startValue, endValue)
      .sort({id: .1})
      .getAll()
      .then(prods => {
          if (prods.length > 0) {
              res.status(200).json({
                  count: prods.length,
                  products: prods
              });
          } else {
              res.json({message: "No products found"});
          }
      })
      .catch(err => console.log(err));
});
// router.get('/', function (req, res, next) {
//     connection.query('SELECT a.idProduct, a.productName, a.unitPrice, a.dealPrice, a.SKU, a.chietkhauSanpham, a.qualityProduct, a.description, a.short_desc, a.createdAt, a.updatedAt, b.categoryName FROM products a INNER JOIN categories b ON a.cat_id = b.id', function (error, results) {
//         if(results.length > 0) {
//           res.json({ 
//             count: results.length,
//             products: results 
//           });
//         }
//         else {
//           res.json({ 
//             message: 'NO PRODUCT FOUND'
//           });
//         }
       
//       });
// });

/* GET ONE PRODUCT*/
router.get('/:prodId', (req, res) => {
  let productId = req.params.prodId;
  database.table('products as p')
      .join([
          {
              table: "categories as c",
              on: `c.id = p.cat_id`
          }
      ])
      .withFields(['c.categoryName as category',
        'p.id',
        'p.name as name',
        'p.unitPrice',
        'p.dealPrice',
        'p.SKU',
        'p.chietkhauSanpham',
        'p.quantity',
        'p.description',
        'p.short_desc',
        'p.createdAt',
        'p.updatedAt',
        'p.images',
        'p.colors'
      ])
      .filter({'p.id': productId})
      .get()
      .then(prod => {
          console.log(prod);
          if (prod) {
              res.status(200).json(prod);
          } else {
              res.json({message: `No product found with id ${productId}`});
          }
      }).catch(err => res.json(err));
});

// router.get('/:idProduct', (req, res) => {
//     let idProduct = req.params.idProduct;
//     connection.query(`SELECT a.idProduct, a.productName, a.unitPrice, a.dealPrice, a.SKU, a.chietkhauSanpham, a.qualityProduct, a.description, a.short_desc, a.createdAt, a.updatedAt, b.categoryName
//     FROM products a INNER JOIN categories b
//     ON a.cat_id = b.id WHERE idProduct = ${idProduct}`, function (error, results) {
//         if(results) {
//           res.json({ 
//             results 
//           });
//         }
//         else {
//           res.json({ 
//             message:  `NO PRODUCT FOUND WITH ID : ${id}`
//           });
//         }
//       });
// });
/* GET ALL PRODUCTS FROM ONE CATEGORY */
router.get('/category/:catName', (req, res) => { // Sending Page Query Parameter is mandatory http://localhost:3636/api/products/category/categoryName?page=1
  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;   // check if page query param is defined or not
  const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
  let startValue;
  let endValue;
  if (page > 0) {
      startValue = (page * limit) - limit;      // 0, 10, 20, 30
      endValue = page * limit;                  // 10, 20, 30, 40
  } else {
      startValue = 0;
      endValue = 10;
  }

  // Get category title value from param
  const cat_title = req.params.catName;

  database.table('products as p')
      .join([
          {
              table: "categories as c",
              on: `c.id = p.cat_id WHERE c.categoryName LIKE '%${cat_title}%'`
          }
      ])
      .withFields(['c.categoryName as category',
          'p.name as name',
          'p.unitPrice',
          'p.dealPrice',
          'p.SKU',
          'p.chietkhauSanpham',
          'p.quantity',
          'p.description',
          'p.short_desc',
          'p.createdAt',
          'p.updatedAt',
      ])
      .slice(startValue, endValue)
      .sort({id: 1})
      .getAll()
      .then(prods => {
          if (prods.length > 0) {
              res.status(200).json({
                  count: prods.length,
                  products: prods
              });
          } else {
              res.json({message: `No products found matching the category ${cat_title}`});
          }
      }).catch(err => res.json(err));

});


/* UPDATE USER DATA */
router.patch('/update/:id',upload.array('files'), async (req, res) => {
    console.log('body', req.body);
      let id = req.params.id;
      let name = req.body.name;
      let unitPrice = parseInt(req.body.unitPrice);
      let dealPrice = parseInt(req.body.dealPrice);
      let SKU = req.body.SKU;
      let chietkhauSanpham = parseInt(req.body.chietkhauSanpham);
      let quantity = parseInt(req.body.quantity);
      let description = req.body.description;
      let short_desc = req.body.short_desc;
      let cat_id = parseInt(req.body.cat_id); 
      let images = req.files.map(image => 'https://deploy-lamdaoloi.herokuapp.com' + [image.path.slice(6)]);
      let colors = req.body.colors;
    //   console.log('cac hinh anh', colors);
    //   console.log('cac hinh anh', images);
      database.table('products')
      .filter({ 'id': id })
      .update({
        name: name,
        unitPrice: unitPrice,
        dealPrice: dealPrice,
        SKU: SKU,
        chietkhauSanpham: chietkhauSanpham,
        quantity: quantity,
        description: description,
        short_desc: short_desc,
        cat_id: cat_id,
        images: images,
        colors: colors

      })
      .then( successNum  =>  { 
          log ( successNum )  
      }).catch(err => res.json(err));
    //   connection.query(`UPDATE products SET 
    //     name= '${name}', 
    //     unitPrice = ${unitPrice}, 
    //     dealPrice = ${dealPrice}, 
    //     SKU = '${SKU}', 
    //     chietkhauSanpham = ${chietkhauSanpham}, 
    //     quantity = ${quantity}, 
    //     description = '${description}', 
    //     short_desc = '${short_desc}',
    //     cat_id = ${cat_id},
    //     images = '${JSON.stringify(images)}',
    //     colors = '${colors}'
    //     WHERE id = ${id}`, (error, results) => {
    //     if (results) {
    //       res.status(201).json({
    //         message: `Updated product successful.`
    //       });
    //     }
    //     else {
    //       res.status(501).json({
    //         message: `Update product failed.`,
    //         error: error
    //       });
    //     }
    //   })
  
});


module.exports = router;
