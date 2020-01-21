const mongoose = require('mongoose');
const Product = require('../models/products');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
          const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:' + process.env.PORT + '/products/' + doc._id
                    }
                }
            })
        }
            console.log("All products available : ", response);
            res.status(200).json(response);   
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.products_post_product = (req, res, next) => {
    
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });  
    product
        .save()
        .then(result => {
            console.log("Post done successfully : ", result)
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:/products/' + result._id
                    }
                }  
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.products_get_one_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            console.log("Single product : ", doc);
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'GET all other products',
                        url: 'http://localhost:' + process.env.PORT + '/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: "Valid ID but no product found for it", 
                    id: id
                });
            }  
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}

exports.products_update_one_product = (req, res, next) => {
    id = req.params.productId;
    Product.updateOne({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Updated successfully",
                request: {
                    type: 'PATCH',
                    url: 'http://localhost:' + process.env.PORT + '/products/' + id
                }
           })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
          
}

exports.products_delete_one_product = (req, res, next) => {
    id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(doc => {
            console.log("Deleted product : ", id);
            res.status(200).json({
                message: "Deleted successfully",
                request: {
                    type: 'POST',
                    url: 'http://localhost:' + process.env.PORT + '/products',
                    data: {
                        name: "String",
                        price: "Number"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}