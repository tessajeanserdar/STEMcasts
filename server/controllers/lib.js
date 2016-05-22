var db = require("../../server/db/db.js");
var _ = require("lodash");

module.exports = {

  formatQueueResponse: function(data) {
    return  _.map(data,function(item){
      return {
        title: item[0],
        url: item[1],
        pubDate : item[2],
        thumbnail : item[3],
        itunesLink : item[4],
        resourcesName: item[5],
        category : item[6],
        id : item[7]
      }
    })
  },
  getCategoryRecomendations: function(userPreferences){
       db.cypherQuery("MATCH  (u:User {username:{username}})-[:HAS_SEEN]->(eps:Episode) WITH collect(distinct eps) as seenepisodes MATCH (e:Episode)--(resources:Resource)--(t:Tag) WHERE t.name IN {keywords} AND NOT e IN seenepisodes WITH t,resources,e, rand() AS  number return e.title as title,e.link,e.pubDate as date,resources.thumbnail as thumbnail,resources.url as showUrl,resources.name as showName,t.name,ID(e) as category ORDER BY number limit 10;",
       userPreferences,
       function(err, query) {
         if (err) { console.log(err) }
         formattedResponse = formatQueueResponse(query.data);
         return formattedResponse;
    })
  }
};