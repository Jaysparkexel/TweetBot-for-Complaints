var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/Conversation';

module.exports = function (data, _callback) {
    MongoClient.connect(mongoUrl, function(err, db) {
        var col = db.collection(data)
        var cursor = col.findOne({}, function (err, doc) {
            db.close()
            _callback(doc)
        })

    })
}

