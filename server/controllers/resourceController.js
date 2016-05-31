var db = require("../../server/db/db.js");

var request = require("request");
var _ = require("lodash");
var resourceMethods = require('./lib.js')

module.exports = {
    getExploreQueue: function(req, res) {
        var userPreferences = req.body;
        if (Object.keys(userPreferences).length === 0) {
            res.sendStatus(404);
        } else {
          db.cypherQuery("MATCH (resources:Resource { name: {text}})-[:TAGGED]-(t:Tag) WHERE not t.name = 'Podcasts' return t.name", userPreferences.resource, function(err, result) {
            if (err) {
                throw err;
            }
            userPreferences.keywords = result.data;

            db.cypherQuery("MATCH (e:Episode)--(resources:Resource)--(t:Tag) where t.name in {keywords} return e.title as title,e.link,e.pubDate as date,resources.thumbnail as thumbnail,resources.url limit 10;",
            userPreferences,
            function(err, query) {
              if (err) { console.log(err) }
                CategoryResponse = resourceMethods.formatQueueResponse(query.data);
                userPreferences.titles = _.map(query.data,function(item){
                  return item[0]
                })

              if(userPreferences.userPreferences === undefined){
                res.send(CategoryResponse);
              } else {
                db.cypherQuery("Match (u:User {username:{username}})-[s:SIMILARITY]-(m:User)-[r]-(e:Episode) where not u.username=m.username and e.title in {titles} WITH e as eps, (sum(case when type(r)='HAS_LIKED' then  toFloat(s.score) END) - sum(case when type(r)='HAS_DISLIKED' then toFloat(s.score) END))/(count(case when type(r)='HAS_LIKED' then m.username END) + count(case when type(r)='HAS_DISLIKED' then m.username END)) as rank MATCH (eps)--(r:Resource)--(t:Tag) return eps.title,eps.link,eps.pubDate,r.thumbnail,r.url,r.name,t.name,ID(eps) order by rank DESC limit 10;",userPreferences,
                  function(err, query) {
                    if (err) { 
                      console.log(err)
                    } else {
                      formattedResponse = resourceMethods.formatQueueResponse(query.data);
                      res.send(formattedResponse);
                    }
                }); 
              }
          });
        });
       }
    },

  getChannelQueue: function(req,res){
    var userPreferences = req.body;
    if (Object.keys(userPreferences).length === 0) {
        res.sendStatus(404);
    } 
    userPreferences.keywords = [userPreferences.resource.name];

    db.cypherQuery("MATCH (e:Episode)--(resources:Resource)--(t:Tag) where t.name in {keywords} return e.title as title,e.link,e.pubDate as date,resources.thumbnail as thumbnail,resources.url limit 10;",
    userPreferences,
    function(err, query) {
      if (err) { console.log(err) }
        CategoryResponse = resourceMethods.formatQueueResponse(query.data);
        userPreferences.titles = _.map(query.data,function(item){
          return item[0]
        })

      if(userPreferences.userPreferences === undefined){
        res.send(CategoryResponse);
      } else {
        db.cypherQuery("MATCH  (u:User {username:{username}})-[:HAS_SEEN]->(eps:Episode) WITH collect(distinct eps) as seenepisodes MATCH (e:Episode)--(resources:Resource)--(t:Tag) WHERE t.name IN {keywords} AND NOT e IN seenepisodes WITH t,resources,e, rand() AS  number return e.title as title,e.link,e.pubDate as date,resources.thumbnail as thumbnail,resources.url as showUrl,resources.name as showName,t.name,ID(e) as category ORDER BY number limit 10;",
          userPreferences,
          function(err, query) {
            if (err) { console.log(err) }
            formattedResponse = resourceMethods.formatQueueResponse(query.data);
            res.send(formattedResponse)
         })
      }
    })
  },

    getTags: function(req, res) {
        var start = new Date();
        db.cypherQuery("Match (n:Tag) Return n", function(err, response) {
             if (err) {
              console.log(err)
              res.send("NoRecordsInDB")
             }
             var end = new Date();
             time = end-start
            res.send(response.data);
        });
    },

    getRec: function(req, res) {
        var userInfo = req.body;
        db.cypherQuery("MATCH (u: User {username: {username}})-[:HAS_LIKED]->(r: Episode)<-[:HAS_LIKED]-(y: User)-[:HAS_LIKED]->(s: Episode) WHERE not(u = y) and not (u -- s) RETURN distinct s AS name;", userInfo, function(err, query) {
                if (err) {
                    throw err;
                }
                var getRandomInt = function(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                };
                var int = getRandomInt(0, query.data.length);
                res.send([query.data[int]]);
            });
    },
    browse: function(req, res){
        db.cypherQuery("match (t:Tag)-[:TAGGED]-(r:Resource) where t.name='Technology' return r.name, r.thumbnail, r.url limit 20;", function(err, response){
            formattedResponse = _.map(response.data,function(item){
              return {
                name: item[0],
                thumbnail : item[1],
                itunesLink : item[2]
                }
            })
            res.send(formattedResponse);
        });
    },

    getShowEpisodes : function(req,res){
      console.log("running get show episodes")
        var showDetails = req.body;
        db.cypherQuery("Match (r:Resource {name:{showName}})-[c:EPISODE_OF]-(e:Episode) return r.name,r.thumbnail,r.url,ID(e),e.title,e.link,e.pubDate,count(distinct e.title)", showDetails,function(err,response){
            if(err) {throw err}
            formattedResponse = {};
            formattedResponse.showName = response.data[0][0];
            formattedResponse.thumbnail = response.data[0][1];
            formattedResponse.itunesLink = response.data[0][2];
            formattedResponse.episodeDetails = _.map(response.data,function(item){
                return {
                    id: item[3],
                    title : item[4],
                    url : item[5],
                    pubDate : item[6]
                }
            });
            console.log("formattedResponse");
            res.send(formattedResponse)
        })
    }
};

