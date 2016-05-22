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
