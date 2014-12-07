/**
* Author: Jinyue Xia
* the xplayer is a plugin for jQuery
* xPlayer is a JavaScript Class
* this is an object-oriented jQuery plugin development
* the plugin provides APIs for developer's uses
* the APIs include play(), pause(), seekTo(), currentTime(), etc.
*/

(function($) {
    var XPlayer = function (video) {
        // var elem = $(element);
        var obj = this;
        this.video = video;

        this.duration = function() {
            return video.duration();
        };

        this.play = function () {
            this.video.play();
        };

        this.pause = function () {
            this.video.pause();
        };

        /********************** NOTICE!! ****************************
          Vimeo's and youtube's video playbackRate can't be changed
        ************************************************************/
        this.playbackRate = function(speed) {
            if (speed != null) {
                this.video.playbackRate(speed);
                return this;
            }
            return this.video.playbackRate();
        }

        this.seekTo = function (skipTo) {
            this.video.currentTime(skipTo);
        };

        // set currentTime of the video, if the passed
        // parameter is null, return currentTime
        this.currentTime = function(time) {
            if (time != null) {
                this.video.currentTime(time);
                return;
            }
            
            return this.video.currentTime();
        };

        this.volume = function(vol) {
            if (vol != null) {
                this.video.volume(vol);
                return;
            }
            
            return this.video.volume();
        };

        this.mediaType = function () {
            var media = this.video.media;
            var name;
            if (media._util == "undefined" || media._util == null) {
                name = "HTML5";
                return;
            }
                
            var type = media._util.type;
            if (type == "Vimeo") {
                 name = "Vimeo";
            } else if (type == "YouTube") {
                name = "YouTube";
            } 
            return name;
        };

        this.canPlayBackRateChange = function () {
            var type = this.mediaType();
            var canChange;
            if (type == "Vimeo") {
                canChange = false;
            } else {
                canChange = true;
            }

            return canChange;
        };

        this.setStartTime = function(startTime) {
            this.startTime = startTime;
        };

        this.setEndTime = function(endTime) {
            this.endTime = endTime;
        };

        this.getStartTime = function() {
            return this.startTime;
        };

        this.getEndTime = function() {
            return this.endTime;
        };

        this.pause = function() {
            return this.video.pause();
        };

        this.paused = function() {
            return this.video.paused();
        };

        this.buffered = function () {
            return this.video.buffered();
        };

        this.setBtnPlay = function ($btnPlay) {
            this.$btnPlay = $btnPlay;
        };

        this.setMainInner = function ($mainInner) {
            this.$mainInner = $mainInner;
        };

    };  // <--- end of definition of object xPlayer

    $.fn.xPlayer = function(options) {
         // Establish our default settings
        var videoInfo = $.extend({
            url : null,
            videoID : null
        }, options);

        return this.each(function() {
            // variables, element selectors
            var $playerContainer = $(this);
            var $videoContainer,
                // $btnPlay,
                $playbtnspan,
                $pausebtnspan,
                $progressSlider,
                $commentBtn,
                $currTime,
                $slowMoSlider,
                $form,
                $colors,
                $cancelbtn,
                $clearCanvasBtn,
                $markers,
                $btnSubmit,
                $speedbtn,
                $fullscreenbtn,
                $volume,
                $volumeSlider,
                $volumeUp,
                $volumeDown,
                $volumeOff,
                $volumeli;

            var xPlayer;  // globe variable for the plugin to access
            var element = $(this);

            // when the 
            var createMainInner = function() {
                $videoContainer = $(document.createElement("div")).addClass("video");
                $playerContainer.append($videoContainer);
                createDrawCanvas();
                $drawCanvas = createDrawCanvas();
                $playerContainer.append($drawCanvas);
                $colors = createColorPicker();
                $playerContainer.append($colors);
                $commentBox = createCommentBox();
                $playerContainer.append($commentBox);
                var $controls = createControlsDiv();
                $playerContainer.append($controls); 
                $form = createForm();
                $playerContainer.append($form);

            }; // <---- createMainInner ends here

            // create controls div inside mainInner
            var createControlsDiv = function () {
                var $controls = $(document.createElement("div")).attr("id", "controls");
                var $markers = $(document.createElement("div")).attr("id", "markers");
                $markers.appendTo($controls);
                // create progress
                var $progress = createProgress();
                $controls.append($progress);

                var $buttons = createButtons();
                $controls.append($buttons);

                return $controls;

            };  // <---- createControlDiv ends here

            // create progress/segement sliders
            var createProgress = function () {
                var $progress = $(document.createElement("div")).attr("id", "progress");
                // create progress_box    
                var $progress_box = $(document.createElement("div")).attr("id", "progress_box");
                var $videoSeek = $(document.createElement("div"))
                                .addClass("video-seek") 
                                .appendTo($progress_box);
                var $clearDiv = $(document.createElement("div"))
                                .css("clear", "both")
                                .appendTo($progress_box);
                var $sliderrage = $(document.createElement("div"))
                                    .attr("id", "slider-range")
                                    .appendTo($progress_box);
                var $minDiv = $(document.createElement("div"))
                                    .attr("id", "min")
                                    .appendTo($progress_box);
                var $maxDiv = $(document.createElement("div"))
                                    .attr("id", "max")
                                    .appendTo($progress_box);
                $progress_box.appendTo($progress);
                return $progress;
            }; 
     
            // create play buttons    
            var createButtons = function () {
                var $buttons = $(document.createElement("div"))
                                .attr("id", "buttons")
                                .addClass("buttonContainer");
                var $playBtn = $(document.createElement("button"))
                                .attr("type", "button")
                                .attr("id", "btnPlay")
                                .addClass("floatLeft playbutton")
                                .prop("value", "Play")
                                .html("Play")
                                .appendTo($buttons);
                var $speedDiv = $(document.createElement("div"))
                                .addClass("speeddiv");
                var $speedText = $(document.createElement("p"))
                                .addClass("speed_p")
                                .html("Video playback speed")
                                .appendTo($speedDiv);
                var $sloMoSlider = $(document.createElement("div"))
                                    .attr("id", "sloMo-slider")
                                    .appendTo($speedDiv);
                var $stepDiv = $(document.createElement("div"))
                                .addClass("steps");
                var $span1 = $(document.createElement("span"))
                                .addClass("tick")
                                .html("|" + "<br />" + " 0.1x ")
                                .appendTo($stepDiv);
                var $span2 = $(document.createElement("span"))
                                .addClass("tick")
                                .css("left", "50%")
                                .html("|" + "<br />" + " 1x ")
                                .appendTo($stepDiv);
                var $span3 = $(document.createElement("span"))
                                .addClass("tick")
                                .css("left", "100%")
                                .html("|" + "<br />" + " 2x ")
                                .appendTo($stepDiv);
                $stepDiv.appendTo($speedDiv);
                $speedDiv.appendTo($buttons);

                var $commentBtn = $(document.createElement("button"))
                                .attr("type", "button")
                                .attr("id", "addC")
                                .addClass("floatLeft commentbutton")
                                .html("Add Comment")
                                .appendTo($buttons);
                $buttons.append($(document.createElement("span"))
                                .css("clear", "both"));

                var $currTime = $(document.createElement("div"))
                                .attr("align", "right");
                var $currTime_p  = $(document.createElement("p"))
                                    .attr("id", "currTime")               
                                    .text("00:00 / 00:00")
                                    .appendTo($currTime);
                $buttons.append($currTime);
                return $buttons;
            }; // <--- create buttons div ends hers

            var createSteps = function () {
                var $speedDiv = $(document.createElement("div"))
                                        .addClass("speeddiv");
                var $sloMoSlider = $(document.createElement("div"))
                                    .attr("id", "sloMo-slider")
                                    .appendTo($speedDiv);
                var $stepDiv = $(document.createElement("div"))
                                .addClass("steps");
                var $span1 = $(document.createElement("span"))
                                .addClass("tick")
                                .html("|" + "<br />" + " 0.1x ")
                                .appendTo($stepDiv);
                var $span2 = $(document.createElement("span"))
                                .addClass("tick")
                                .css("left", "50%")
                                .html("|" + "<br />" + " 1x ")
                                .appendTo($stepDiv);
                var $span3 = $(document.createElement("span"))
                                .addClass("tick")
                                .css("left", "100%")
                                .html("|" + "<br />" + " 2x ")
                                .appendTo($stepDiv);
                $stepDiv.appendTo($speedDiv);
                return $speedDiv;
            };


            // initialize elements in the plug
            var initElements = function () {
                $videoContainer = $('.videoContainer', $playerContainer);
                $controls = $('.videoController', $playerContainer);
                $play = $('#play', $playerContainer); 
                $playbtnspan = $('#playbtnspan', $playerContainer);
                $pausebtnspan = $("#pausebtnspan", $playerContainer);
                $progressSlider = $(".video-seek", $playerContainer);
                $progressBar = $(".video-progress", $playerContainer);
                $bufferBar = $(".video-buffer", $playerContainer);
                $currTime = $(".timer", $playerContainer);
                $speedbtn = $('#speedbtn', $playerContainer);
                createSteps();
                $slowMoSlider = $("#sloMo-slider", $playerContainer);
                $fullscreenbtn = $("#fullscreenbtn", $playerContainer);
                $volume = $(".volume", $playerContainer);
                $volumeSlider = $(".volslider", $playerContainer);
                $volumeUp = $(".volume .glyphicon-volume-up", $playerContainer);                
                $volumeDown = $(".volume .glyphicon-volume-down", $playerContainer);
                $volumeOff = $(".volume .glyphicon-volume-off", $playerContainer);
                $volumeli = $(".volumeMedia li", $playerContainer);
            }; // <---- initElements ends here   


            var initVideo = function() {
                // var $popVideo = Popcorn.smart(".video", 
                        // "http://vimeo.com/1084537");
                        // "http://videos.mozilla.org/serv/webmademovies/popcornplug.mp4");
                        // "https://www.youtube.com/watch?v=9CEdSB0lWRs");  //oscar
                        // "https://www.youtube.com/watch?v=Smh0QXSmF-A");  // mcg
                        // "./videos/movie_300.mp4");
                        // "http://webpages.uncc.edu/~jxia3/lmvp/videos/movie_300.mp4");

                var $popVideo = Popcorn.smart(".videoContainer", videoInfo.url);
                // var $popVideo = Popcorn.smart(".video", 
                    // "pro link here");
                // var $popVideo = vimeoProPop(".video", "./videos/Boundary Nugget Trio.mp4");
                // var $popVideo = vimeoProPop(".video", "pro link here");
                $popVideo.on("loadeddata", loadeddataEvent);
                $popVideo.on("timeupdate", seekUpdate);
                // $videoContainer.on("timeupdate", $popVideo, seekUpdate);
                $popVideo.on("ratechange", ratechange);
                $popVideo.on("playing", playingEvent);
                $popVideo.on("pause", pauseEvent);
                $popVideo.on("progress", progressEvent);
            }; // <---- initVideo function ends

            // return popcorn video object, particularly designed for videmo pro videos.
            // a "hack" to popcorn video lib, calling this function will bypass the creation of Popcorn 
            // vimeo object for basic vimeo video.
            var vimeoProPop = function (target, src, options) {
                var node = typeof target === "string" ? Popcorn.dom.find( target ) : target;
                if ( !node ) {
                    Popcorn.error( "Specified target `" + target + "` was not found." );
                    return;
                }

                // If our src is not an array, create an array of one.
                src = typeof src === "string" ? [ src ] : src;
                var videoHTML,
                    videoElement,
                    videoID = Popcorn.guid( "popcorn-video-" ),
                    videoHTMLContainer = document.createElement( "div" );

                videoHTMLContainer.style.width = "100%";
                videoHTMLContainer.style.height = "100%";
                if ( src.length === 1 ) {
                    videoElement = document.createElement( "video" );
                    videoElement.id = videoID;
                    node.appendChild( videoElement );
                    setTimeout( function() {
                    // Hack to decode html characters like &amp; to &
                        var decodeDiv = document.createElement( "div" );
                        decodeDiv.innerHTML = src[ 0 ];

                        videoElement.src = decodeDiv.firstChild.nodeValue;
                    }, 0 );
                    return Popcorn( '#' + videoID, options );
                }
            };

            // initialize elements/fields for xPlayer object
            var setupElements = function () {
                xPlayer.setBtnPlay($playbtnspan);
                xPlayer.setMainInner($playerContainer);
            }; // <---- setupElements ends here.

            // when loadeddata event is fired
            // xPlayer object is created here
            // element: is the selector's name
            var loadeddataEvent = function() {
                xPlayer = new XPlayer(this);
                element.data("player", xPlayer); // get xPlayer object by calling .data("player")
                setupElements();
                initProgressSlider();
                seekUpdate(); // doing this is for showing video's duration
                initVolume();
                initSpeedBtn();
                // create a custom event listener when the popcorn video is ready
                // the event name is DEFINED as "videoReady" !!!
                element.trigger("videoReady");   
            }; // <---- loadeddateEvent function ends

            // when video's timeupdate event is fired
            var seekUpdate = function() {
                var currentTime = xPlayer.currentTime();
                // var totalDuration = $("#video").attr('duration').toFixed(0);
                var totalDuration = xPlayer.duration();
                $progressSlider.slider('value', currentTime);
                $progressBar.width(currentTime*100 / totalDuration + "%");
                
                var buffered = xPlayer.buffered().end(0) + xPlayer.buffered().start(0);
                // if (buffered >= xPlayer.duration()) {
                //     updateProgress(buffered);
                // }
                 updateProgress(buffered);
                $currTime.text(splitTime(currentTime)+" / "
                            +splitTime(totalDuration));  
            }; // <---- seekUpate function ends

            var progressEvent = function () {
                if (xPlayer != null) {
                    var buffered = xPlayer.buffered().end(0) + xPlayer.buffered().start(0);
                    // console.log("buffered: " + buffered);
                    updateProgress(buffered);
                }
            };

            var updateProgress = function (buffered) {
                // var buffered = xPlayer.buffered().end(0) + xPlayer.buffered().start(0);
                // var bufferedWidth;
                // console.log("buffered: " + buffered);
                var playedWidth = $progressBar[0].style.width;
                // console.log("played width: " + playedWidth);
                var playedWidthNumber = playedWidth.replace(/\d+% ?/g, "");
                // bufferedWidth = buffered*100 / xPlayer.duration()  - playedWidthNumber;
                bufferedWidth = buffered*100 / xPlayer.duration();
                // console.log("show buffered width: " + bufferedWidth );
                $bufferBar.width(bufferedWidth + "%");
            };

            //testing purpose
            var ratechange = function () {
                console.log( "ratechange fired! to be " + 
                    this.playbackRate());
            };

            var playingEvent = function() {
                showPausebtn();
            };

            var pauseEvent = function() {
                showPlaybtn();
            };

            // function for create seek progress slider 
            var initProgressSlider = function() {
                $progressSlider.slider({
                    value: 0,
                    step: 0.005,
                    orientation: "horizontal",
                    range: "min",
                    max: xPlayer.duration(),
                    animate: true,                  
                    slide: function(event, ui) {
                        xPlayer.seekTo(ui.value);
                    }
                }); 
                $progressSlider.width($(".videoController").width()-8);
                // $progressSlider.find(".ui-slider-handler").css({
                //     "width": $controls.width-4
                // });               
            }; // <---- initProgressSlider function ends

            // position the controllers
            var positionController = function(){
                var videoWidth = $videoContainer.width();
                $progressSlider.width(videoWidth);
            }; // <---- positionController function ends

            //~~~~~~~~~~~~~~~~volume control part~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
            // initialize volume control
            var initVolume = function() {
                $vol = xPlayer.volume();
                if ($vol == 0) {
                    showVolOff();
                } else if ($vol < 0.5) {
                    showVolDown();
                } else {
                    showVolUp();
                }
                $volumeSlider.slider({
                    range: "min",
                    max: 1,
                    value: $vol,
                    step: 0.01,
                    slide: function (e, ui) {
                        xPlayer.volume(ui.value);
                        if (ui.value == 0) {
                            showVolOff();
                        } else if (ui.value < 0.5) {
                            showVolDown();
                        } else {
                            showVolUp();
                        }
                    }
                });

                $volumeUp.on("click", function() {
                    showVolOff();
                    xPlayer.volume(0);
                });

                $volumeDown.on("click", function() {
                    showVolOff();
                    xPlayer.volume(0);
                });

                // reseved for furture functonality
                $volumeOff.on("click", function() {
                    var volume = $volumeSlider.slider( "option", "value" );
                    xPlayer.volume(volume);
                    if (volume == 0) {
                        showVolOff();
                    } else if (volume < 0.5) {
                        showVolDown();
                    } else {
                        showVolUp();
                    }
                });
            }; // <---- initVolume ends here

            // show volume down icon 
            var showVolDown = function () {
                $volumeOff.hide();
                $volumeUp.hide();
                $volumeDown.show();
                $volumeDown.tooltip({
                    placement: "top",
                    title: "mute"
                });
            };

            // show volume up icon 
            var showVolUp = function () {
                $volumeOff.hide();
                $volumeDown.hide(); 
                $volumeUp.show();
                $volumeUp.tooltip({
                    placement: "top",
                    title: "mute"
                });
            };

            // show volume off icon 
            var showVolOff = function () {
                $volumeUp.hide();
                $volumeDown.hide(); 
                $volumeOff.show();
                $volumeOff.tooltip({
                    placement: "top",
                    title: "ummute"
                });
            };
            //~~~~~~~~~~~~~~~~~~~~~~~ volume part ends ~~~~~~~~~~~~~~~~~~~~~~~~~~

            //Slow motion slider. Works in Google chrome. 
            var initSlowMoSlider = function () {
                $slowMoSlider.slider({
                    range:"min",
                    max:2,
                    step:0.1,
                    value:1,
                    slide: function(event, ui){
                        if (xPlayer != null) {
                            xPlayer.playbackRate(ui.value);
                            playVideo();
                        }
                    }
                });
            }; // <--- initSlowMoSlider function (slow motion slider intialization) ends         

            // initialize speed change button
            var initSpeedBtn = function () {
                var speedtooltip = function (titleText) {
                    $speedbtn.tooltip({
                        placement: "top",
                        title: titleText
                    }).click(function() {
                        $speedbtn.tooltip("hide");
                    });
                };
                var titleText = "change speed";
                if (!xPlayer.canPlayBackRateChange()) {
                    $speedbtn.css({
                        "color" : "#A0A0A0"
                    });
                    titleText = "speed change unavailable";
                    speedtooltip(titleText);
                    return;
                    // $speedbtn.disabled();
                }

                // default speed value is 1
                var sliderVal = 1;
                speedtooltip(titleText);
                $speedbtn.popover({
                    animation: true,
                    html : true,
                    title : "Speed",
                    trigger : "click",
                    placement : "top",
                    content : function() {
                        var $speedDiv = createSteps();
                        return $speedDiv[0].outerHTML;
                        // return $speedDiv.html();
                    }
                    // viewport : "video"
                });

                $speedbtn.click(function (){
                    var $slider = $("#sloMo-slider");
                    var ytplayer; 
                    $slider.on('slide', function (ev, ui) {
                        sliderVal = ui.value;
                        if (xPlayer != null) {
                            if (xPlayer.mediaType() == "YouTube") {
                                // get iframe's id first
                                var iframe = document.getElementsByTagName("iframe");
                                var id = iframe[0].id;
                                // use callPlayer function cited at the end of this script
                                callPlayer(id, "setPlaybackRate", [sliderVal]);
                            } 
                            xPlayer.playbackRate(ui.value);
                            // playVideo();
                            xPlayer.play();
                        }
                    });
                    $slider.slider({
                        range: "min",
                        max: 2,
                        step: 0.1,
                        value: sliderVal
                    });
                });
            };// <---initSpeedBtn function (&slow motion slider intialization) ends  

            // Initialize full screen button
            var initFullScreenBtn = function () {
                $fullscreenbtn.tooltip({
                    placement: "top",
                    title: "fullscreen"
                });

                $fullscreenbtn.click(function() {

                    $fullscreenbtn.tooltip("hide");
                   //  var playerElement = $(".videoContainer");
                    var elem = document.getElementById("video");
                    if (elem.requestFullscreen) {
                      elem.requestFullscreen();
                    } else if (elem.msRequestFullscreen) {
                      elem.msRequestFullscreen();
                    } else if (elem.mozRequestFullScreen) {
                      elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullscreen) {
                      elem.webkitRequestFullscreen();
                      $videoContainer.addClass("fullscreen");
                    }

                    $videoContainer.on('webkitfullscreenchange mozfullscreenchange fullscreenchange', 
                                    function () {
                        if (!document.fullscreenElement && !document.mozFullScreenElement 
                                                    && !document.webkitFullscreenElement 
                                                    && !document.msFullscreenElement ) { 
                            $videoContainer.removeClass("fullscreen");
                        } 
                    });
                });
            }; // <---- function initFullScreenBtn ends here

            // play video
            var playVideo = function() {
                if (xPlayer.paused()) {
                    xPlayer.play();
                    showPausebtn();
                 } else {
                    pauseVideo();
                 }         
            };  // <--- playVideo function ends here

            // pause video
            var pauseVideo = function() {
                xPlayer.pause();
                showPlaybtn();
            }; // <--- pauseVideo function ends here

            var showPlaybtn = function (){
                $playbtnspan.show();
                $pausebtnspan.hide();
            };

            var showPausebtn = function (){
                $pausebtnspan.show();
                $playbtnspan.hide();
            };
            
     
            //------------------------------------------------------------------------------
            // a list of functions/event listeners need to be called
            // when the plugin is initialized   
            // createMainInner();
            initElements();
            initVideo();
            positionController();
            initFullScreenBtn();
            $play.on("click", playVideo); 
            // $playbtnspan.on("click", playVideo); 
            // $pausebtnspan.on("click", pauseVideo);
            $videoContainer.on("click", function() {
                if (xPlayer != null) {
                    if (xPlayer.paused())
                        playVideo();
                    else pauseVideo();
                }
            });
            // On window resize, resize the progressbar and position other play controls
            window.onresize = function(event){
                positionController();
                $markers.empty();
            };
            // $(window).on("load", initCanvas);
        }); // <--- return ends
    }; // <---- end of xPlayer plugin

})(jQuery);



