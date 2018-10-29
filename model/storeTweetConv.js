// var Twitter = require('twitter')
// var client = new Twitter({
//     consumer_key: 'N6YAdXYnoZ98eTNcqN1wvLOJC',
//     consumer_secret: 'D2yRfFht0nmgvBsjMKed2D4gaH7HC2WTq5c7wO14pxInBgJCeZ',
//     access_token_key: '815869648562360320-NbeUdDzi47oZRQy4VLfD5E4VbkXstvM',
//     access_token_secret: 'Kz8T3Fnoy1SnaLDblaEiC6mbGwXSl8lmw9xlzl8zDHb7Y'
// });

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/Conversation';

// client.stream('statuses/filter', {track: '@railminindia'}, function(stream) {
//
//     stream.on('data', function(event) {
//

module.exports = function (event) {
    var user_id = event['user']['id_str']

    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB tweetConv server");

        db.createCollection(user_id, {strict: true}, function (err, col) {
            if(err != null){
                console.log('collection already exist')
                db.collection(user_id, function (err, cl) {
                    cl.update({convers_id: user_id},
                        {
                            $push: {
                                msg : {
                                    mid: event['id_str'],
                                    mtext: event['text'],
                                    mtype: 'tweet',
                                    uname: event['user']['name'],
                                    utype: 'sender',
                                    uimg: event['user']['profile_image_url'],
                                    timestamp: event['created_at']
                                }
                            }
                        }, function (err, saved) {
                            if(err || !saved){
                                console.log(err)
                            } else {
                                console.log('save msg was successful')
                            }
                        })
                })
            } else {
                console.log('new collection created')
                var conversation = {
                    convers_id: user_id,
                    msg : [{
                        mid: event['id_str'],
                        mtext: event['text'],
                        mtype: 'tweet',
                        uname: event['user']['name'],
                        utype: 'sender',
                        uimg: event['user']['profile_image_url'],
                        // timestamp: new Date()
                        timestamp: event["created_at"]
                    }
                    ]}
                col.insertOne(conversation, function (err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    console.log("inserted msg successfully")
                    db.close();
                })
            }
        })
    })
}


//         })
//
//     stream.on('error', function(error) {
//         throw error;
//     })
// })


    // db.collection('rails', {}, function (err, coll) {
    //
    //     if (err != null) {
    //         console.log('collection does not exist')
    //     } else if (err == null){
    //         console.log('collection already exist')
    //     } else {
    //         console.log('no luck')
    //     }
    //
    // })
    // db.createCollection( user_id, function (err, col) {
    //
    // })
