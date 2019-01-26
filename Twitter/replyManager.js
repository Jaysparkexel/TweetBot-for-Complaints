var checkF = require('../Twitter/checkFollowing')
var sendDM = require('../Twitter/sendDM')
var updateStatus = require('../Twitter/updateStatus')
// var Twitter = require('twitter')
// var client = new Twitter({
//     consumer_key: '',
//     consumer_secret: '',
//     access_token_key: '',
//     access_token_secret: ''
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
