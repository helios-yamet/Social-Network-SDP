const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const rn = require("random-number");
const { emailWelcomeGreet,emailOrName } =require('./Utilities');
const { unameTree,emailTree }=require('./Trees');
const bcrypt = require('bcryptjs');


//moongoose setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/ayefan', {
  useCreateIndex: true,
  useNewUrlParser: true
});


//mongod --dbpath C:\Users\SRx\Desktop\Database
//Database models
const {
      UserModel,GroupModel,UserInbox,GroupInbox,GroupChats,PostModel,ReactionsModel,UserActionsModel,UserNetworkModel,UserTogroupModel
} = require("./Models");


//trees initializers
UserModel.find({},"username email",(err,doc)=>{

  for(var i=0;i<doc.length;i++)
  {
    unameTree.insert(doc[i].username);
    emailTree.insert(doc[i].email);
  }

});


//////////**********Register************/////////////
router.get('/checkUsername',(req,res)=>{
  if (unameTree.search(req.query.username).length===0) {
    res.send(true);
  } else {
    res.send(false);
  }
});
router.get('/checkEmail', (req, res) => {
  if (emailTree.search(req.query.email).length === 0) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post('/registerOne',(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;
  const fullname = req.body.fullname;
  const country = req.body.country;
  const region = req.body.region;
  const email=req.body.email;
  emailWelcomeGreet(email);
  bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          let newUser = new UserModel({
            username: username,
            password: hash,
            fullname: fullname,
            email: email,
            intro: "",
            country: country,
            region: region,
            state: "",
            fans: 0,
            creationTime: new Date(),
            fanins: 0,
            group: [],
            NoPost: 0,
            avatar: "",
            coverphotoview: true,
            coverPhoto: "",
            coverVideo: "",
            story: "",
            blocked: []
          });

          newUser.save().then((data) => {
            unameTree.insert(username);
            emailTree.insert(email);
            res.send({ state: true });
          }, (e) => {
            console.log(e);
            res.send(false);
          });
        });
  });
});

//////////**********Login************/////////////
router.get('/signinCheck',(req,res)=>{
  
  if (emailOrName(req.query.identifier))
  {
    if (emailTree.search(req.query.identifier).length === 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  }
  else{
    if (unameTree.search(req.query.identifier).length === 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  }
});

router.post('/signin',(req,res)=>{
  if(emailOrName(req.body.username))
  {
    UserModel.findOne({ email: req.body.username }, 'password username', function (err, docs) {
      if (err === null) {
        bcrypt.compare(req.body.password, docs.password, function (err, response) {
          res.send({state:response,token:docs.username});
        });
      }
      else {
        res.send(false);
      }
    })
  }
  else{
    UserModel.findOne({ username: req.body.username }, 'password username', function (err, docs) {
      if (err === null) {
        bcrypt.compare(req.body.password, docs.password, function (err, response) {
          res.send({ state: response, token: docs.username });
        });
      }
      else {
        res.send(false);
      }
    })
  }

});


module.exports = router;