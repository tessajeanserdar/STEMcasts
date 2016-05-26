var express = require('express');
var path = require('path');
var app = express();
var port = 5050;
var scraper = require("../scripts/scraper/scraper")
var db = require("../server/db/db.js");
var jaccard = require("../scripts/filteringScripts/jaccard.js");



app.listen(process.env.PORT || port)

require('../server/config/middleware.js')(app, express);
require('../server/config/routes.js')(app, express);



////////UNCOMMENT THIS SECTION WHEN INITIALIZING DATABASE///////
//scraper.getAllPodcast("podcasts.txt")
//setTimeout(function(){
        //scraper.readAllFiles();
        //scraper.tester()
        //jaccard();
//}, 1000)
////////////////////////////////////////////////////////////////
module.exports = app;