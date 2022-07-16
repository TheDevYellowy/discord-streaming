const WebSocket = require('ws');
const event = require('./events/client_events');

let url = 'wss://gateway.discord.gg/?encoding=json&v=9';
const ws = new WebSocket(url);

ws.on('open', () => event.auth(ws));

ws.on('message', rawData => {
    var data = JSON.parse(rawData.toString('utf8'));

    // console.log(data)

    switch(data['op']) {
        case 0:
            event.ready(ws, data);
            break;
        
        case 10:
            event.heartbeat(ws, data['d']);
            break;

        case 11:
            break;
    }
})

ws.on('close', () => {
    console.error("Connection Closed")
})

process.on('SIGINT', () => {
    event.voice(ws)
    process.kill(process.pid)
});