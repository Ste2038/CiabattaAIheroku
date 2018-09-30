var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

let ToDo,
    ToControl;

app.use(bodyParser.json());
app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
    console.log('POST / ', JSON.stringify(req.body));
    console.log('Parametri: ' + JSON.stringify(req.body.queryResult.parameters));
    console.log('ToDo: ' + JSON.stringify(req.body.queryResult.parameters.ToDo));
    console.log('ToControl: ' + JSON.stringify(req.body.queryResult.parameters.ToControl));
    ToDo = JSON.stringify(req.body.queryResult.parameters.ToDo);
    ToControl = JSON.stringify(req.body.queryResult.parameters.ToControl);
        
    io.emit('ToDo', ToDo);
    io.emit('ToControl', ToControl);

    if (JSON.parse(ToDo) == "Accendi"){
        response = `${JSON.parse(ToControl)} acceso`;
    }
    else if (JSON.parse(ToDo) == "Spegni"){
        response = `${JSON.parse(ToControl)} spento`;
    }
    res.send(JSON.stringify({ "speech": response, "displayText": response}));
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});
