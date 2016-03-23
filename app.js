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
var BASE_URL = "https://api.telegram.org/bot89371812:AAE1BKNJD-avb8Q82aIf99Iq2GCPJiYiy3o/";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=60";
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";
var max_offset = 0;
//console.log("ddd");
poll(max_offset);
function poll(offset) {
  //  console.log("offset");
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
};

var gethallno = function (message) {
  //  console.log("function message");
    var arg = message.text.split(" ");
  //  console.log(arg);

    /*var caps = message.text.toUpperCase();
     var answer = {
     chat_id : message.chat.id,
     text : "You told be to do something, so I took your input and made it all caps. Look: " + caps
     };*/
    var requrl = 'https://balabot.apispark.net/v1/' + arg[1] + '/?USN=' + arg[2];
 //   console.log(requrl);
    var req = unirest("GET", requrl);
//    console.log(2);
    req.headers({
          "authorization": "Basic NTgwYzdiNDUtYjYxNS00NTU2LTk1ODgtZGIwNjM0NGM3OGIxOmZiMjEwMmNiLTkyODEtNGYwZi1hOTU5LWM5NmQzYTg4ZTBjMA==",
  "content-type": "application/json",
  "accept": "application/json",
  "host": "balabot.apispark.net"

    });

    req.end(function (res) {
        var totg = "";
        if (res.error){
            //throw new Error(res.error);
            totg="Check Your Number otherwise Data Not found. Contact Your Class Advisor"
        }
        //var totg = stringTable.create(res.body, {headers: ['Name', 'EEFA', 'CG', 'MPC', 'DSP', 'DWM', 'WN']});
        else{
        totg = totg + stringTable.create(res.body, {headers: ['Student_Name']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['USN']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Test_']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['HallNo']}) + "\n\n";
        }

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
var getmarks = function (message) {
  //  console.log("function message");
    var arg = message.text.split(" ");
 //   console.log(arg);

    /*var caps = message.text.toUpperCase();
     var answer = {
     chat_id : message.chat.id,
     text : "You told be to do something, so I took your input and made it all caps. Look: " + caps
     };*/
    var requrl = 'https://balabot.apispark.net/v1/' + arg[1] + '/?USN=' + arg[2];
  //  console.log(requrl);
    var req = unirest("GET", requrl);
 //   console.log(2);
    req.headers({
          "authorization": "Basic NTgwYzdiNDUtYjYxNS00NTU2LTk1ODgtZGIwNjM0NGM3OGIxOmZiMjEwMmNiLTkyODEtNGYwZi1hOTU5LWM5NmQzYTg4ZTBjMA==",
  "content-type": "application/json",
  "accept": "application/json",
  "host": "balabot.apispark.net"

    });

    req.end(function (res) {
        if (res.error)
            throw new Error(res.error);

        //var totg = stringTable.create(res.body, {headers: ['Name', 'EEFA', 'CG', 'MPC', 'DSP', 'DWM', 'WN']});
        var totg = "";
        totg = totg + stringTable.create(res.body, {headers: ['NAME_OF_THE_STUDENT']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['USN']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Subject1']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Subject2']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Subject3']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Subject4']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Subject5']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Subject6']}) + "\n\n";

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

var getattd = function (message) {
  //  console.log("function message");
    var arg = message.text.split(" ");
 //   console.log(arg);

    /*var caps = message.text.toUpperCase();
     var answer = {
     chat_id : message.chat.id,
     text : "You told be to do something, so I took your input and made it all caps. Look: " + caps
     };*/
    var requrl = 'https://balabot.apispark.net/v1/' + arg[1] + '/?USN=' + arg[2];
  //  console.log(requrl);
    var req = unirest("GET", requrl);
 //   console.log(2);
    req.headers({
          "authorization": "Basic NTgwYzdiNDUtYjYxNS00NTU2LTk1ODgtZGIwNjM0NGM3OGIxOmZiMjEwMmNiLTkyODEtNGYwZi1hOTU5LWM5NmQzYTg4ZTBjMA==",
  "content-type": "application/json",
  "accept": "application/json",
  "host": "balabot.apispark.net"

    });

    req.end(function (res) {
        if (res.error)
            throw new Error(res.error);

        //var totg = stringTable.create(res.body, {headers: ['Name', 'EEFA', 'CG', 'MPC', 'DSP', 'DWM', 'WN']});
        var totg = "";
        totg = totg + stringTable.create(res.body, {headers: ['NAME']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['USN']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Sub1']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Sub2']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Sub3']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Sub4']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Sub5']}) + "\n\n";
        totg = totg + stringTable.create(res.body, {headers: ['Sub6']}) + "\n\n";

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
    "getmarks": getmarks,
    "getattd": getattd,
    "gethallno": gethallno
};

function runCommand(message) {
    var msgtext = message.text;
 //   console.log("run message");
    if (msgtext.indexOf("/") != 0)
        return false; // no slash at beginning?
    var command = msgtext.substring(1, msgtext.indexOf(" "));
    if (COMMANDS[command] == null)
        return false; // not a valid command?
    COMMANDS[command](message);
    return true;
}
