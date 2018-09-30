var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

let ToDo,
    Rele_Number,
    Number,
    Name;

app.use(bodyParser.json());
app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
    console.log('POST / ', JSON.stringify(req.body));
    console.log('Parametri: ' + JSON.stringify(req.body.object.queryResult.parameters));
    console.log('ToDo: ' + JSON.stringify(req.body.result.parameters.ToDo));
    console.log('Rele_Number: ' + JSON.stringify(req.body.result.parameters.Rele_Number));
    console.log('Number: ' + JSON.stringify(req.body.result.parameters.Number));
    console.log('Name: ' + JSON.stringify(req.body.result.parameters.Name));
    ToDo = JSON.stringify(req.body.result.parameters.ToDo);
    Rele_Number = JSON.stringify(req.body.result.parameters.Rele_Number);
    Number = JSON.stringify(req.body.result.parameters.Number);
    Name = JSON.stringify(req.body.result.parameters.Name);
    
    io.emit('Rele_Number', Rele_Number);
    io.emit('Number', Number);
    io.emit('Name', Name);
    io.emit('ToDo', ToDo);
    let _Name = JSON.parse(Name);

    if (JSON.parse(ToDo) == "accendi"){
        response = `${_Name} Acceso`;
    }
    else if (JSON.parse(ToDo) == "spegni"){
        response = `${_Name} Spento`;
    }
    res.send(JSON.stringify({ "speech": response, "displayText": response}));
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});
