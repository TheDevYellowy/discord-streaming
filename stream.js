const events = require('./events/voice_events');

module.exports = mdata => {
    console.log('a')
    const WebSocket = require('ws');
    let video_ssrc, rtx_ssrc;

    const ws = new WebSocket(`wss://${mdata.endpoint}/v=7`);
    ws.on('open', () => events.auth(ws, mdata));

    ws.on('message', data => {
        data = JSON.parse(data.toString('utf8'));

        console.log({ data })

        switch(data['op']) {
            case 2:
                events.ready(ws)
                video_ssrc = data['d'].streams[0].ssrc;
                rtx_ssrc = data['d'].streams[0].rtx_ssrc;
                events.session(ws, data, { video_ssrc, rtx_ssrc });
                break;

            case 4:
                events.session(ws, data, { video_ssrc, rtx_ssrc });
                console.log({ data });
                break;

            case 6:
                break;

            case 8:
                events.heartbeat(ws, data['d']);
                break;

            // default:
            //     ![5,15].includes(data['op']) && console.log({ data })
        }
    })
}