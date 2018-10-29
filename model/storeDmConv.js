var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/Conversation';

module.exports = function (event) {
    var user_id = event['sender_id_str']

    MongoClient.connect(mongoUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to MongoDB DmConv server");

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
                                    mtype: 'dm',
                                    uname: event['sender']['name'],
                                    utype: 'sender',
                                    uimg: event['sender']['profile_image_url'],
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
                        mtype: 'dm',
                        uname: event['sender']['name'],
                        utype: 'sender',
                        uimg: event['sender']['profile_image_url'],
                        // timestamp: new Date()
                        timestamp: event["created_at"]
                    }
                    ]}
                col.insertOne(conversation, function (err, r) {
                    assert.equal(null, err);
                    assert.equal(1, r.insertedCount);
                    console.log("inserted msg succesfully")
                    db.close();
                })
            }
        })


    })

}