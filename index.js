var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

//Variabili Entities
let Intent,
    Color,
    Modalita,
    ToDo,
    ToControlName,
    ToControlNum,
    _ChangeReleStatus,
    _ChangeReleNum,
    ReleConfig;

let ReleStat = [8];
for (let i = 0; i < 8; i++){
    ReleStat[i] = false;
}

app.set('view engine','ejs');

app.use(bodyParser.json());
/*app.use(basicAuth({
  users: { 'admin': 'secret'}
}));*/

app.get('/', function(req, res){
    //res.sendFile(__dirname + '/index.html');
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
            ToControlName = JSON.stringify(req.body.queryResult.parameters.ToControl);

            for (let i = 0; i < 8; i++){
                ReleData = ReleConfig[i];
                if(JSON.parse(ToControlName) == ReleData[0]){
                    ToControlNum = ReleData[1];
                    //ModToControl = ReleData[2];
                }
            }

            console.log("ToDo: " + ToDo);
            console.log("ToControlName: " + ToControlName);
            console.log("ToControlNum: " + ToControlNum);

            io.emit('ToControl', ToControlName);
            io.emit('ToDo', ToDo);

            if (JSON.parse(ToDo) == "Accendi"){
                if (ReleStat[ToControlNum] == true){
                    switch(JSON.parse(ToControlName)){
                        case "Led":
                            response = `Led già accesi`;
                        break;

                        case "Stereo":
                            response = `Stereo già acceso`;
                        break;

                        case "Monitor":
                            response = `Monitor già accesi`;
                        break;

                        case "Computer":
                            response = `Computer già acceso`;
                        break;

                        case "Stampamte":
                            response = `Stampante già accesa`;
                        break;
                    }
                }
                else{
                    switch(JSON.parse(ToControlName)){
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
            }
            else if (JSON.parse(ToDo) == "Spegni"){
                if(ReleStat[ToControlNum] == true){
                    switch(JSON.parse(ToControlName)){
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
                    }rere


                }
                else{
                    switch(JSON.parse(ToControlName)){
                        case "Led":
                            response = `Led già spenti`;
                        break;

                        case "Stereo":
                            response = `Stereo già spento`;
                        break;

                        case "Monitor":
                            response = `Monitor già spenti`;
                        break;

                        case "Computer":
                            response = `Computer già spento`;
                        break;

                        case "Stampamte":
                            response = `Stampante già spenta`;
                        break;
                    }
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

http.listen(port, function(){
    console.log('Listening on port ' + port);

    io.on('connection', function(socket){
        console.log('User Connected!');
        for (let i = 0; i < 8; i++){
            ReleStat[i] = false;
        }

        let stringStati = '| ';
        for(let i = 0; i < 8; i++){
          stringStati += ReleStat[i];
          if (ReleStat[i]){
            stringStati += ' ';
          }
          stringStati += ' | '
        }
        //disegno dell'array di stato
        console.log('_________________________________________________________________');
        console.log('|   1   |   2   |   3   |   4   |   5   |   6   |   7   |   8   |');
        console.log(stringStati);
        console.log('|_______________________________________________________________|');

        socket.on('start', function(msgObj){
            ReleConfig = JSON.parse(msgObj);
            console.log("ReleConfig: " + ReleConfig);
        });

        socket.on('changeReleNum', function(msgObj){
            _ChangeReleNum = msgObj;
            console.log("changeReleNum: " + _ChangeReleNum);
        });

        socket.on('changeRelStatus', function(msgObj){
            _ChangeReleStatus = msgObj
            console.log("changeRelStatus: " + _ChangeReleStatus);

            if (_ChangeReleStatus == 1){
                ReleStat[_ChangeReleNum] = true;
            }
            else{
                ReleStat[_ChangeReleNum] = false;
            }

            let stringStati = '| ';
            for(let i = 0; i < 8; i++){
              stringStati += ReleStat[i];
              if (ReleStat[i]){
                stringStati += ' ';
              }
              stringStati += ' | '
            }
            //disegno dell'array di stato
            console.log('_________________________________________________________________');
            console.log('|   1   |   2   |   3   |   4   |   5   |   6   |   7   |   8   |');
            console.log(stringStati);
            console.log('|_______________________________________________________________|');

        });
    })
});
