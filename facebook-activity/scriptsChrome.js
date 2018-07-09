
var scroll = setInterval(function(){ window.scrollBy(0,1000); }, 2000);

clearInterval(scroll);

abbr_tags = document.getElementsByTagName("abbr")

timestamps = ""

for(var i = 0; i < abbr_tags.length; i++) { timestamps += abbr_tags[i].getAttribute("data-utime") + "\r\n"; }
copy(timestamps);
