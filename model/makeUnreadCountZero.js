var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

module.exports = function (userId) {
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);

        var scol = db.collection('stweet')

        scol.findOneAndUpdate({"user.id_str": userId},{
            $set: {
                "unreadCount": 0
            }
        }, {returnOriginal: false}, function (err, udoc) {
            if(err){
                console.log('Error making unread count zero')
            } else {
                console.log('Made unread count zero successfully')
                // console.log(udoc)
            }
        } )

    })
}