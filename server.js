console.log('Server-side code running');

const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
let score = 0;
// serve files from the public directory
app.use(express.static('public'));

// needed to parse JSON data in the body of POST requests
app.use(bodyparser.json());

// connect to the db and start the express server
let db;

// Replace the URL below with the URL for your database
const url =  'mongodb://@localhost:27017/clicks';
//const url =  'mongodb://n00143569:n00143569@daneel:27017/n00143569';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/canvasclicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks2').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.redirect('/');
  });
});

//Gets single highscore
app.get('/highscore', (req, res) => {
  db.collection('highscore').findOne({}, (err, result) => {
    if (err) return console.log(err); // log if error occurs
    if(!result) return res.send({score:0}); // if no data in the DB return 0
    res.send(result); // if neither of the above, send the score from the DB
  });
});


//Updates single highscore
app.put('/highscore', (req, res) => {
  console.log('Data received: ' + JSON.stringify(req.body));
  db.collection('highscore').update({}, req.body, {upsert: true}, (err, result) => {
    if (err) {
      return console.log(err);
    }
  });
  res.sendStatus(200); // respond to the client indicating everything was ok
});


//Will get all highscores
app.get('/leaderboard', (req, res) => {
  db.collection('leaderboard').find({}).sort({score: -1}).limit(10).toArray(function(err, result) {
    if (err) return console.log(err); // log if error occurs
    if(!result) return res.send({score:0}); // if no data in the DB return 0
    res.send(result); // if neither of the above, send the score from the DB
  });
});

//sends to leaderboard
app.put('/leaderboard', (req, res) => {
  console.log('Data received: ' + JSON.stringify(req.body));
  db.collection('leaderboard').save(req.body, {upsert: true}, (err, result) => {
    if (err) {
      return console.log(err);
    }
  });
  res.sendStatus(200); // respond to the client indicating everything was ok
});