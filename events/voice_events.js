const { v4 } = require('uuid');
const { user } = require('../config');

function auth(ws, mdata) {
    ws.send(JSON.stringify({
        op: 0,
        d: {
            server_id: mdata.server_id,
            session_id: mdata.session_id,
            streams: [{ type: "screen", rid: "100", quality: 100}],
            token: mdata.token,
            user_id: user,
            video: true
        }
    }));
}

function heartbeat(ws, data) {
    let last_beat = data['heartbeat_interval']/2;
    setInterval(() => {
        ws.send(JSON.stringify({
            op: 3,
            d: last_beat
        }))
        last_beat += data['heartbeat_interval']/2;
    }, last_beat)
}

function ready(ws) {
    ws.send(JSON.stringify({
        op: 1,
        d: {
            codecs: [
                {name: 'opus', type: 'audio', priority: 1000, payload_type: 111, rtx_payload_type: null},
                {name: "H264", type: "video", priority: 1000, payload_type: 127, rtx_payload_type: 121},
                {name: "VP8", type: "video", priority: 2000, payload_type: 96, rtx_payload_type: 97},
                {name: "VP9", type: "video", priority: 3000, payload_type: 98, rtx_payload_type: 99}
            ],
            data: "a=extmap-allow-mixed\\na=ice-ufrag:sjkp\\na=ice-pwd:xMoDtfWLHAIHBjyNxAmM2jyO\\na=ice-options:trickle\\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\\na=rtpmap:111 opus/48000/2\\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\\na=extmap:13 urn:3gpp:video-orientation\\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\\na=rtpmap:96 VP8/90000\\na=rtpmap:97 rtx/90000",
            protocol: "webrtc",
            rtc_connection_id: v4(),
            sdp: "a=extmap-allow-mixed\\na=ice-ufrag:sjkp\\na=ice-pwd:xMoDtfWLHAIHBjyNxAmM2jyO\\na=ice-options:trickle\\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\\na=rtpmap:111 opus/48000/2\\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\\na=extmap:13 urn:3gpp:video-orientation\\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\\na=rtpmap:96 VP8/90000\\na=rtpmap:97 rtx/90000"
        }
    }))
}

function session(ws, data, mdata) {
    console.log({ data, mdata });
}

module.exports = {
    auth,
    heartbeat,
    ready,
    session
}