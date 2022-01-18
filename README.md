


## SyncTube


SyncTube is software used to view Youtube videos in sync with multiple avatars in Second Life. You can play, stop, pause, fast forward and rewind videos and all watchers' televisions will be in sync within miliseconds.


SycTube requires a free subscription to PubNub and Netlify. PubSub acts as a state machine to keep track of all televisions and sends messages to each whenever the state changes (pause, play etc.). Netlify is used to host the website files for free. If you already have your own server on the internet, Netlify isn't necessary.


## Installation


Edit videosync.js and replace the publish and subsribe keys with the ones you generate in your account on PubNub (pubnub.com). Upload index.html and videosync.js to Netfliy (this can be done by connecting your github account and simply sending a push).

Create a box prim in Second Life, shape it like a rectangle and add the following script:


    default
    {
        
        state_entry()
        {
            llSetPrimMediaParams(1,[PRIM_MEDIA_CONTROLS,0,PRIM_MEDIA_AUTO_SCALE,1,PRIM_MEDIA_PERMS_INTERACT,PRIM_MEDIA_PERM_ANYONE,PRIM_MEDIA_PERMS_CONTROL,PRIM_MEDIA_PERM_ANYONE,PRIM_MEDIA_AUTO_LOOP,0,PRIM_MEDIA_AUTO_ZOOM,0,PRIM_MEDIA_HOME_URL,"https://URL_FROM_NETLIFY",PRIM_MEDIA_CURRENT_URL,"https://URL_FROM_NETLIFY",PRIM_MEDIA_AUTO_PLAY,0]);

        }
    }

