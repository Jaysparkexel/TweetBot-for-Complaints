var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/tweeterDB';

var aylien = require("../Sentiment/aylien")
var googleCloud = require("../Sentiment/googlecloud")
var storeTweet = require("./storeTweet")
var storeTweetConv = require("./storeTweetConv")

var stream;
var tweetServerOn = false

module.exports.startServer = function (tag, selectedNlp, io, T) {

    MongoClient.connect(mongoUrl, function(err, db) {
        if(err != null){
            console.log("Error: Some problem with mongo server")
            console.log("description: "+ err)
            process.exit(1)
        }
        assert.equal(null, err);
        console.log("Connected to mongo server correctly from tweetStream");
        var scol = db.collection('stweet')

        stream = T.stream('statuses/filter', {track: tag})

        stream.on('connect', function (conMsg) {
            console.log('Connected to twitter stream of status successfully')
            tweetServerOn = true
            io.emit("startServerAck", tweetServerOn)
        })

        stream.on('disconnect', function (disconnectMessage) {
            console.log('Disconnected from twitter stream of status: ' +disconnectMessage)
        })

        stream.on('tweet', function (event) {

            var tweet = event.text
            console.log("TWEET:" +tweet)
            var uid = event["user"]["id_str"]
            scol.find({"user.id_str": uid }).limit(1).toArray(function (err, doc) {
                if (doc.length == 0) {

                    if (selectedNlp == 'Google') {
                        var gc = new googleCloud.GCloudObject("savvy-scion-162810", "C:/Users/Jay/Desktop/Projects/NodeJS/socket/Auth/MyFirstProject-119b460170be.json")
                        gc.getSentiMentType(tweet, function (senti) {
                            console.log("Using Google Cloud")
                            if (senti == 'NEGATIVE') {
                                console.log('negative tweet found')
                                storeTweet(event, io)
                                storeTweetConv(event)
                            } else {
                                console.log('Not negative tweet found')
                            }
                        })
                    } else {
                        var ay = new aylien.AylienObject("5ba44115", "acb79485e9e49cd41fb39bf234a4f19b")
                        ay.getSentiMentType(tweet, function (senti) {
                            console.log("Using Aylien")
                            if (senti == 'NEGATIVE') {
                                console.log('negative tweet found')
                                storeTweet(event, io)
                                storeTweetConv(event)
                            } else {
                                console.log('Not negative tweet found')
                            }
                        })
                    }

                } else {
                    storeTweet(event, io)
                    storeTweetConv(event)
                }

            })


        });

        stream.on('error', function (error) {
            throw error;
        });
    })
}

module.exports.stopServer = function () {
    stream.stop()
    tweetServerOn = false
}

module.exports.getServerStatus = function () {
    return tweetServerOn
}
