const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
require("dotenv").config();
const logger = require('../Utils/logger');

function connect(callback){
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const connection = mongoose.connection;
    connection.once('open', callback);
}

module.exports = {
    connect
};