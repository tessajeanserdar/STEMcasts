var neo4j = require('node-neo4j');
var db = new neo4j("http://Piglet:J1MGgKm3IYYUN9nu2Ori@piglet.sb02.stations.graphenedb.com:24789");
var elastic = require("./esearch");

db.cypherQuery("MATCH (n:Resource) RETURN n", function (err, result) {
 if (err) {
   throw error;
 } else  {
  bulkLoadPodcasts(result.data)
 }
});
        
function bulkLoadPodcasts(podcasts) {
  console.log("podcasts in main",podcasts)

  elastic.indexExists().then(function (exists) {  
    if (exists) {
      return elastic.deleteIndex();
    }
  }).then(function () {
    return elastic.initIndex().then(elastic.initMapping).then(function () {
      //Add a few titles for the autocomplete
      //elasticsearch offers a bulk functionality as well, but this is for a different time
      podcasts.map(function (podcast) {
        console.log("Podcast:",podcast)
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
      return Promise.all(podcasts);
    });
  }); 
}
