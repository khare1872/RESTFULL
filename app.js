//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB",{useNewUrlParser:true});

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);
//----------------------------------code for column one of rules for restful apis--------------------------------------------------//
app.route('/articles')
.get(function(req,res){
  Article.find(function(err,found){
    if(err) res.send("Unable to process Your request because of"+err);
    else res.send(found);
  });
})
.post(function(req,res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err) res.send("unsuccessful");
    else res.send("Successful");
  });
})
.delete(function(req,res){
  Article.deleteMany(
    function(err){
      if(err) res.send("Error");
      else res.send("Successfully Deleted");
    }
  );
});
// ---------------------------------first column ends here---------------------------------------------------//
//------------------------------------code for verbs for specific articles column 2----------------------------------------------//
app.route("/articles/:articleTitle")
.get(function(req,res){

  Article.findOne({title:req.params.articleTitle},function(err,found){
    if(!found) res.send("No Such Article Exists in our database");
    else res.send(found);
  });
})
.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err,updatedArticle){
      if(err) res.send("Couldn't update");
      else res.send("successfully updated");
    }
  );
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},

    function(err){
      if(!err) res.send("Successfully updated the article");
      else res.send(err);
    }
  );
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err) res.send("Successfully Deleted");
      else res.send("Sorry");
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
