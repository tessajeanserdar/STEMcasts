var bonsai_url    = process.env.BONSAI_URL;
var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
  host: bonsai_url,
  log: 'trace'
});


var indexName = "main";

function testConnection() {
    elasticClient.ping({
        requestTimeout: 30000,
        hello: "elasticsearch"
      },
      function (error) {
        if (error) {
          console.error('elasticsearch cluster is down!');
        } else {
          console.log('All is well');
        }
      }
    );
}

exports.testConnection = testConnection;


/**
* Delete an existing index
*/
function deleteIndex() {  
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {  
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {  
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists; 

function initMapping() {  
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                name: { type: "string" },
                url: { type: "string" },
                feedUrl : { type: "string" },
                thumbnal : { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(document) {  
    return elasticClient.index({
        index: indexName,
        type: "document",
        body: {
            name: document.name,
            url: document.url,
            feedUrl: document.feedUrl,
            thumbnail : document.thumbnail,
            suggest: {
                input: document.name.split(" "),
                output: document.name,
                payload: {url: document.url}
            }
        }
    });
}
exports.addDocument = addDocument;


function getSuggestions(input) {  
    return elasticClient.suggest({
        index: indexName,
        type: "document",
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    })
}
exports.getSuggestions = getSuggestions;

