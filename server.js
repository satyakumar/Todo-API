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
// GET /todos?complete=true
// GET /todos?complete=true&q=goto
app.get('/todos',function(req,res) {
	var queryParams = req.query;
	var filterTodos = todos;
	if(queryParams.hasOwnProperty('complete') && queryParams.complete === 'true') {
		filterTodos = _.where(filterTodos, {'complete': true});
	} else if(queryParams.hasOwnProperty('complete') && queryParams.complete === 'false'){
		filterTodos = _.where(filterTodos, {'complete': false});
	}
	if(queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
		filterTodos = _.filter(filterTodos,function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.trim().toLowerCase()) > -1;
		})
	}
	res.json(filterTodos);
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
// DELETE /todos/:id
app.delete('/todos/:id',function(req,res) {
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos, {id: todoId});	
	if(!matchedTodo) {
		res.status(404).json({"error": "No todo found with that id."});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(todos);
	}
});
// PUT /todos/:id
app.put('/todos/:id',function(req,res) {
	var todoId = parseInt(req.params.id,10);
	var matchedTodo = _.findWhere(todos,{id: todoId});
	var body = _.pick(req.body,'description','complete');
	var validAttributes = {};
	if(!matchedTodo) {
		return res.status(404).json({"error": "No todo found with that id."});
	}
	if(body.hasOwnProperty('complete') && _.isBoolean(body.complete)) {
		validAttributes.complete = body.complete;
	} else if(body.hasOwnProperty('complete')){
		return res.status(404).send();
	}
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description.trim();
	} else if(body.hasOwnProperty('description')) {
		return res.status(404).send();
	}
	_.extend(matchedTodo,validAttributes);
	res.json(matchedTodo);
	
});
app.listen(port,function() {
	console.log('Express server is running in the port of: '+port);
});