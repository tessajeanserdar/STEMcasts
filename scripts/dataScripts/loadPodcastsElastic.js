var neo4j = require('node-neo4j');
var db = new neo4j("http://Piglet:J1MGgKm3IYYUN9nu2Ori@piglet.sb02.stations.graphenedb.com:24789");
var elastic = require("./esearch");

db.cypherQuery("Match (t:Tag) return t", function (err, result) {
 if (err) {
   throw err;
 } else  {
  bulkLoadPodcasts(result.data);
 }
});
        
function bulkLoadPodcasts(podcasts) {
  console.log("podcasts in main",podcasts);

  elastic.indexExists().then(function (exists) {  
    if (exists) {
      return elastic.deleteIndex();
    }
  }).then(function () {
    return elastic.initIndex().then(elastic.initMapping).then(function () {
      podcasts.map(function (podcast) {
        if (podcast.url){
          return elastic.addDocument({
            name: podcast.name,
            url: podcast.url,
            feedUrl: podcast.feedUrl,
            thumbnail : podcast.thumbnail,
            metadata: {
              titleLength: Object.keys(podcast).length
            }
          });
        } else {
          return elastic.addDocument({
            name: podcast.name,
            url: null,
            feedUrl: null,
            thumbnail : null,
            metadata: {
              titleLength: Object.keys(podcast).length
            }
          });
        }
      });
      db.cypherQuery("Match (r:Resource) RETURN r", function (err, result) {
       if (err) {
         throw err;
       } else  {
         result.data.map(function (podcast) {
          return elastic.addDocument({
            name: podcast.name,
            url: podcast.url,
            feedUrl: podcast.feedUrl,
            thumbnail : podcast.thumbnail,
            metadata: {
              titleLength: Object.keys(podcast).length
            }
          });
        }); 
       }
      });
      return Promise.all(podcasts);
    });
  }); 
}