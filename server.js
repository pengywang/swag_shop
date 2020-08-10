var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({entended:false}));

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.post('/product', function(req,res) {
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function(err, saveProduct){
        if(err) {
            res.status(500).send({error:"can't save"});
        } else {
            res.status(200).send(saveProduct);
        }
    });
});

 
app.get('/product', function(req, res){
    Product.find({}, function(err, products) {
        if(err){
            res.status(500).send({error: "Couldn't find"});
        } else {
            res.send(products);
        }
    });
});

app.post('/wishlist' , function(req, res){
    var wishList = new WishList();
    wishList.title = req.body.title;
    
    wishList.save(function(err, newWishList){
        if(err){
            res.status(500).send({error: "Can't find wishlists"});
        } else {
            res.send(newWishList);
        }
    });
});

app.get('/wishlist', function(req, res){
    WishList.find({}). populate({path:'products', model: 'Product'}).exec(function(err,wishLists){
        if(err) {
            res.status(500).send({error:"Could not fetch wishlists"});
        } else {
            res.status(200).send(wishLists);
        }
    });
                  });
    
app.put('/wishlist/product/add', function(req, res){
    Product.findOne({_id: req.body.productId}, function(err, product){
        if(err) {
            res.status(500).send({error:"Can't add item to wishlist"});
        } else {
            WishList.update({_id:req.body.wishListId}, {$addToSet:{products:product._id}}, function(err, wishList){
                if(err) {
                    res.status(500).send({error:"cound add into wishlist"});
                } else {
                    res.send(wishList);
                }
            });
        }
    });
});
app.listen(3600,function(){
    console.log("Swag Shop API running on port 3600");
})