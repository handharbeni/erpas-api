var schedule = require('node-schedule');
var request = require('request');

var compression = require('compression');
var helmet = require('helmet');
var config = require('./tools/config');
var cors = require('cors')
var express = require('express'),
    app = express(),
    port = process.env.PORT || config.server_port,
    bodyParser = require('body-parser');
var expressSwagger = require('express-swagger-generator')(app);
let options = {
    swaggerDefinition: {
        info: {
            description: 'API Documentation',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: config.server+':'+config.server_port,
        // host: `66.96.229.251:2053`,
        // basePath: '/',
        produces: [
            "application/json"
        ],
        schemes: ['http'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'access-token',
                description: "",
            }
        }
    },
    basedir: __dirname,
    files: ['./app/**/*.js']
};

schedule.scheduleJob('0 0 * * 0', function(fireDate){
  var url = `http://${config.server}:${config.server_port}/requestjadwal`
  request(url, (error, response, body) => {})
});

// app.use(job);
app.use(cors())
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
var routes = require('./app/routes/route');
routes(app);
expressSwagger(options)

app.use(helmet());

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});

