var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var port = process.env.PORT || 4000;
var todoNextId = 1;
var todos = [];
app.use(bodyParser.json());
app.get('/',function(req,res){
	res.send('To Do list app');
});
// GET /todos
app.get('/todos',function(req,res) {
	res.json(todos);
});
// GET /todos/:id
app.get('/todos/:id',function(req,res) {
	var todoId = parseInt(req.params.id,10);
	var matchedId = _.findWhere(todos,{id: todoId}); // http://underscorejs.org/#findWhere
	if(matchedId) {
		res.json(matchedId);
	} else {
		res.status(404).send();
	}
});
// POST /todos
app.post('/todos',function(req,res) {
	var body = _.pick(req.body,'description','complete'); // http://underscorejs.org/#pick
	if(!_.isBoolean(body.complete) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(404).json({"error": "Please use valid parameters!"}); // Here by using return key word will stops the execution
	}
	body.id = todoNextId++;
	body.description = body.description.trim();
	todos.push(body);
	console.log(body);
	res.json(body);
});
app.listen(port,function() {
	console.log('Express server is running in the port of: '+port);
});