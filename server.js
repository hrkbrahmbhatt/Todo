//server .js

//set up

var express = require('express');
var app = express();    // create our app with express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan') // HTTP request logger middleware for node.js
var bodyParser = require('body-parser'); // pull info from html post
var methodOverride = require('method-override'); // simulate Delete and put


mongoose.connect('mongodb+srv://username:password@cluster0-aahff.mongodb.net/todo');     // connect to mongoDB database on mLab

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev'));  // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());      // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());



//define Model

var Todo = mongoose.model('Todo', {

        text : String

});


// routes =============================================================

//api -------------------------------------------------------

//get all todos

app.get('/api/todos', function(req, res){

    //get all todos
    Todo.find(function(err, todos){

        if(err)
          res.send(err)

          res.json(todos); // return all todos in json
    });

});


//create todo and send all todos after creation

app.post('/api/todos', function(req,res){

    //create a todo, info comes from ajax req from angular
    Todo.create({

        text : req.body.text,
        done : false
      }, function (err, todo){
        if (err)
            res.send(err);

        //get and return all the todos after create another

      Todo.find(function(err, todos){

          if(err)
            res.send(err)

            res.json(todos);

      });

    });

});


//delete a todo

app.delete('/api/todos/:todo_id', function(req, res){

    Todo.remove({

          _id : req.params.todo_id
        },
        function (err, todo) {

            if(err)
              res.send(err);

          //get and return all the todos after you create another


                Todo.find(function(err, todos){

                    if(err)
                      res.send(err)

                      res.json(todos);

                });
    });
});

// application

app.get('*', function(req, res){

  res.sendFile('./public/index.html'); // first page, angular will handle it

});



    // listen (start app with node server.js) ======================================

    app.listen(8080);
    console.log("App listening on port 8080");
