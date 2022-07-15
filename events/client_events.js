const { token, guild, channel, user } = require('../config');

// ready function
const filter = [
    "CHANNEL_UPDATE",
    "CHANNEL_DELETE",
    "READY_SUPPLEMENTAL",
    "GUILD_MEMBER_UPDATE",
    "STREAM_UPDATE",
    "VOICE_SERVER_UPDATE",
    "MESSAGE_CREATE",
    "MESSAGE_UPDATE",
    "PRESENCE_UPDATE",
]
let rtc_server_id, session_id;
let stream_token, stream_endpoint;

//voice function
let voice_connected = false;

function auth(ws) {
    ws.send(JSON.stringify({
        op: 2,
        d: {
            capabilities: 509,
            client_state: {
                guild_hashes: {},
                hightes_last_message_id: "0",
                read_state_version: 0,
                user_guild_settings_version: -1,
                user_settings_version: -1
            },
            compress: false,
            presence: { status: "online", since: 0, activities: [], afk: false },
            properties: {
                browser: "Chrome",
                browser_user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                browser_version: "130.0.0.0",
                client_build_number: 136921,
                client_event_source: null,
                device: "",
                os: "Windows",
                os_version: "10",
                referrer: "",
                referrer_current: "",
                referrer_domain: "",
                referrer_domain_current: "",
                release_channel: "stable",
                system_locale: "en-US"
            },
            token: token
        }
    }))
}

function heartbeat(ws, data) {
    let last_beat = data['heartbeat_interval']/2;
    setInterval(() => {
        ws.send(JSON.stringify({
            op: 1,
            d: last_beat
        }))
        last_beat += data['heartbeat_interval']/2;
    }, last_beat);
}

function ready(ws, data) {
    switch(data['t']) {
        case 'READY':
            console.log('Connected to WS');
            voice(ws);
            break;

        case 'VOICE_STATE_UPDATE':
            session_id = data['d'].session_id;
            break;

        case 'STREAM_CREATE':
            rtc_server_id = data['d'].rtc_server_id;
            break;

        case 'STREAM_DELETE':
            screen(ws);
            break;

        case 'STREAM_SERVER_UPDATE':
            stream_token = data['d'].token;
            stream_endpoint = data['d'].endpoint;

            require('../stream')({
                server_id: rtc_server_id,
                session_id: session_id,
                token: stream_token,
                endpoint: stream_endpoint
            });
            break;

        default:
            !filter.includes(data['t']) && console.log(data);
    }
}

function voice(ws) {
    ws.send(JSON.stringify({
        op: 4,
        d: {
            guild_id: !voice_connected && guild,
            channel_id: !voice_connected && channel,
            self_mute: false,
            self_deaf: false,
            self_video: false
        }
    }), () => {
        console.log('Joined voice channel');
        ws.send(JSON.stringify({
            op: 18,
            d: {
                channel_id: channel,
                guild_id: guild,
                preferred_region: null,
                type: "guild"
            }
        }));
    })
    voice_connected = !voice_connected;
}

function screen(ws) {
    ws.send(JSON.stringify({
        op: 18,
        d: {
            channel_id: channel,
            guild_id: guild,
            preferred_region: null,
            type: "guild"
        }
    }));
}

module.exports = {
    auth,
    heartbeat,
    ready,
    voice
}