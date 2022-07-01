const MongoClient = require('mongodb').MongoClient;
const mongoDbUrl = process.env.DB_URL;
let mongodb;

function connect(callback){
    MongoClient.connect(mongoDbUrl, (err, db) => {
        mongodb = db;
        callback();
    });
}
function get(){
    return mongodb;
}

function close(){
    mongodb.close();
}

module.exports = {
    connect,
    get,
    close,
};