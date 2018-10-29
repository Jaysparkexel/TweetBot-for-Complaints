var checkF = require('../Twitter/checkFollowing')
var sendDM = require('../Twitter/sendDM')
var updateStatus = require('../Twitter/updateStatus')
// var Twitter = require('twitter')
// var client = new Twitter({
//     consumer_key: 'N6YAdXYnoZ98eTNcqN1wvLOJC',
//     consumer_secret: 'D2yRfFht0nmgvBsjMKed2D4gaH7HC2WTq5c7wO14pxInBgJCeZ',
//     access_token_key: '815869648562360320-NbeUdDzi47oZRQy4VLfD5E4VbkXstvM',
//     access_token_secret: 'Kz8T3Fnoy1SnaLDblaEiC6mbGwXSl8lmw9xlzl8zDHb7Y'
// });
module.exports = function (T, screen_name) {
    checkF(T, screen_name, function (following) {
        if (following === true){
            var msg = 'Sorry, for the inconvenience. We will reach to you as soon as possible.'
            sendDM(T, screen_name, msg)

        } else {
            var  status = '@' +screen_name +' Sorry for inconvenience.' +
                ' Please, Follow me to share private information via Direct Messaging.'
            updateStatus(T, status, function (status) {
                console.log("status json received")
            })

        }
    })
}
