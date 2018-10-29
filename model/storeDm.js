var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

module.exports = function (event, io) {
    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB Dm server");

        var col = db.collection('tweet');
        col.insertOne(event, function(err, r) {
            assert.equal(null, err);
            assert.equal(1, r.insertedCount);
            console.log("inserted succesfully")
            // Finish up test
            // db.close();
        });

        var scol = db.collection('stweet')

        var uid = event["sender_id_str"]
        scol.find({"user.id_str": uid }).limit(1).toArray(function (err, doc) {
            if (doc.length == 0) {
                var sdoc = {
                    "created_at": event["created_at"],
                    "new_user": true,
                    "type": "dm",
                    "id": event["id"],
                    "id_str": event["id_str"],
                    "text": event["text"],
                    "unreadCount": 1,
                    "user": {
                        "id": event["sender_id"],
                        "id_str": event["sender_id_str"],
                        "name": event["sender"]["name"],
                        "screen_name": event["sender"]["screen_name"],
                        "profile_image_url_https": event["sender"]["profile_image_url_https"],
                        "default_profile_image": event["sender"]["default_profile_image"],
                        "protected": event["sender"]["protected"],
                        "location": event["sender"]["location"]
                    }
                }
                scol.insertOne(sdoc, function (err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    console.log("inserted dm successfully for new user")
                    io.emit('tweet', sdoc)
                    db.close()
                })
            }
            else {
                scol.findOneAndUpdate({"user.id_str": event["sender_id_str"]},{
                    $set: {
                        "created_at": event["created_at"],
                        "new_user": false,
                        "type": "dm",
                        "id": event["id"],
                        "id_str": event["id_str"],
                        "text": event["text"],
                        "user.id": event["sender_id"],
                        "user.id_str": event["sender_id_str"],
                        "user.name": event["sender"]["name"],
                        "user.screen_name": event["sender"]["screen_name"],
                        "user.profile_image_url_https": event["sender"]["profile_image_url_https"],
                        "user.default_profile_image": event["sender"]["default_profile_image"],
                        "user.protected": event["sender"]["protected"],
                        "user.location": event["sender"]["location"]
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
                // scol.deleteOne({"user.id_str": event["sender_id_str"]}, function (err, r) {
                //     if(err == null){
                //         console.log("deleted existing stweet for user successfully")
                //     }
                //
                //     var sdoc = {
                //         "created_at": event["created_at"],
                //         "new_user": false,
                //         "type": "dm",
                //         "id": event["id"],
                //         "id_str": event["id_str"],
                //         "text": event["text"],
                //         "user": {
                //             "id": event["sender_id"],
                //             "id_str": event["sender_id_str"],
                //             "name": event["sender"]["name"],
                //             "screen_name": event["sender"]["screen_name"],
                //             "profile_image_url_https": event["sender"]["profile_image_url_https"],
                //             "default_profile_image": event["sender"]["default_profile_image"],
                //             "protected": event["sender"]["protected"],
                //             "location": event["sender"]["location"]
                //         }
                //     }
                //     scol.insertOne(sdoc, function (err, r) {
                //         assert.equal(null, err);
                //         assert.equal(1, r.insertedCount);
                //         console.log("inserted dm successfully for existing user")
                //         io.emit('tweet', sdoc)
                //         db.close()
                //     })
                // })
            }
            scol.createIndex({"user.name": "text"}, {background: true}, function (err, indexname) {

            })
        })


    })

}