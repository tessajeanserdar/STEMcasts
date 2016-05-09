var db = require("../../server/db/db.js");

var request = require("request");
var _ = require("lodash");


module.exports = {
    // insertResource: function(req, res) {
    //     var name = req.body.name.replace(/'/g, "*");
    //     var tags = req.body.genre
    //     var url = req.body.url
    //     var thumbnail = req.body.thumbnail
    //     var feedUrl = req.body.feedUrl
    //     var episodes = req.body.episodes
    //     db.cypherQuery("MERGE (r:Resource {name:'"+name+"', url:'"+url+"', thumbnail:'"+thumbnail+"', feedUrl:'"+feedUrl+"', episodes:'"+episodes+"'}) MERGE (t:Tag {name:'"+tags+"'}) MERGE (r:Resource {name:'"+name+"', url:'"+url+"', thumbnail:'"+thumbnail+"', feedUrl:'"+feedUrl+"'})-[:TAGGED]-(t:Tag {name:'"+tags+"'})", function(err, res){
    //     })
    // },
    // insertEpisode : function(req, res){
    //     var pubDate = req.body.pubDate
    //     var title = req.body.title.replace(/'/g, "*");
    //     var link = req.body.link
    //     var resource = req.body.feed.title.replace(/'/g, "*")
    //     var feed = req.body.feed
       
    //     db.cypherQuery("MERGE (e:Episode {title:'"+title+"', link:'"+link+"', pubDate:'"+pubDate+"'})", function(err, res){
    //         if(err){
    //             console.log("* * * * * E R R O R * * * * *:", err)
    //         }
    //     })
    //     db.cypherQuery("Match (e:Episode {title:'"+title+"'}) Match (r:Resource {name:'"+resource+"'}) MERGE (e)-[:EPISODE_OF]->(r)", function(err, res){
    //         if(err){
    //             console.log("* * * * * E R R O R * * * * *:", err)
    //         }
    //     })
    //     res.send(200)
    // },

    // editEpisode: function(req, res) {

    //     var name = req.body.name;
    //     var episodes = JSON.stringify(req.body.episodes);
    //     episodes = episodes.replace(/"/g, "*");
    //     db.cypherQuery("MATCH (r:Resource {name:'" + name + "'}) SET r.episodes ='" + episodes + "' RETURN r", function(err, res) {

    //     });
    // },

    getExploreQueue: function(req, res) {
        var userPreferences = req.body;
        if (Object.keys(userPreferences).length === 0) {
            res.sendStatus(404);
        } else {
            if (userPreferences.resource.payload.url) {
                db.cypherQuery("MATCH (resources:Resource { name: {text}})-[:TAGGED]-(t:Tag) WHERE not t.name = 'Podcasts' return t.name", userPreferences.resource, function(err, result) {
                    if (err) {
                        throw err;
                    }
                    userPreferences.keywords = result.data;
                    db.cypherQuery("MATCH  (u:User {username:{username}})-[:HAS_SEEN]->(eps:Episode) WITH collect(distinct eps) as seenepisodes MATCH (e:Episode)--(resources:Resource)--(t:Tag) WHERE t.name IN {keywords} AND NOT e IN seenepisodes WITH t,resources,e, rand() AS  number return e.title as title,e.link,e.pubDate as date,resources.thumbnail as thumbnail,resources.url as showUrl,resources.name as showName,t.name as category ORDER BY number limit 10;",
                        userPreferences,
                        function(err, query) {
                          if (err) { console.log(err) }
                          console.log(query.data[0]);

                          userPreferences.newUserResults = _.map(query.data,function(item){
                            return {
                              title: item[0],
                              episodeLink: item[1],
                              pubDate : item[2],
                              thumbnail : item[3],
                              url : item[4],
                              resourcesName: item[5],
                              category : item[6]
                            }
                          })
                          userPreferences.titles = _.map(query.data,function(item){
                            return item[0]
                          })
                          db.cypherQuery("Match (u:User {username:{username}})-[s:SIMILARITY]-(m:User)-[r]-(e:Episode) where not u.username=m.username and e.title in {titles} WITH e as eps, (sum(case when type(r)='HAS_LIKED' then  toFloat(s.score) END) - sum(case when type(r)='HAS_DISLIKED' then toFloat(s.score) END))/(count(case when type(r)='HAS_LIKED' then m.username END) + count(case when type(r)='HAS_DISLIKED' then m.username END)) as rank MATCH (eps)--(r:Resource)--(t:Tag) return eps.title,eps.link,eps.pubDate,r.thumbnail,r.url,r.name,t.name order by rank DESC limit 10;",userPreferences,
                              function(err, query) {
                                if (err) { console.log(err)}
                                if (query.data.length === 0){
                                  res.send(userPreferences.newUserResults);
                                } else {
                                  formattedResponse = _.map(query.data,function(item){
                                    return {
                                      title: item[0],
                                      episodeLink: item[1],
                                      pubDate : item[2],
                                      thumbnail : item[3],
                                      url : item[4],
                                      resourcesName: item[5],
                                      category : item[6]                                }
                                  })
                                  res.send(formattedResponse);
                                }
                          });   
                    });
                });
       }
    }
},

  getChannelQueue: function(req,res){
    console.log("sending response from channel queue")
    var userPreferences = req.body;
    if (Object.keys(userPreferences).length === 0) {
        res.sendStatus(404);
    } 
   userPreferences.keywords = [userPreferences.resource.name];
   db.cypherQuery("MATCH  (u:User {username:{username}})-[:HAS_SEEN]->(eps:Episode) WITH collect(distinct eps) as seenepisodes MATCH (e:Episode)--(resources:Resource)--(t:Tag) WHERE t.name IN {keywords} AND NOT e IN seenepisodes WITH t,resources,e, rand() AS  number return e.title as title,e.link,e.pubDate as date,resources.thumbnail as thumbnail,resources.url as showUrl,resources.name as showName,t.name as category ORDER BY number limit 10;",
       userPreferences,
       function(err, query) {
         if (err) { console.log(err) }
         formattedResponse = _.map(query.data,function(item){
           return {
             title: item[0],
             episodeLink: item[1],
             pubDate : item[2],
             thumbnail : item[3],
             url : item[4],
             resourcesName: item[5],
             category : item[6]                                }
         })
        res.send(formattedResponse)
       })
  },

    getTags: function(req, res) {
        db.cypherQuery("Match (n:Tag) Return n", function(err, response) {
            res.send(response.data);
        });
    },

    getRec: function(req, res) {
        var userInfo = req.body;
        console.log("userinfo",userInfo);
        db.cypherQuery("MATCH (u: User {username: {username}})-[:HAS_LIKED]->(r: Episode)<-[:HAS_LIKED]-(y: User)-[:HAS_LIKED]->(s: Episode) WHERE not(u = y) and not (u -- s) RETURN distinct s AS name;", userInfo, function(err, query) {
                if (err) {
                    throw err;
                }
                var getRandomInt = function(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                };
                var int = getRandomInt(0, query.data.length);
                console.log("getRec data",[query.data[int]]);
                res.send([query.data[int]]);
            });
    },
    browse: function(req, res){
        db.cypherQuery("match (t:Tag)-[:TAGGED]-(r:Resource)-[:EPISODE_OF]-(e:Episode)-[:HAS_LIKED]-(u:User) return r.thumbnail,r.name,count(distinct e.title),count(distinct u) order by count( distinct u) DESC limit 12", function(err, response){
            res.send(response.data);
        });
    }

};