function rectime(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));
    if (hr < 10) {hr = '0' + hr; }
    if (min < 10) {min = '0' + min;}
    if (sec < 10) {sec = '0' + sec;}
    if (hr) {hr = '00';}
    return hr + ':' + min + ':' + sec;
}

//Function to change timeformat from seconds to xx:yy:zz hours.     
function splitTime(timeInSeconds){
    var tm = new Date(timeInSeconds*1000)
    var hours = tm.getUTCHours();
    var minutes = tm.getUTCMinutes();
    var seconds = tm.getUTCSeconds(); 
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if (hours == 0){
        return minutes+':'+seconds;
    } else {
        return hours+':'+minutes+':'+seconds;
    }
}



// this callPlayer function is found on "http://stackoverflow.com/questions/7443578/"
// with this function we can get the reference of YouTube iframe player and call all the 
// available YouTube apis (e.g. setPlaybackRate()). YouTube iframe player object is initially
// created by Popcorn, but it is hidden from Popcorn

/**
 * @author       Rob W <gwnRob@gmail.com>
 * @website      http://stackoverflow.com/a/7513356/938089
 * @version      20131010
 * @description  Executes function on a framed YouTube video (see website link)
 *               For a full list of possible functions, see:
 *               https://developers.google.com/youtube/js_api_reference
 * @param String frame_id The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 *        (Function)      Function to call when the player is ready.
 * @param Array  args     (optional) List of arguments to pass to function func */
