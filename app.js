/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var app = express();
var http = require('http')
var port=process.env.VCAP_APP_PORT || 1337;
app.set('port', port);

//app.set('css', __dirname + '/css');
//app.set('images', __dirname + '/images');

/*app.get('/', function(request, response){
    response.sendfile('index.html');
});*/

app.use(express.static(__dirname + '/public'));
http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});
    
var unirest = require('unirest');
var stringTable = require('string-table');
var BASE_URL = "https://api.telegram.org/bot89371812:AAGawhl9qP5nOO9B6OcI-9_l9mYxj4WZfCM/getmarks";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=60";
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";
var max_offset = 0;
console.log("ddd");
poll(max_offset);
function poll(offset) {
    console.log("offset");
    var url = POLLING_URL.replace(":offset:", offset);

    unirest.get(url)
            .end(function (response) {
                var body = response.raw_body;
                if (response.status == 200) {
                    var jsonData = JSON.parse(body);
                    var result = jsonData.result;

                    if (result.length > 0) {
                        for (i in result) {
                            if (runCommand(result[i].message))
                                continue;
                        }

                        max_offset = parseInt(result[result.length - 1].update_id) + 1; // update max offset
                    }
                    poll(max_offset);
                }
            });
}
;

var getmarks = function (message) {
    console.log("function message");
    var arg = message.text.split(" ");
    console.log(arg);

    /*var caps = message.text.toUpperCase();
     var answer = {
     chat_id : message.chat.id,
     text : "You told be to do something, so I took your input and made it all caps. Look: " + caps
     };*/
    var requrl = 'https://svmarks.apispark.net/v1/' + arg[1] + '/?USN=' + arg[2];
    console.log(requrl);
    var req = unirest("GET", requrl);
    console.log(2);
    req.headers({
        "authorization": "Basic ZjMwMzRlMzctYTA5OC00NDQ4LTgxNWUtOTRhODBkN2MxOWQzOjZiODhmZTBlLWMzNTYtNDkwNC1hZmRmLWM3NmFkNTdkOWU5Ng==",
        "content-type": "application/json",
        "accept": "application/json",
        "host": "svmarks.apispark.net"
    });

    req.end(function (res) {
        if (res.error)
            throw new Error(res.error);

        //var totg = stringTable.create(res.body, {headers: ['Name', 'EEFA', 'CG', 'MPC', 'DSP', 'DWM', 'WN']});
        var totg = "";
        totg = totg + stringTable.create(res.body, {headers: ['NAME_OF_THE_STUDENT']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['USN']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['10IS51']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['10CS54']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['10CS56']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['10CS52']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['10CS55']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['10CS53']}) + "\n\n";

        console.log(totg);
        var answer = {
            chat_id: message.chat.id,
            text: totg
        };
        unirest.post(SEND_MESSAGE_URL)
                .send(answer)
                .end(function (response) {
                    if (response.status == 200)
                        console.log("Successfully sent message to " + message.chat.id);
                });
    });

}

var COMMANDS = {
    "getmarks": getmarks
};

function runCommand(message) {
    var msgtext = message.text;
    console.log("run message");
    if (msgtext.indexOf("/") != 0)
        return false; // no slash at beginning?
    var command = msgtext.substring(1, msgtext.indexOf(" "));
    if (COMMANDS[command] == null)
        return false; // not a valid command?
    COMMANDS[command](message);
    return true;
}
