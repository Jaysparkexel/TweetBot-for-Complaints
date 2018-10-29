
function AylienObject(Id, k) {
    this.appId = Id;
    this.key = k;
}

AylienObject.prototype = {
    constructor: AylienObject,
    getSentiMentType:function(text, _callback){
        var AYLIENTextAPI = require("aylien_textapi");
        textapi = new AYLIENTextAPI({
            application_id: this.appId,
            application_key: this.key
        })
        textapi.sentiment({"text": text, mode: 'tweet'}, function(error, response) {
            var res
            if (error === null) {
                var sent = response["polarity"]
                if(sent == "neutral"){
                    res = 'NEUTRAL'
                    // console.log(res)
                }
                else if (sent == "positive"){
                    res = 'POSITIVE'
                    // console.log(res)
                }
                else {
                    res = 'NEGATIVE'
                   // console.log(res)
                }
            }
            else {
                res = 'ERROR'
                console.log(res)
            }
            _callback(res)
        })
    }
}

module.exports = {
    AylienObject: AylienObject
}

//use of this function is shown bellow

/*var aylien = new AylienObject("5ba44115", "acb79485e9e49cd41fb39bf234a4f19b")
aylien.getSentiMentType("@RailMinIndia Sir pls do some thing . No action has been taken", function (rs) {
    console.log(rs)
})
aylien.getSentiMentType("@RailMinIndia @IR_EDCHG Thanxxx", function (sent) {
    console.log(sent)
})
aylien.getSentiMentType("@RailMinIndia @drmadiwr you need to have bigger dust bins. 2 cft are just not enough for even 1 meal waste. Specially on long trains.", function (sent) {
    console.log(sent)
})
aylien.getSentiMentType("@RailMinIndia @eastcoastrail @drmwat_ecor  the coach composition is incorrect", function (sent) {
    console.log(sent)
})*/



