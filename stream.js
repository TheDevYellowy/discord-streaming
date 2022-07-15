const events = require('./events/voice_events');

module.exports = mdata => {
    const WebSocket = require('ws');
    let video_ssrc, rtx_ssrc;

    const ws = new WebSocket(`wss://${mdata.endpoint}/v=7`);
    ws.on('open', () => events.auth(ws, mdata));

    ws.on('message', data => {
        data = JSON.parse(data.toString('utf8'));

        switch(data['op']) {
            case 2:
                console.log('Trying to stream')
                video_ssrc = data['d'].streams[0].ssrc;
                rtx_ssrc = data['d'].streams[0].rtx_ssrc;
                events.start(ws, { rtx_ssrc, ssrc: video_ssrc });
                break;

            case 4:
                events.startStream(ws, { rtx_ssrc, ssrc: video_ssrc });
                break;

            case 6:
                break;

            case 8:
                events.heartbeat(ws, data['d']);
                break;

            default:
                console.log({ data })
        }
    })
}