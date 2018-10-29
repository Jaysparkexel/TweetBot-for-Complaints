var fetchConv = require("../model/fetchConv")
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/Conversation';

module.exports = function (user_id, event, io) {
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);

        db.collection(user_id, function (err, col) {
            col.update({convers_id: user_id},
                {
                    $push: {
                        msg : {
                            mid: event['id_str'],
                            mtext: event['text'],
                            mtype: 'tweet',
                            uname: event['user']['name'],
                            utype: 'receiver',
                            uimg: event['user']['profile_image_url'],
                            timestamp: event['created_at']
                        }
                    }
                }, function (err, saved) {
                    if(err || !saved){
                        console.log(err)
                    } else {
                        console.log('save sended status update was successful')
                        fetchConv(user_id, function (doc) {
                            io.emit('ConveResNew', doc)
                        })
                    }
                })
        })

    })

}