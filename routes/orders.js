const express = require('express');
const router = express.Router();
const { database } = require('../config/helper2');
const crypto = require('crypto');

// GET ALL ORDERS
router.get('/', (req, res) => {
    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields([
            'o.id', 
            'od.order_id',
            'u.id',
            'u.username',
            'od.maDonHang',
            'od.maVanDon',
            'od.nameProduct',
            'od.quantityProduct',
            'od.product_id'
        ])
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({ message: "No orders found" });
            }

        }).catch(err => res.json(err));
});

// Get Single Order
router.get('/:id', async (req, res) => {
    let orderId = req.params.id;
    console.log(orderId);

    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields([
            'o.id', 
            'od.maVanDon',
            'od.maDonHang',
            'od.totalPay',
            'od.nameProduct',
            'u.username',
            'p.name', 
            'p.description', 
            'p.unitPrice', 
            'p.dealPrice', 
            'p.chietkhauSanpham', 
            'u.chietkhau',
            'u.username',
            'od.quantity as quantityOrdered'
        ])
        .filter({ 'o.id': orderId })
        .getAll()
        .then(orders => {
            console.log(orders);
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({ message: "No orders found" });
            }

        }).catch(err => res.json(err));
});

router.get('/orderuser/:id', async (req, res) => {
    let orderId = req.params.id;
    console.log(orderId);

    database.table('users as u')
        .join([
            {
                table: 'orders_details as od',
                on: 'u.id = od.user_id'
            }
        ])
        .withFields([
            'u.id', 
            'od.maVanDon',
            'od.maDonHang',
            'od.totalPay',
            'od.nameProduct',
            'u.username',
            'od.status',
            'od.statusDoiSoat',
            'od.quantity as quantityOrdered'
        ])

        .getAll()
        .then(orders => {
            console.log(orders);
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({ message: "No orders found" });
            }

        }).catch(err => res.json(err));
});
// Get Single Order
router.get('/orderdetail/:maDonHang', async (req, res) => {
    let maDonHang = req.params.maDonHang;
    console.log(maDonHang);

    database.table('orders_details as od')
        .withFields([
            'od.maVanDon',
            'od.maDonHang',
            'od.totalPay',
            'od.nameProduct',
            'od.quantity as quantityOrdered',
            'od.status',
            'od.statusDoiSoat'
        ])
        .filter({ 'maDonHang': maDonHang })
        .getAll()
        .then(orders => {
            console.log(orders);
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({ message: "No orders found" });
            }

        }).catch(err => res.json(err));
});

// Update Order
router.post('/orderupdate/:maDonHang', async (req, res) => {
    let maDonHang = req.params.maDonHang;
    let statusDoiSoat = req.body.data.statusDoiSoat;
    console.log(maDonHang);
    console.log(req.body.data)
    database.table('orders_details')
        .filter({ 'maDonHang': maDonHang })
        .update({
            statusDoiSoat: statusDoiSoat
        })
        .then( successNum  =>  { 
            log ( successNum )  
        }).catch(err => res.json(err));
})
// Place New Order
router.post('/new', async (req, res) => {
    // let userId = req.body.userId;
    // let data = JSON.parse(req.body);
    let { userId, products } = req.body;
    console.log('products ne', products)
    console.log(userId);
    console.log(req.body.orders.totalproduct);
    console.log(req.body.orders.totalPay);
    if (userId !== null && userId > 0) {
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => {

                if (newOrderId > 0) {
                    products.forEach(async (p) => {

                        let data = await database.table('products').filter({ id: p.id }).withFields(['quantity']).get();
                        console.log('data', data)
                        let inCart = parseInt(p.incart);
                        let nameReceive = req.body.orders.nameReceive;
                        let maDonHang = req.body.orders.maDonHang;
                        let phoneReceive = req.body.orders.phoneReceive;
                        let addressReceive = req.body.orders.addressReceive;
                        let city = req.body.orders.city;
                        let maVanDon = req.body.orders.maVanDon;
                        let hinhThucDropShip = req.body.orders.hinhThucDropShip;
                        let totalPay = req.body.orders.totalPay;
                        let totalproduct = req.body.orders.totalproduct;
                        let quantityProduct = req.body.orders.quantityProduct;
                        let nameProduct = req.body.orders.nameProduct;
                        let chietkhauSanpham = req.body.orders.chietkhauSanpham;
                       
                        let unitPrice = req.body.orders.unitPrice;
                        let chietkhaudoitac = req.body.orders.chietkhaudoitac;
                        let SKU = req.body.orders.SKU;
                        let statusPayment = req.body.orders.statusPayment;
                        let statusDoiSoat = req.body.orders.statusDoiSoat;
                        // Deduct the number of pieces ordered from the quantity in database
                        // let arrNameProduct = JSON.stringify(nameProduct)
                        let arrNameProduct = nameProduct.join(',')
                        if (data.quantity > 0) {
                            data.quantity = data.quantity - inCart;

                            if (data.quantity < 0) {
                                data.quantity = 0;
                            }

                        } else {
                            data.quantity = 0;
                        }

                        // Insert order details w.r.t the newly created order Id
                        database.table('orders_details')
                            .insert({
                                user_id: userId,
                                order_id: newOrderId,
                                product_id: p.id,
                                quantity: inCart,
                                nameReceive: nameReceive,
                                maDonHang: maDonHang,
                                phoneReceive: phoneReceive,
                                addressReceive: addressReceive,
                                city: city,
                                maVanDon: maVanDon,
                                hinhThucDropShip: hinhThucDropShip,
                                quantityProduct: quantityProduct,
                                nameProduct: arrNameProduct,
                                totalPay: totalPay,
                                totalproduct: totalproduct,
                                unitPrice: unitPrice,
                                chietkhaudoitac: chietkhaudoitac,
                                SKU: SKU,
                                chietkhauSanpham: chietkhauSanpham,
                                statusPayment: statusPayment,
                                statusDoiSoat: statusDoiSoat,
                                // note: note
                            }).then(newId => {
                                database.table('products')
                                    .filter({ id: p.id })
                                    .update({
                                        quantity: data.quantity
                                    }).then(successNum => {
                                    }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                    });

                } else {
                    res.json({ message: 'New order failed while adding order details', success: false });
                }
                res.json({
                    message: `Order successfully placed with order id ${newOrderId}`,
                    success: true,
                    order_id: newOrderId,
                    products: products
                })
            }).catch(err => res.json(err));
    }

    else {
        res.json({ message: 'New order failed', success: false });
    }

});

// Payment Gateway
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({ success: true });
    }, 1000)
});

module.exports = router;