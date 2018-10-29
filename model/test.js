// var Twitter = require('twitter')
// var client = new Twitter({
//     consumer_key: 'N6YAdXYnoZ98eTNcqN1wvLOJC',
//     consumer_secret: 'D2yRfFht0nmgvBsjMKed2D4gaH7HC2WTq5c7wO14pxInBgJCeZ',
//     access_token_key: '815869648562360320-NbeUdDzi47oZRQy4VLfD5E4VbkXstvM',
//     access_token_secret: 'Kz8T3Fnoy1SnaLDblaEiC6mbGwXSl8lmw9xlzl8zDHb7Y'
// });
//
// client.stream('user', function(stream) {
//     stream.on('data', function (event) {
//       //  console.log("tweet")
//         if(event.direct_message){
//             console.log(" 1")
//         }
//        // console.log(event)
//     })
//
//     stream.on('direct_message', function (direct_message) {
//         console.log(direct_message)
//     })
//
// })

var Twit = require('twit')

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

var T = new Twit({
    consumer_key:         'N6YAdXYnoZ98eTNcqN1wvLOJC',
    consumer_secret:      'D2yRfFht0nmgvBsjMKed2D4gaH7HC2WTq5c7wO14pxInBgJCeZ',
    access_token:         '815869648562360320-NbeUdDzi47oZRQy4VLfD5E4VbkXstvM',
    access_token_secret:  'Kz8T3Fnoy1SnaLDblaEiC6mbGwXSl8lmw9xlzl8zDHb7Y'
})

MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to MongoDB Dm server");

    var scol = db.collection('stweet')

    // scol.find({ $text: { $search: "rakesh" } }).toArray(function (err, db) {
    //     if(err){
    //         console.log(err)
    //     } else {
    //         console.log("found")
    //         db.forEach(function (col) {
    //             console.log(col)
    //         })
    //     }
    // })


        var val = "vi"
        scol.find({ "user.name" : { $regex: new RegExp(val, 'i') } }).toArray(function (err, db) {
                if(err){
                    console.log(err)
                } else {
                    console.log("found")
                    db.forEach(function (col) {
                        console.log(col)
                    })
                }
            })


        })

//
// var ac = require("./accountCredentials")
// ac.updateFollowerList("#vbdsac")
// ac.getFollowersList(function (follwersList) {
//     console.log(follwersList)
// })
// ac.saveFollowersList(T)

// ac.saveAccountCredential(T)
// console.log(j)
// setInterval(function () {
//     ac.getAccountJson()
// }, 1800000)
// T.get('account/verify_credentials', { skip_status: true })
//     .catch(function (err) {
//         console.log('caught error', err.stack)
//     })
//     .then(function (result) {
//         var json = result.data
//         MongoClient.connect(mongoUrl, function (err, db) {
//             assert.equal(null, err);
//
//             var col = db.collection('AccountCredential')
//
//             col.find({}).limit(1).toArray(function (err, doc) {
//                 if (doc.length == 0) {
//                     col.insertOne(json, function (err, r) {
//                         assert.equal(null, err);
//                         assert.equal(1, r.insertedCount);
//                         console.log("new")
//                     })
//                 } else {
//                     col.updateOne({}, json, function (err, r) {
//                         console.log("update")
//                     })
//
//                 }
//             })
//         })
//     })

// var dmStream = require("./dmStream")
//
// dmStream.startServer(T)
// console.log(dmStream.getServerStatus())
// dmStream.stopServer()
// console.log(dmStream.getServerStatus())


// var stream = T.stream('user');
//
// var MongoClient = require('mongodb').MongoClient
//     , assert = require('assert');
//
// var mongoUrl = 'mongodb://localhost:27017/tweeterDB';
//
// stream.on('direct_message', function (eventMsg) {
//     console.log(eventMsg.direct_message.text)
//     var dm = checkDM(eventMsg)
//     if(dm == true){
//         console.log("direct message")
//     } else {
//         console.log("tweet")
//     }
    // MongoClient.connect(mongoUrl, function(err, db) {
    //     assert.equal(null, err);
    //     console.log("Connected correctly to server");
    //     var col = db.collection('tweet');
    //     if(eventMsg['direct_message']){
    //         console.log("direct message detected")
    //         col.insertOne(eventMsg['direct_message'], function(err, r) {
    //             assert.equal(null, err);
    //             assert.equal(1, r.insertedCount);
    //             console.log("inserted succesfully")
    //             // Finish up test
    //             // db.close();
    //         });
    //     }
    //
    // })

// })

// stream.on('connect', function (conMsg) {
//     console.log("connected to direct message stream")
// })
//
// var stream2 = T.stream('statuses/filter', { track: '@railminindia' })
//
// stream2.on('tweet', function (tweet) {
//     console.log(tweet.text)
//     var dm = checkDM(tweet)
//     if(dm == true){
//         console.log("direct message")
//     } else {
//         console.log("tweet")
//     }
//
//
// })
// stream2.on('connect', function (disconnectMessage) {
//     console.log("connected to status stream")
// })
//
// function checkDM(event) {
//     if (event['direct_message']){
//         return true
//     }
//     else {
//         return false
//     }
//
// }


// stream2.on('disconnect', function (disconnectMessage) {
//     console.log("disconnected from twitter stream 2")
// })

// stream.on('disconnect', function (disconnectMessage) {
//     console.log("disconnected from twitter stream 1")
// })
// stream.on('connect', function (disconnectMessage) {
//     console.log("connected to twitter stream 1")
// })