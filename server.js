const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


//DBs
var db; 
var url = 'mongodb://localhost:27017/myproject';

//Connect to DB (local)
MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  db = database;
  console.log("Connected correctly to DB");
});

//App configs
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'dist')));

//Retrieve users from DB
app.get('/users', function(req,res){
    db.collection('user').find({}).toArray(function(err, doc){
        if(err)
        {
            console.log('failed to get /users');
        }
        else
        {
            res.status(200).json(doc);
        }
    }); 
});

//For user registration
app.post('/register', function(req,res){
    var newUser = req.body;
    newUser.role = "member";
    newUser.createDate = new Date();

    //Validate format
    if(req.body.username == '' || req.body.password == '')
    {
        handleError(res, "Invalid input", 'Must fill username or password', 200);
        return;
    }
    else if(req.body.username.length > 50 || req.body.password.length > 50)
    {
        handleError(res, "Invalid input", 'Username or password should not be more than 50 characters', 200);
        return;
    }

    //Insert to DB
    db.collection('user').insertOne(newUser, function(err,doc){
        if(err)
        {
            handleError(res, err.message, 'Failed creating user');
        }
        else
        {
            jsonReturn = 
            {
                'status':1,
                'message':'Succesfully register',
                'data': 
                        {
                            "username":newUser.username,
                            "role":newUser.role
                        }
            }
            res.status(201).json(jsonReturn);
        }
    });
});

//For user login
app.post('/login', function(req,res){
    var loginData = req.body;

    //Validate format
    if(req.body.username == '' || req.body.password == '')
    {
        handleError(res, "Invalid input", 'Must fill username or password', 200);
        return;
    }

    //Select one from DB
    db.collection('user').findOne({username: loginData.username, password: loginData.password}, function(err,doc){
        if(err)
        {
            handleError(res, err.message, "Authentication Error");
            return;
        }
        else
        {
            //If not exist
            if(!doc)
            {
                handleError(res, 'No data', 'Wrong username or password', 200);
                return;
            }
            //If exist
            else
            {
                jsonReturn = 
                {
                    'status':1,
                    'message':'Succesfully logged in',
                    'data': 
                    {
                        "username":doc.username,
                        "role":doc.role
                    }
                }
                res.status(200).json(jsonReturn);
            }
        }
    });

});



app.get('*', (req,res)=>
{
    res.sendFile(path.join(__dirname, 'dist/index.html'));    
});

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    var jsonReturn = 
    {
        'status':'0',
        'message':message,
        'data':''
    }
    res.status(code || 500).json(jsonReturn);
}

//App Port and HTTP
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);

server.listen(port, () => console.log('API Works on ' + port));