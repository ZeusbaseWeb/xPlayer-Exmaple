xPlayer
=======

This is a video player supports HTML5 video, Youtube, and Vimeo. Here is how to use the xplayer.js.

1. Files to include
```HTML
    /* css */
    <link href="./YourPath/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="./YourPath/css/jquery-ui-v1.11.0.min.css" rel="stylesheet" type="text/css"> 
    <link href="./YourPath/css/xplayer.css" rel="stylesheet" type="text/css"> 
    /* js */
    <script type="text/javascript" src="./js/jquery.min.js"></script>
    <script type="text/javascript" src="./js/popcorn-complete.js"> </script>  
    <script type="text/javascript" src="./js/jquery-ui-v1.11.0.min.js"></script>
    <script type="text/javascript" src="./bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="./js/xplayer-1.0.js"></script>
```
2. HTML markup structure
```HTML
    <div class="player" style="height:300px; width:"400px">
    </div>
```    
3. Default setup xPlayer to play a video with a url. For example, Gangnam Style from Youtube(https://www.youtube.com/watch?v=9bZkp7q19f0):
```Javascript
    var $player = $('.player');  
    $player.xPlayer({
        url : "https://www.youtube.com/watch?v=9bZkp7q19f0"
    });
```
