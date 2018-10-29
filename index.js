var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twit = require('twit')
var bodyParser = require("body-parser");
var tweetStream = require("./model/tweetStream");
var dmStream = require("./model/dmStream");
var path = require('path')
var fetchTweet = require("./model/fetchTweet")
var fetchConv = require("./model/fetchConv")
var updateStatus = require('./Twitter/updateStatus')
var storeStatusUpdateConv = require('./model/storeStatusUpdateConv')
var storeNewDmSendedConv = require('./model/storeNewDmSendedConv')
var storeStatusUpdate = require('./model/storeStatusUpdate')
var storeNewDmSended = require('./model/storeNewDmSended')
var checkFollowing = require('./Twitter/checkFollowing')
var sendDm = require('./Twitter/sendDM')
var accountCredential = require('./model/accountCredentials')
var makeUnreadCountZero = require('./model/makeUnreadCountZero')
var searchTweet = require('./model/searchTweet')
var deleteTweet = require('./model/deleteTweet')
var deleteTweetConv = require('./model/deleteTweetConv')
var closeCase = require('./model/closeCase')

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}))

var T = new Twit({
    consumer_key:         'N6YAdXYnoZ98eTNcqN1wvLOJC',
    consumer_secret:      'D2yRfFht0nmgvBsjMKed2D4gaH7HC2WTq5c7wO14pxInBgJCeZ',
    access_token:         '815869648562360320-NbeUdDzi47oZRQy4VLfD5E4VbkXstvM',
    access_token_secret:  'Kz8T3Fnoy1SnaLDblaEiC6mbGwXSl8lmw9xlzl8zDHb7Y'
})

accountCredential.saveAccountCredential(T)
accountCredential.saveFollowersList(T)
setTimeout(function () {
    dmStream.startServer(io, T)
}, 4000)


app.get('/', function (req, res) {
    res.sendfile('./views/index.html')
})

app.get('/server', function (req, res) {
    res.sendfile('./views/server.html')
})

io.on('connection', function(socket){
    console.log('a user connected');
    io.emit("connectionAck", true)
    socket.on('fetchTweetReq', function () {
        fetchTweet(io)
    })
    socket.on('disconnect', function(f){
        console.log('user disconnected');
    });
    socket.on('ConveReq', function (data) {
        fetchConv(data, function (doc) {
            io.emit('ConveRes', doc)
        })
    })
    socket.on('ConveReqPlain', function (data) {
        fetchConv(data, function (doc) {
            io.emit('ConveResPlain', doc)
        })
    })
    // socket.on('ConveResNewReq', function (data) {
    //     fetchConv(data, function (doc) {
    //         io.emit('ConveResNew', doc)
    //     })
    // })
    socket.on('sendTweetRequest', function (msgjson) {
        var msg = '@'+msgjson['username'] +' ' + msgjson['text']
        updateStatus(T, msg, function (tweet) {
            storeStatusUpdateConv(msgjson['userid'], tweet, io)
            storeStatusUpdate(tweet, msgjson['userid'], io)
        })
    })
    socket.on('sendDmRequest', function (msgjson) {
        sendDm(T, msgjson['username'], msgjson['text'], function (dm) {
            storeNewDmSendedConv(msgjson['userid'], dm, io)
            storeNewDmSended(dm, msgjson['userid'], io)
        })
    })
    socket.on('startServer', function (json) {
       // console.log(json)
        var tagtext = json.tag
        var selectedNlp = json.selectedNlp
        console.log("tag: "+ tagtext +" Selected nlp: " +selectedNlp)
        var tag = tagtext.split(" ")
        var serverStatus = tweetStream.getServerStatus()
        if (serverStatus == false){
            tweetStream.startServer(tag, selectedNlp, io, T)
        }
    })
    socket.on('stopServer', function (v) {
        tweetStream.stopServer()
        var serverStatus = tweetStream.getServerStatus()
        if (serverStatus == false){
            io.emit("stopServerAck", true)
        }
    })
    socket.on('serverStatusReq', function (v) {
        io.emit('serverStatusRes', tweetStream.getServerStatus())
    })
    socket.on('checkFollowingReq', function (screenName) {
        checkFollowing(T, screenName, function (res) {
            io.emit('checkFollowingRes', res)
        })
    })
    socket.on('makeUnreadZeroReq', function (userId) {
        makeUnreadCountZero(userId)
    })
    socket.on('searchReq', function (searchQuery) {
        searchTweet(searchQuery, io)
    })
    socket.on('fetchAuthUserInfoReq', function (val) {
        accountCredential.getAccountJson(function (json) {
            io.emit('fetchAuthUserInfoRes', json)
        })
    })
    socket.on('deleteChat', function (json) {
        var uid = json['userid']
        deleteTweetConv(uid)
        deleteTweet(uid, function (val) {
            io.emit('deleteChatRes', true)
        })
    })
    socket.on('closeCase', function (json) {
        var uid = json['userid']
        closeCase.close(uid, io)
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});