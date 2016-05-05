var Promise = require("bluebird");
var db = require("../server/db/db.js");
var _ = require('lodash');
var users;


  db.cypherQuery("MATCH (u:User) where not u.username='jo' return u.username", function(err, res){
    users = res.data;
    _.forEach(users, function(value) {
      _.forEach(users, function(item){
        if(value!==item){
          var userOneLikes;
          var userTwoLikes;
          var UserOneDislikes;
          var UserTwoDislikes;
            db.cypherQuery("MATCH (u:User {username:'" + value + "'})-[r:HAS_DISLIKED]-(e:Episode) return distinct e.title", function(err, res){
              if (err) {console.log("Error:", err);}
              valueDislikes = res.data;
              
              db.cypherQuery("MATCH (u:User {username:'" + item + "'})-[r:HAS_DISLIKED]-(e:Episode) return e.title", function(err, res){
                if (err) {console.log("Error: with ",item," ", err);}
                itemDislikes = res.data;

                db.cypherQuery("MATCH (u:User {username:'" + value + "'})-[r:HAS_LIKED]-(e:Episode) return e.title", function(err, res){
                  if (err) {console.log("Error: with ",value," ", err);}
                  valueLikes = res.data;

                  db.cypherQuery("MATCH (u:User {username:'" + item + "'})-[r:HAS_LIKED]-(e:Episode) return e.title", function(err, res){
                    if (err) {console.log("Error: with ",item," ", err);}
                    itemLikes = res.data;
                    // console.log("valueLikes: ", valueLikes.length);
                    // console.log("itemLikes: ", itemLikes.length);
                    var union = _.union(valueLikes, itemLikes, valueDislikes, itemDislikes).length;
                    var like = _.intersection(valueLikes, itemLikes).length;
                    var dislike = _.intersection(valueDislikes, itemDislikes).length;
                    var likedislike = _.intersection(valueLikes, itemDislikes).length;
                    var dislikelike = _.intersection(valueDislikes, itemLikes).length;
                    var similarityIndex = (like + dislike - likedislike - dislikelike)/union; 
                    var query = "MATCH (u1:User {username:'" + value + "'}), (u2:User {username:'" + item + "'}) MERGE (u1)-[:SIMILARITY {score: '" + similarityIndex + "'}]->(u2);"
                    console.log(query);
                    db.cypherQuery("MATCH (u1:User {username:'" + value + "'}), (u2:User {username:'" + item + "'}) MERGE (u1)-[:SIMILARITY {score: '" + similarityIndex + "'}]->(u2)", function(err, res){
                      if (err) { console.log (err); }
                      console.log("Created a match with :", value ,"to ",item, "with SIMILARITY",similarityIndex,"db responded with",res)
                    });
                  });
                });
              });
          });
        }
      })
   });
});

  
