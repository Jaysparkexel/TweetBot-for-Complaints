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

module.exports = function (T, status, _callback) {
    T.post('statuses/update', {status: status}, function (err, tweet, res) {
        if(err){
            console.log(err)
        } else {
            console.log('Status updated successfully')
            _callback(tweet)
        }
    })
}

// update(T, "test status", function (stat) {
//     console.log(stat)
// })
