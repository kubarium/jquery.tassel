Tassel is a jQuery plugin to turn your `<hr>` tag into something like this :

![Tasselled hr tag](http://s6.postimg.org/3v6rmm98h/tassel.gif)

##Dependency

jQuery 1.x or 2.x depending on how you want to handle error events.

##Usage

Set up for errors if configuration is wrong or images are not available
```
$(document).on('tasselImageLoadError', 'hr', function(event){
	console.log(event);
}).on('tasselConfigurationError', 'hr', function(event){
	console.log('tasselConfigurationError');
});
``` 

Tassel your `<hr>` here!
```
$('hr').tassel({
	"tassel_left":"http://s6.postimage.org/wo98awxml/33_left.png",
	"tassel_middle":"http://s6.postimage.org/yu3j5f131/line.png",
	"tassel_right":"http://s6.postimage.org/vbrj91071/33_right.png"    
});
``` 
Optionally, you can pass only "left" and "right" tassels so `<hr>` will be as wide as the both parts combined.

##Error Handling
During tasseling :

* if you are missing "tassel_left" or "tassel_right" then you'll have a "tasselConfigurationError"
* if one of the tassel images is not loaded then you'll have a "tasselImageLoadError" with the following properties in the event :
	* tassel : "left" | "middle" | "right" depending on which one has failed
	* path : indicating the path you provided

##Browser Support

* Microsoft Internet Explorer 9 + 
* Google Chrome 
* Mozilla FireFox
* Apple Safari
* Opera
* iOS
* Android

##Why?

Because using `<hr>` is more semantic than using

```
<div>
	  <img src="http://s6.postimage.org/wo98awxml/33_left.png" width="134" height="30"/>
	  <img src="http://s6.postimage.org/yu3j5f131/line.png" width="500" height="30"/>
	  <img src="http://s6.postimage.org/vbrj91071/33_right.png" width="134" height="30"/>
</div>
```