var db = require("../../server/db/db.js");

module.exports = {
  getUser: function (req, res) {
    var user = JSON.parse(req.params.user);
    db.cypherQuery('MATCH (n:User {username:{username}}) RETURN n', user, function (err, result) {
      if (err) { throw err; }
      res.send(result.data);
    });
  },
  getLikes: function (req, res) {
    var user = JSON.parse(req.params.user).username;
    console.log("user", user);
    db.cypherQuery('match (u:User {username:"'+ user +'"})-[l:HAS_LIKED]-(e:Episode)--(r:Resource) return e,r', function (err, result) {
      if (err) {
        throw err;
      }
      res.send(result.data);
    })
  },
  getDislikes: function (req, res) {
    var user = JSON.parse(req.params.user).username;
    db.cypherQuery('match (u:User {username:"'+ user +'"})-[l:HAS_DISLIKED]-(e:Episode)--(r:Resource) return e,r', function (err, result) {
      if (err) {
        throw err;
      } 
      res.send(result.data);
    })
  }
};