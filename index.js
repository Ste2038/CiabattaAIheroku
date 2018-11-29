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
app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send('ciao');
});

app.post('/', function(req, res){
    console.log('POST / ', JSON.stringify(req.body));
    
    Intent = JSON.parse(JSON.stringify(req.body.queryResult.intent.displayName));
    console.log("Intent: " + Intent);
    console.log('Parametri: ' + JSON.stringify(req.body.queryResult.parameters));

    switch (Intent){
        case "Default Welcome Intent":
        res.send(JSON.stringify({ "fulfillmentText": 'Ciao!'}));
        break;

        case "Controllo":
            ToDo = JSON.stringify(req.body.queryResult.parameters.ToDo);
            ToControl = JSON.stringify(req.body.queryResult.parameters.ToControl);
            console.log("ToDo: " + ToDo);
            console.log("ToControl: " + ToControl);
            
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
                        response = `Ho acceso i monitor`;
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
                        response = `Ho spento i monitor`;
                    break;

                    case "Computer":
                        response = `Ho spento il computer`;
                    break;

                    case "Stampamte":
                        response = `Ho spento la stampante`;
                    break; 
                }
            }
            res.send(JSON.stringify({ "fulfillmentText": response}));
        break;
        
        case "Modalita":
            Modalita = JSON.stringify(req.body.queryResult.parameters.Modalita);
            console.log("Modalità :" + Modalita);

            io.emit('Modalita', Modalita);

            response = `Modalità ${JSON.parse(Modalita)} impostata`;
            res.send(JSON.stringify({ "fulfillmentText": response}));
        break;

        case "Led":
            Color = JSON.stringify(req.body.queryResult.parameters.Color);
            console.log("Color: " + Color);

            io.emit('Color', Color);

            response = `Colore ${JSON.parse(Color)} impostato`;
            res.send(JSON.stringify({ "fulfillmentText": response}));
        break;
    }
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});
