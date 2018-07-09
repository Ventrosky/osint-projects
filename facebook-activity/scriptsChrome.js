


var scroll = setInterval(function(){ window.scrollBy(0,1000); }, 2000);

clearInterval(scroll);
/*
<script>
function start_scroll_down() { 
   scroll = setInterval(function(){ window.scrollBy(0, 1000); console.log('start');}, 1500);
}
function stop_scroll_down() {
   clearInterval(scroll);
   console.log('stop');
}
</script>
<button onclick="start_scroll_down();">Start Scroll</button>
<button onclick="stop_scroll_down();">Stop Scroll</button>*/


//_5pbx userContent _3576
abbr_tags = document.getElementsByTagName("abbr")

timestamps = ""

for(var i = 0; i < abbr_tags.length; i++) { timestamps += abbr_tags[i].getAttribute("data-utime") + "\r\n"; }
copy(timestamps);
