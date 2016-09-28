var express = require('express');
var request = require('request');
var router = express.Router();
var Item = require('../models/item');
var myapi = require('../config/API');
router.route('/')
	.get(isLoggedIn,function(req,res){
		Item.count({},function(err, num){
		res.render('cms/index',{
			headerPath: 'Home',
			user: req.user,
			number_items: num
		})
		})
	})
router.get('/listitem', isLoggedIn, function(req,res){
	request(myapi.ADD_GET_ALL, function (error, response, body) {
    	if (!error && response.statusCode == 200) {
       		res.render('cms/list',{
               	headerPath: 'Item',
               	user: req.user,
               	responseMsg: '',
               	item_list: JSON.parse(body)
           	})
     	}
	})
})
router.route('/item')
	.get(isLoggedIn, function(req, res){
		res.render('cms/add',{
			headerPath: 'Edit Item',
			user: req.user,
            responseMsg: '',
            form_action: '/cms/item',
            item: ""
		})
	})
	.post(function(req,res){
		var options = {
			url: myapi.ADD_GET_ALL,
			form:{
				date: req.body.date,
				total_time: req.body.total_time,
				notes: req.body.notes,
			},
			method: 'POST'
		}
		request(options, function(err, response, body){
			res.render('cms/response',{
				headerPath: 'Add New',
				user: req.user,
				responseMesage: "record was added !"
			})
		})
	})
router.route('/item/:id')
	.get(isLoggedIn, function(req, res){
		var options = {
			url: myapi.UPDAE_GET_ONE+req.params.id,
  			method: 'GET'
		};

		request(options, function (error, response, body) {
    		if (!error && response.statusCode == 200) {
    			console.log(JSON.parse(body))
        		res.render('cms/add',{
                	headerPath: 'Edit Item',
                	user: req.user,
                	responseMsg: '',
                	form_action: '/cms/item/'+req.params.id,
                	item: JSON.parse(body)
            	})
     		}
		})
	})
	.post(function(req,res){
		var options = {
			url: myapi.UPDAE_GET_ONE+req.params.id,
			form:{
				date: req.body.date,
				total_time: req.body.total_time,
				notes: req.body.notes,
			},
			method: 'PUT'
		}
		request(options, function(err, response, body){
			res.render('cms/response',{
				headerPath: 'Update',
				user: req.user,
				responseMesage: "record was updated !"
			})
		})
	})
router.route('/deleteitem/:id')
	.get(isLoggedIn,function(req,res){
		var options = {
			url: myapi.UPDAE_GET_ONE+req.params.id,
			method: 'DELETE'
		}
		request(options, function(err, response, body){
			res.render('cms/response',{
				headerPath: 'Delete',
				user: req.user,
				responseMesage: "record was deleted !"
			})
		})
	})
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
module.exports = router;