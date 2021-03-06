var express = require('express');
var router  = express.Router();
var Item    = require('../models/item');
var User    = require('../models/user')
/* GET users listing. */
router.route('/')
	.get(function(req,res){
			res.json({ message: 'hooray! welcome to our api!' });
		})

router.route('/item')
    // create a sticker (accessed at POST http://localhost:8080/api/stickers)
    .post(function(req, res) {
        var uid = req.body.token || req.query.token || req.headers['x-user-id'];

        var item = new Item({
            date: req.body.date,
            total_time: req.body.total_time,
            notes: req.body.notes,
            creator: uid
        }); // create a new instance of the sticker model

        // save the sticker and check for errors
        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'added' });
        });
    })
    .get(function(req,res){
        var uid = req.body.token || req.query.token || req.headers['x-user-id'];
    	Item.find({creator: uid},function(err, items){
            if (err)
                res.send(err);
            // items = items.filter(function(user) {
                res.json(items);
            // })
        })
    })
router.route('/item/:id')
    .get(function(req,res){
        Item.findById({_id: req.params.id}, function(err, item){
            if(err) res.json({message: "not found"});
            res.json(item) ;
        })
    })
    .put(function(req, res) {
        Item.findById(req.params.id, function(err, item) {
            if (err)
                res.send(err);
            // update the item info
            item.date = req.body.date;  
            item.total_time = req.body.total_time;
            item.notes = req.body.notes;
            // save the item
            item.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'item updated!' });
            });

        });
    })
    .delete(function(req, res) {
        Item.remove({
            _id: req.params.id
        }, function(err, item) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

    // route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
module.exports = router;
