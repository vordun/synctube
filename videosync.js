// Author: Carrie Vordun
// VideoSync is an API that synchronizes the playback of embedded YouTube videos across multiples browsers.
// 
function VideoSync(roomId, userId) {
    if (userId === undefined) {
        userId = Math.random().toString();
	window.localStorage.setItem("uuid", userId);

    }

    var player;

    var pubnub = PUBNUB.init({
        publish_key: 'pub-c-NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
        subscribe_key: 'sub-c-NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
        uuid: userId,
        ssl: true
    });

    // Whether the connection to the channel has been established yet.
    var linkStart = false;

    // The contents of the most recently received message.
    var lastMsg;

    // A helper function that publishes state-change messages.
    var pub = function (type, time) {
        if (lastMsg !== "" + type + time) {
            pubnub.publish({
                channel: roomId,
                message: {
                    recipient: "",
                    sender: userId,
                    type: type,
                    time: time,
                }
            });
        }
    };

    // The function that keeps the video in sync.
    var keepSync = function () {
        // [Link Start!](https://www.youtube.com/watch?v=h7aC-TIkF3I&feature=youtu.be)
        linkStart = true;

        // The initial starting time of the current video.
        var time = player.getCurrentTime();

        // Subscribing to our PubNub channel.
        pubnub.subscribe({
            channel: roomId,
            callback: function (m) {
                lastMsg = m.recipient + m.type + m.time;
                if ((m.recipient === userId || m.recipient === "") && m.sender !== userId) {
                    if (m.type === "updateRequest") {
                        var curState = player.getPlayerState();
                        var curTime = player.getCurrentTime();
                        pubnub.publish({
                            channel: roomId,
                            message: {
                                type: "updateResponse",
                                time: curTime,
                                recipient: m.sender
                            }
                        });
                    } else if (m.type === "pause") {
                        player.seekTo(m.time, true);
                        time = m.time;
                        player.pauseVideo();
                    } else if (m.type === "play") {
                        if (m.time !== null) {
                            player.seekTo(m.time, true);
                        }
                        player.playVideo();
                    }
                }
            },
            presence: function (m) {}
        });

        // Intermittently checks whether the video player has jumped ahead or
        // behind the current time.
        var z = setInterval(function () {
            var curTime = player.getCurrentTime();
            var curState = player.getPlayerState();
            if (Math.abs(curTime - time) > 1) {
                if (curState === 2) {
                    pub("pause", curTime);
                    player.pauseVideo();
                } else if (curState === 1) {
                    player.pauseVideo();
                }
            }
            time = curTime;
        }, 500);
    };

    // Public Methods
    // ---
    return {
        // Should be bound to the YouTube player `onReady` event.
        onPlayerReady: function (event) {
            player = event.target;
            event.target.playVideo();
            event.target.pauseVideo();
            keepSync();
        },
        // Should be bound to the YouTube player `onStateChange` event.
        onPlayerStateChange: function (event) {
            if (linkStart) {
                // Play event.
                if (event.data === 1) {
                    pub("play", null);
                }
                // Pause event.
                else if (event.data === 2) {
                    pub("pause", player.getCurrentTime());
                }
            }
        }
    };
}
