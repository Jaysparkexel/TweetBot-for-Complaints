var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var deleteTweet = require("./deleteTweet")
var deleteTweetConv = require("./deleteTweetConv")
var fetchConv = require("./fetchConv")

var mongoUrl1 = 'mongodb://localhost:27017/closedCase';

var mongoUrl2 = 'mongodb://localhost:27017/tweeterDB' ;

// var mongoUrl3 = 'mongodb://localhost:27017/Conversation';

module.exports.fetchTweet = function (uid, _callback) {
    MongoClient.connect(mongoUrl2, function(err, db) {
        assert.equal(null, err);
        var scol = db.collection('stweet')

        scol.find({ "user.id_str" : uid }).toArray(function (err, doc) {
            db.close()
            if(doc.length == 0){
                console.log("Error finding " +uid +" user's tweet in close case module.")
                _callback(false)
            } else {
                _callback(doc)
            }
        })

    })
}

// module.exports.fetchConversation = function (uid, _callback) {
//     MongoClient.connect(mongoUrl3, function(err, db) {
//         assert.equal(null, err);
//         var col = db.collection(uid)
//         var cursor = col.findOne({}, function (err, doc) {
//             if(err) {
//                 console.log("Error finding " +uid +" user's conversation in close case module.")
//                 _callback(false)
//             } else {
//                 _callback(doc)
//             }
//         })
//
//     })
// }


module.exports.close = function (uid, io) {
    this.fetchTweet(uid, function (tweet) {
        if(tweet != false){
            fetchConv(uid, function (convers) {
                if(convers != false){
                    MongoClient.connect(mongoUrl1, function (err, db) {
                        assert.equal(null, err);
                        var col = db.collection(uid)
                        var json = {
                            "tweet": tweet,
                            "Conversation": convers
                        }
                        col.insertOne(json, function (err, r) {
                            assert.equal(null, err);
                            assert.equal(1, r.insertedCount);
                            console.log("inserted Closed Case successfully")
                            deleteTweetConv(uid)
                            deleteTweet(uid, function (val) {
                                io.emit("closeCaseRes", true)
                            })
                        })
                    })
                }
            })
        }
    })
}

module.exports.loadMoule = function () {
    console.log("Module: Case Close loaded")
}


