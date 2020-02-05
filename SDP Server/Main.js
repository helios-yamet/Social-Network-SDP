const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

//file routes

/* authentication routes */
var Authroutes= require('./Auth.js');
var DataFetchrouter=require('./DataFetch');
var Searchrouter=require('./search');
var PostCreateRouter=require('./PostStore');

//middlewares
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use("/auth", Authroutes);
app.use("/data", DataFetchrouter);
app.use("/search", Searchrouter);
app.use("/createpost",PostCreateRouter);



app.listen(port,()=>{
    console.log("it's live")
});