var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var mongoUrl = 'mongodb://localhost:27017/userDetail';

module.exports.fetchAccountCredential = function (T, _callback) {
    T.get('account/verify_credentials', { skip_status: true })
        .catch(function (err) {
            console.log('caught error', err.stack)
            _callback(err)
        })
        .then(function (result) {
            _callback(result.data)
        })
}

module.exports.saveAccountCredential = function (T) {
    this.fetchAccountCredential(T, function (account) {
        MongoClient.connect(mongoUrl, function (err, db) {
            assert.equal(null, err);
            //
            var col = db.collection('AccountCredential')

            col.find({}).limit(1).toArray(function (err, doc) {
                if (doc.length == 0) {
                    col.insertOne(account, function (err, r) {
                        assert.equal(null, err);
                        assert.equal(1, r.insertedCount);
                        console.log("Adding new account credential")
                    })
                } else {
                    col.updateOne({}, account, function (err, r) {
                        console.log("Updating new account credential")
                    })

                }
            })
        })
    })

}

module.exports.getAccountJson = function (_callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('AccountCredential')
        col.find({}).limit(1).toArray(function (err, db) {
            _callback(db[0])
        })
    })

}

module.exports.saveFollowersList = function (T) {
    T.get('followers/list', function (err, res) {
        if(err){
            console.log("Error in fetching follower list from twitter api:")
            console.log(err)
        } else {
            var users = res['users']
            var followerList = []
            users.forEach(function (user) {
                followerList.push(user['screen_name'])
            })
            followJSon = {
                followers: followerList
            }
            MongoClient.connect(mongoUrl, function (err, db) {
                assert.equal(null, err);
                var col = db.collection('followersList')
                col.find({}).limit(1).toArray(function (err, doc) {
                    if (doc.length == 0) {
                        col.insertOne(followJSon, function (err, r) {
                            assert.equal(null, err);
                            assert.equal(1, r.insertedCount);
                            console.log("Adding new Followers List")
                        })
                    } else {
                        col.updateOne({}, followJSon, function (err, r) {
                            console.log("Updating Followers List")
                        })

                    }
                })
            })
        }

    })
}

module.exports.getFollowersList = function (_callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('followersList')
        col.find({}).limit(1).toArray(function (err, db) {
            _callback(db[0]['followers'])
        })
    })
}

module.exports.updateFollowerList = function (newFollowerScreenName) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(null, err);
        var col = db.collection('followersList')
        col.update({},
            {
                $push: {
                    followers : newFollowerScreenName
                }
            },
            function (err, saved) {
                if (err || !saved) {
                    console.log(err)
                } else {
                    console.log('New followers added into list successfully')
                }
            })
    })
}
