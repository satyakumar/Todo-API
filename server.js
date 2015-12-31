var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 4000;
var todoNextId = 1;
var todos = [];
console.log(todoNextId)
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
	var matchedId;
	var id = parseInt(req.params.id,10);
	todos.forEach(function(todo) {
		if(todo.id === id) {
			matchedId = todo;
		}
	});
	if(matchedId) {
		res.json(matchedId);
	} else {
		res.status(404).send();
	}
});
// POST /todos
app.post('/todos',function(req,res) {
	var body = req.body;
	body.id = todoNextId++;
	todos.push(body);
	console.log(body);
	res.json(body);
});
app.listen(port,function() {
	console.log('Express server is running in the port of: '+port);
});