var stream;
var dmServerOn = false
var accountJson

var storeDm = require("./storeDm")
var storeDmConv = require("./storeDmConv")
var accountCredential = require("../model/accountCredentials")

module.exports.startServer = function (io, T) {

        accountCredential.getAccountJson(function (json) {
            accountJson = json
        })

        setInterval(function () {
            accountCredential.saveFollowersList(T)
        }, 300000)

        stream = T.stream('user');

        stream.on('connect', function (conMsg) {
            console.log('Connected to twitter stream of dm successfully')
            dmServerOn = true
            // io.emit("startServerAck", tweetServerOn)
        })

        stream.on('disconnect', function (disconnectMessage) {
            console.log('Disconnected from twitter stream of dm: ' +disconnectMessage)
        })

        stream.on('direct_message', function (eventMsg) {

            var event = eventMsg['direct_message']
            var dm = event.text

            if(event['recipient_id_str'] == accountJson['id_str']){
                console.log("DM: " +dm)
                storeDm(event, io)
                storeDmConv(event)
            }

        })
        
        stream.on('user_update', function (updateMsg) {
            console.log("Account detail changed")
            accountCredential.saveAccountCredential(T)
            console.log("New account detail updated in database")
            setInterval(function () {
                accountCredential.getAccountJson(function (json) {
                    accountJson = json
                })
            }, 3000)
        })

        stream.on('follow', function (followsMsg) {
                if(followsMsg['target']['id_str'] == accountJson['id_str']){
                    accountCredential.updateFollowerList(followsMsg['source']['screen_name'])
                }
        })

        
        stream.on('error', function (error) {
            throw error;
        });

}

module.exports.stopServer = function () {
    stream.stop()
    dmServerOn = false
}

module.exports.getServerStatus = function () {
    return dmServerOn
}
