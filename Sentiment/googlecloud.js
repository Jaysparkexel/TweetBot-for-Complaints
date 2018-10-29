// const projectId = 'tweetbot-153210'
// var language = require('@google-cloud/language')({
//     projectId: projectId,
//     keyFilename: 'C:/Users/Jay/Desktop/Projects/NodeJS/helloworld/Auth/tweetBot-bbd3c22385b7.json'
// });
//
// const text = '@RailMinIndia Sir pls do some thing . No action has been taken';
//
// language.detectSentiment(text).then(function (data) {
//     var sentiment = data[0]
//     console.log(sentiment)
//     // var apiResponse = data[1]
//     // console.log(apiResponse)
// })

function GCloudObject(proId, filePath) {
    this.pId = proId
    this.fPath = filePath
}

GCloudObject.prototype = {
    constructor: GCloudObject,

    // init:function () {
    //     this.
    // },

    getSentiMentType: function (text, _callback) {
            language = require('@google-cloud/language')({
                projectId: this.pId,
                keyFilename: this.fPath
            })
            language.detectSentiment(text).then(function (data) {
            var score = data[0]
                var res
                    if(score >= .25){
                    res = 'POSITIVE'
                    }
                    else if(score < 0.0){
                        res = 'NEGATIVE'
                    } else {
                        res = 'NEUTRAL'
                    }
                _callback(res)
            })
    }
}

module.exports = {
    GCloudObject: GCloudObject
}


//use of this function is shown bellow

/*var gc = new GCloudObject("tweetbot-153210","C:/Users/Jay/Desktop/Projects/NodeJS/helloworld/Auth/tweetBot-bbd3c22385b7.json")
gc.getSentiMentType("@RailMinIndia Sir pls do some thing . No action has been taken", function (sent) {
    console.log(sent)
})
gc.getSentiMentType("@RailMinIndia @IR_EDCHG Thanxxx", function (sent) {
    console.log(sent)
})
gc.getSentiMentType("@RailMinIndia @drmadiwr you need to have bigger dust bins. 2 cft are just not enough for even 1 meal waste. Specially on long trains.", function (sent) {
    console.log(sent)
})
gc.getSentiMentType("@RailMinIndia @eastcoastrail @drmwat_ecor  the coach composition is incorrect", function (sent) {
    console.log(sent)
})*/
