var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

module.exports = function (event, io) {
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB Tweet server");

        var col = db.collection('tweet');
        col.insertOne(event, function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            console.log("inserted succesfully")
            // Finish up test
           // db.close();
        });

        var scol = db.collection('stweet')

        var uid = event["user"]["id_str"]

        scol.find({"user.id_str": uid }).limit(1).toArray(function (err, doc) {
            if (doc.length == 0) {
                var sdoc = {
                    "created_at": event["created_at"],
                    "new_user": true,
                    "type": "tweet",
                    "id": event["id"],
                    "id_str": event["id_str"],
                    "text": event["text"],
                    "unreadCount": 1,
                    "user": {
                        "id": event["user"]["id"],
                        "id_str": event["user"]["id_str"],
                        "name": event["user"]["name"],
                        "screen_name": event["user"]["screen_name"],
                        "profile_image_url_https": event["user"]["profile_image_url_https"],
                        "default_profile_image": event["user"]["default_profile_image"],
                        "protected": event["user"]["protected"],
                        "location": event["user"]["location"]
                    }
                }
                scol.insertOne(sdoc, function (err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    console.log("inserted stweet successfully for new user")
                    io.emit('tweet', sdoc)
                    db.close()
                })
            }
            else {

                scol.findOneAndUpdate({"user.id_str": event["user"]["id_str"]},{
                    $set: {
                        "created_at": event["created_at"],
                        "new_user": false,
                        "type": "tweet",
                        "id": event["id"],
                        "id_str": event["id_str"],
                        "text": event["text"],
                        "user.id": event["user"]["id"],
                        "user.id_str": event["user"]["id_str"],
                        "user.name": event["user"]["name"],
                        "user.screen_name": event["user"]["screen_name"],
                        "user.profile_image_url_https": event["user"]["profile_image_url_https"],
                        "user.default_profile_image": event["user"]["default_profile_image"],
                        "user.protected": event["user"]["protected"],
                        "user.location": event["user"]["location"]
                    },
                    $inc: {
                        "unreadCount": 1
                    }
                }, {returnOriginal: false}, function (err, udoc) {
                    if(err){
                        console.log('Error updating new tweet coming from twitter stream')
                    } else {
                        console.log("inserted stweet successfully for existing user")
                        // console.log(udoc)
                        io.emit('tweet', udoc['value'])
                    }
                } )
            }

        })


    });

}
