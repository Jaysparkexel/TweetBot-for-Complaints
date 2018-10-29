// var Twitter = require('twitter')
// var client = new Twitter({
//     consumer_key: 'maFcfwQDi8aojKzgofcUClmVI',
//     consumer_secret: 'BHo4XaViO6hfy78UwUL9jTPTyW751nMFVhKY0OB9vm3MtNLYDS',
//     access_token_key: '360556223-HHQS3JZYr0p4KgxfZYUtQyBy9NZ29wlpxog0zuSN',
//     access_token_secret: 'DPpwFW1A9TgSGu65xnbLjuLvOPWRlGIMci6w15KufKo1q'
// });

// var Twit = require('twit')
// var T = new Twit({
//     consumer_key:         'maFcfwQDi8aojKzgofcUClmVI',
//     consumer_secret:      'BHo4XaViO6hfy78UwUL9jTPTyW751nMFVhKY0OB9vm3MtNLYDS',
//     access_token:         '360556223-HHQS3JZYr0p4KgxfZYUtQyBy9NZ29wlpxog0zuSN',
//     access_token_secret:  'DPpwFW1A9TgSGu65xnbLjuLvOPWRlGIMci6w15KufKo1q'
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
