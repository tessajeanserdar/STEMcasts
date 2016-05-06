var resourceController = require("../controllers/resourceController");
var loginController = require("../../server/controllers/loginController");
var userResourceController = require("../../server/controllers/userResourceController");
var userController = require("../../server/controllers/userController");
var elastic = require("../../server/controllers/esearch");


module.exports = function(app, express){
    /* GET suggestions */
    app.get('/suggest/:input', function (req, res, next) {  
      // console.log("hit this route",req.params.input)
      elastic.getSuggestions(req.params.input).then(function (result) { res.json(result) });
    });
    /* POST document to be indexed */
    app.post('/create', function (req, res, next) {  
      elastic.addDocument(req.body).then(function (result) { res.json(result) });
    });
    // app.post("/insert", resourceController.insertResource);
    // app.post("/insertEp", resourceController.insertEpisode);
    // app.post("/editEp", resourceController.editEpisode);
    app.post('/getResource', resourceController.getResource);
    app.post('/likeResource', userResourceController.likeResource);
    app.post('/dislikeResource', userResourceController.dislikeResource);
    app.post('/resourceHistory', userResourceController.markAsSeen);
    app.post('/removeRelationship', userResourceController.removeRelationship);
    app.get('/tags', resourceController.getTags);
    app.get('/user/:user', userController.getUser);
    app.get('/userlike/:user', userController.getLikes);
    app.get('/userDislike/:user', userController.getDislikes);
    app.post('/getRec', resourceController.getRec);
    app.post("/signin", loginController.signin);
    app.post("/signup", loginController.signup);
    app.post("/logout", loginController.logout);
    // app.post('/browse', resourceController.getPopularPodcasts);
    app.get('/browse', resourceController.browse);
};