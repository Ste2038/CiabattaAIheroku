var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
    console.log('POST / ', JSON.stringify(req.body));
    console.log('Parametri: ' + JSON.stringify(req.body.result.parameters));
    console.log('ToDo: ' + JSON.stringify(req.body.result.parameters.ToDo));
    console.log('Rele_Number: ' + JSON.stringify(req.body.result.parameters.Rele_Number));
    console.log('Number: ' + JSON.stringify(req.body.result.parameters.Number));
    console.log('Name: ' + JSON.stringify(req.body.result.parameters.Name));
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});
