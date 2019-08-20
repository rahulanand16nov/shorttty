const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const http = require('http').Server(app);
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const nanoid = require('nanoid');

const uri = "mongodb+srv://rahulanand16nov:Ra56123%4038@shortttycluster-nmp49.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true},(error, client) => {
  if(error) {
      throw error;
  }
  console.log("YEA");
  database = client.db('shortttydb');
  urlsCollection = database.collection("urls");
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function newID(shortid){
  
  urlsCollection.find({shortID:shortid}).toArray(function(error,document){
    if(error) throw error;
    // If ID is already used
    if(document.length!==0){
      shortid = nanoid(6);
      return shortid;
    } else {
      return shortid;
    }
})};

// API Endpoint for creating URL
app.post('/createURL',(req,res)=>{
  let ogURL;
  try{
      ogURL = new URL(req.body.ogURL);
  } catch (err){
    return res.send(err);
  }
  // If given URL already exists or not
   urlsCollection.find({originalURL:ogURL.href}).toArray(function(error,document){
    if(error) throw error;
    // Already in DB
    if(document.length!==0){
      res.send(document);
    } else 
    {
      // Given URL is not in the database so inserting it now
      let shortid = nanoid(6);
      shortid = newID(shortid);

      urlsCollection.insertOne({originalURL:ogURL.href,shortID:shortid},(error,result)=>
      {
        if(error)
        {
          return res.status(500).send(error);
        }
        res.send(result.result);
      });
    }
  });
});

// API endpoint to redirect
app.get("/:shortID",(req,res)=>{
const shortid = req.params.shortID;
console.log(shortid);
urlsCollection.find({shortID:shortid}).toArray(function(error,document){
  if(error) throw error;
  if(document.length===0){
    res.send("URL not found");
  } else {
    res.redirect(document[0].originalURL);
  }
});
});

http.listen(PORT, () => console.log(`Listening on ${ PORT }`));


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'));