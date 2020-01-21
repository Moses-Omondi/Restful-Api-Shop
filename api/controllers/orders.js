const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/products');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .populate('product', 'name')
        .select('_id product quantity')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return{
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http;//localhost:' + process.env.PORT + '/orders/' + docs._id
                        }
                    }
                }),
            })
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                error: err
            })
        });
}

exports.orders_post_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                createdOrder: {
                    _id: result.id,
                    product: result.product,
                    quanitity: result.quantity,
                },
                request:{
                    type: 'GET',
                    url: 'http://localhost:' + process.env.PORT + '/orders/' + result.id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_get_one = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:' + process.env.PORT + '/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_delete_one = (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId})
     .exec()
     .then(result => {
         res.status(200).json({
             message: 'Order deleted successfully',
             request: {
                 type: 'POST',
                 url: 'http://localhost:' + process.env.PORT + '/orders',
                 body: {productId: "ID", quantity: "Number"}
             }
         })
     })
     .catch(err => {
         res.status(500).json({
             error: err
         })
     })
 }