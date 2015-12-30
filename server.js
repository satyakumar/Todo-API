var express = require('express');
var app = express();
var port = process.env.PORT || 4000;
var todos = [
	{
		id: 1,
		description: 'Learn Angular JS',
		complete: true
	},
	{
		id: 2,
		description: 'Practive Angular JS',
		complete: false,
	},
	{
		id: 3,
		description: 'Learn Node.JS',
		complete: false
	},
	{
		id: 4,
		description: 'Practive Node.JS',
		complete: false,
	}
	
];
app.get('/',function(req,res){
	res.send('To Do list app');
});
app.get('/todos',function(req,res) {
	res.json(todos);
});
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
app.listen(port,function() {
	console.log('Express server is running in the port of: '+port);
});