// var Twitter = require('twitter')
// var client = new Twitter({
//     consumer_key: 'N6YAdXYnoZ98eTNcqN1wvLOJC',
//     consumer_secret: 'D2yRfFht0nmgvBsjMKed2D4gaH7HC2WTq5c7wO14pxInBgJCeZ',
//     access_token_key: '815869648562360320-NbeUdDzi47oZRQy4VLfD5E4VbkXstvM',
//     access_token_secret: 'Kz8T3Fnoy1SnaLDblaEiC6mbGwXSl8lmw9xlzl8zDHb7Y'
// });

// var Twit = require('twit')
// var T = new Twit({
//     consumer_key:         'N6YAdXYnoZ98eTNcqN1wvLOJC',
//     consumer_secret:      'D2yRfFht0nmgvBsjMKed2D4gaH7HC2WTq5c7wO14pxInBgJCeZ',
//     access_token:         '815869648562360320-NbeUdDzi47oZRQy4VLfD5E4VbkXstvM',
//     access_token_secret:  'Kz8T3Fnoy1SnaLDblaEiC6mbGwXSl8lmw9xlzl8zDHb7Y'
// })

module.exports = function (T, screen_name, msg, _callback) {
    T.post('direct_messages/new', {'text': msg, 'screen_name': screen_name}, function (err, data) {
        if(err){
            console.log(err)
        } else {
            console.log('Direct msg sent successfully!')
            _callback(data)
        }
    })
}

// dm(T, 'vaghasiya_jay', "test 12345")
