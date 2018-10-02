var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

//Variabili Entities
let Intent,
    Modalita,
    ToDo,
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

    Intent = JSON.stringify(req.body.queryResult.intent.displayName);
    console.log(Intent);
    switch (Intent){
        case "Controllo":
            ToDo = JSON.stringify(req.body.queryResult.parameters.ToDo);
            ToControl = JSON.stringify(req.body.queryResult.parameters.ToControl);
            console.log(ToDo);
            console.log(ToControl);
            
            io.emit('ToControl', ToControl);
            io.emit('ToDo', ToDo);

            if (JSON.parse(ToDo) == "Accendi"){
                response = `${JSON.parse(ToControl)} acceso`;
            }
            else if (JSON.parse(ToDo) == "Spegni"){
                response = `${JSON.parse(ToControl)} spento`;
            }
            res.send(JSON.stringify({ "speech": response, "displayText": response}));
        break;
        
        case "Modalita":
            Modalita = JSON.stringify(req.body.queryResult.parameters.Modalita);
            console.log(Modalita);

            io.emit('Modalita', Modalita);
        break;

        case "Led":
        break;
    }
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});
