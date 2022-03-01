var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var dbName = "express-mongo";
let dburl = `mongodb+srv://user1:Admin123@cluster0.1pd8r.mongodb.net/${dbName}`;
module.exports = { dburl, MongoClient, mongodb };
