var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
    console.log('POST / ', JSON.stringify(req.body));
    console.log('Parametri: ' + JSON.stringify(req.body.result.parameter));
});

http.listen(process.env.PORT || 3000, function(){
    console.log('listening');
});