function callPlayer(frame_id, func, args) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }

    // When the player is not ready yet, add the event to a queue
    // Each frame_id is associated with an own queue.
    // Each queue has three possible states:
    //  undefined = uninitialised / array = queue / 0 = ready
    if (!callPlayer.queue) callPlayer.queue = {};
    var queue = callPlayer.queue[frame_id],
        domReady = document.readyState == 'complete';

    if (domReady && !iframe) {
        // DOM is ready and iframe does not exist. Log a message
        window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
        if (queue) clearInterval(queue.poller);
    } else if (func === 'listening') {
        // Sending the "listener" message to the frame, to request status updates
        if (iframe && iframe.contentWindow) {
            func = '{"event":"listening","id":' + JSON.stringify(''+frame_id) + '}';
            iframe.contentWindow.postMessage(func, '*');
        }
    } else if (!domReady ||
               iframe && (!iframe.contentWindow || queue && !queue.ready) ||
               (!queue || !queue.ready) && typeof func === 'function') {
        if (!queue) queue = callPlayer.queue[frame_id] = [];
        queue.push([func, args]);
        if (!('poller' in queue)) {
            // keep polling until the document and frame is ready
            queue.poller = setInterval(function() {
                callPlayer(frame_id, 'listening');
            }, 250);
            // Add a global "message" event listener, to catch status updates:
            messageEvent(1, function runOnceReady(e) {
                    if (!iframe) {
                        iframe = document.getElementById(frame_id);
                        if (!iframe) return;
                        if (iframe.tagName.toUpperCase() != 'IFRAME') {
                            iframe = iframe.getElementsByTagName('iframe')[0];
                            if (!iframe) return;
                        }
                    }
                if (e.source === iframe.contentWindow) {
                    // Assume that the player is ready if we receive a
                    // message from the iframe
                    clearInterval(queue.poller);
                    queue.ready = true;
                    messageEvent(0, runOnceReady);
                    // .. and release the queue:
                    while (tmp = queue.shift()) {
                        callPlayer(frame_id, tmp[0], tmp[1]);
                    }
                }
            }, false);
        }
    } else if (iframe && iframe.contentWindow) {
        // When a function is supplied, just call it (like "onYouTubePlayerReady")
        if (func.call) return func();
        // Frame exists, send message
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
    /* IE8 does not support addEventListener... */
    function messageEvent(add, listener) {
        var w3 = add ? window.addEventListener : window.removeEventListener;
        w3 ?
            w3('message', listener, !1)
        :
            (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
    }
}
// the page actually loads from here
$( document ).ready($(function() {
    // there is one div using class mainInner
    var $player = $('.mainInner');  
    $player.xPlayer({
        url : "https://www.youtube.com/watch?v=9bZkp7q19f0"
    });

    $player.on("videoReady", function () {
        $(".loading").hide();
    });

}));