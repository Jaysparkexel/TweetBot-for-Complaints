// var Twitter = require('twitter')
// var client = new Twitter({
//     consumer_key: '',
//     consumer_secret: '',
//     access_token_key: '',
//     access_token_secret: ''
// });

// var Twit = require('twit')
// var T = new Twit({
//     consumer_key:         '',
//     consumer_secret:      '',
//     access_token:         '',
//     access_token_secret:  ''
// })

var accountCredential = require("../model/accountCredentials")

module.exports = function (T, screen_name, _callback) {
    accountCredential.getFollowersList(function (followersList) {
        var following = false
        followersList.forEach(function (user) {
            if(user == screen_name){
                following = true
            }
        })
        _callback(following)
    })

}

// var ac = require("../model/accountCredentials")
// ac.saveFollowersList(T)

// var fol = following(T, 'kevin_upadhyay', function (f) {
//     console.log(f)
// })

//
// kevin_upadhyay
// akshayd30
// jayzeel1
