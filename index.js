var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

//Variabili Entities
let Intent,
    Color,
    Modalita,
    ToDo,
    ToControl;


app.use(bodyParser.json());
/*app.use(basicAuth({
  users: { 'admin': 'secret'}
}));*/

app.get('/', function(req, res){
    res.send(<h1>Stefano Giulianelli</h1>);
});

app.post('/', function(req, res){
    console.log('POST / ', JSON.stringify(req.body));
    console.log('Parametri: ' + JSON.stringify(req.body.queryResult.parameters));

    Intent = JSON.parse(JSON.stringify(req.body.queryResult.intent.displayName));
    console.log("Intent" + Intent);

    switch (Intent){
        case "Controllo":
            ToDo = JSON.stringify(req.body.queryResult.parameters.ToDo);
            ToControl = JSON.stringify(req.body.queryResult.parameters.ToControl);
            console.log("ToDo" + ToDo);
            console.log("ToControl" + ToControl);
            
            io.emit('ToControl', ToControl);
            io.emit('ToDo', ToDo);

            if (JSON.parse(ToDo) == "Accendi"){
                switch(JSON.parse(ToControl)){
                    case "Led":
                        response = `Ho acceso i led`;
                    break;
                    
                    case "Stereo":
                        response = `Ho acceso lo stereo`;
                    break;

                    case "Monitor":
                        response = `Ho acceso i Monitor`;
                    break;

                    case "Computer":
                        response = `Ho acceso il computer`;
                    break;

                    case "Stampamte":
                        response = `Ho acceso la stampante`;
                    break; 
                }
            }
            else if (JSON.parse(ToDo) == "Spegni"){
                switch(JSON.parse(ToControl)){
                    case "Led":
                        response = `Ho spento i led`;
                    break;
                    
                    case "Stereo":
                        response = `Ho spento lo stereo`;
                    break;

                    case "Monitor":
                        response = `Ho spento i Monitor`;
                    break;

                    case "Computer":
                        response = `Ho spento il computer`;
                    break;

                    case "Stampamte":
                        response = `Ho spento la stampante`;
                    break; 
                }
            }
            res.send(JSON.stringify({"speech": response, "displayText": response}));
        break;
        
        case "Modalita":
            Modalita = JSON.stringify(req.body.queryResult.parameters.Modalita);
            console.log(Modalita);

            io.emit('Modalita', Modalita);

            response = `Modalità ${JSON.parse(Modalita)} impostata`;
            res.send(JSON.stringify({ "speech": response, "displayText": response}));
        break;

        case "Led":
            Color = JSON.stringify(req.body.queryResult.parameters.Color);
            console.log(Color);

            io.emit('Color', Color);

            response = `Colore ${JSON.parse(Color)} impostato`;
            res.send(JSON.stringify({ "speech": response, "displayText": response}));
        break;
    }
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});
