const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const http = require('http').Server(app);
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const uri = "mongodb+srv://rahulanand16nov:Ra56123%4038@shortttycluster-nmp49.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err=>{
    const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
})


http.listen(PORT, () => console.log(`Listening on ${ PORT }`));


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));