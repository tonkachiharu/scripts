/*XRAY version 0.9a

Copyright (c) 2007 Western Civilisation pty. ltd.
https://westciv.com/xray/
We aim to open source XRAY once the initial code is stabilized
please email any suggestions, errors, feedback and so  on to john allsopp
john@westciv.com 

Some portions (c) Apple Computer
Some portions adapted from Quirksmode https://quirksmode.org and
a tutorial aby Patrick Hunlock https://www.hunlock.com/
bookmark loading code adapted from leftlogic https://leftlogic.com/lounge/articles/microformats_bookmarklet/
The XRAYHUD style inspired by the Shiira Project's HMBlkAppKit https://shiira.jp/hmblkappkit/en.html
Concept inspired by Left Logic's Microformats Bookmarklet https://leftlogic.com/lounge/articles/microformats_bookmarklet/
itself from an original concept by Jon Hicks https://www.hicksdesign.co.uk/

XRAY uses jQuery, at present for one small but crucial aspect allowing support for Safari 2, though hopefully we'll take advantage of their fine effects in upcoming releases

*/

/* 
Copyright (C) 2007 Apple Computer, Inc.  All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY APPLE COMPUTER, INC. ``AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE COMPUTER, INC. OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var WebKitDetect = {  };

// If the user agent is WebKit, returns true. Otherwise, returns false.
WebKitDetect.isWebKit = function isWebKit()
{
    return RegExp(" AppleWebKit/").test(navigator.userAgent);
}

// If the user agent is WebKit, returns an array of numbers matching the "." separated 
// fields in the WebKit version number, with an "isNightlyBuild" property specifying
// whether the user agent is a WebKit nightly build. Otherwise, returns null.
//
// Example: 418.10.1 => [ 418, 10, 1 ] isNightlyBuild: false
WebKitDetect.version = function version() 
{
    /* Some example strings: 
            Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/418.9.1 (KHTML, like Gecko) Safari/419.3
            Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Safari/521.32
     */
     
    // grab (AppleWebKit/)(xxx.x.x)
    var webKitFields = RegExp("( AppleWebKit/)([^ ]+)").exec(navigator.userAgent);
    if (!webKitFields || webKitFields.length < 3)
        return null;
    var versionString = webKitFields[2];

    var isNightlyBuild = versionString.indexOf("+") != -1;

    // Remove '+' or any other stray characters
    var invalidCharacter = RegExp("[^\\.0-9]").exec(versionString);
    if (invalidCharacter)
        versionString = versionString.slice(0, invalidCharacter.index);
    
    var version = versionString.split(".");
    version.isNightlyBuild = isNightlyBuild;
    return version;
}

// If the user agent is a WebKit version greater than or equal to the version specified
// in the string minimumString, returns true. Returns false otherwise. minimumString 
// defaults to "".
//
// Example usage: WebKitDetect.versionIsAtLeast("418.10.1")
WebKitDetect.versionIsAtLeast = function versionIsAtLeast(minimumString)
{
    function toIntOrZero(s) 
    {
        var toInt = parseInt(s);
        return isNaN(toInt) ? 0 : toInt;
    }

    if (minimumString === undefined)
        minimumString = "";
    
    var minimum = minimumString.split(".");

    var version = WebKitDetect.version();
    if (!version)
        return false;

    for (var i = 0; i < minimum.length; i++) {
        var versionField = toIntOrZero(version[i]);
        var minimumField = toIntOrZero(minimum[i]);
        
        if (versionField > minimumField)
            return true;
        if (versionField < minimumField)
            return false;
    }

    return true;
}


function isWebKit() {
	
	// String found if this is a AppleWebKit based product
	var kitName = "applewebkit/";
	var tempStr = navigator.userAgent.toLowerCase();
	var pos = tempStr.indexOf(kitName);
	var isAppleWebkit = (pos != -1);

	return isAppleWebkit;
	
	if (isAppleWebkit) {
		// Grab the version
		var kitVersion = tempStr.substring(pos + kitName.length,tempStr.length);
		kitVersion = kitVersion.substring(0,kitVersion.indexOf(" "));
		alert("Congratulations!\n You are using AppleWebKit version : " + kitVersion);

	} else {
			alert("Bummer\n You are not using AppleWebKit.");
	}
}

function isSafari2 () {
	//alert(!WebKitDetect.versionIsAtLeast("420"));
	return (!WebKitDetect.versionIsAtLeast("420")&&(isWebKit()))
}

function isIE(){
	//is this any version of IE?
	//alert(!document.defaultView);
	return (!document.defaultView)
}

//end apple web kit detect

//drag and drop support adapted fom https://www.hunlock.com/blogs/Javascript_Drag_and_Drop

var savedTarget=null;                           // The target layer (effectively vidPane)
   var orgCursor=null;                             // The original mouse style so we can restore it
   var dragOK=false;                               // True if we're allowed to move the element under mouse
   var dragXoffset=0;                              // How much we've moved the element on the horozontal
   var dragYoffset=0;                              // How much we've moved the element on the verticle

	var didDrag=false;								//set to true when we do a drag
	
	
	function moveHandler(e){
	      if (e == null) { e = window.event } 
	      if (e.button<=1&&dragOK){
	         savedTarget.style.left=e.clientX-dragXoffset+'px';
	         savedTarget.style.top=e.clientY-dragYoffset+'px';
			 return false;
	      }
	   }

	   function cleanup(e) {
	      document.onmousemove=null;
	      document.onmouseup = xRayElement;
		  savedTarget.style.cursor=orgCursor;

	      dragOK=false; //its been dragged now
	      didDrag=true;

	   }

	   function dragHandler(e){

	      var htype='-moz-grabbing';
	      if (e == null) { e = window.event;} // htype='move';} 
	      var target = e.target != null ? e.target : e.srcElement;
	      orgCursor=target.style.cursor;


		 if (inHUD(target)) {
			 target=document.getElementById("XRAYHUD");
			 target.style.webkitBoxShadow='0px 0px 0px #777777';
	         savedTarget=target;       
	         target.style.cursor=htype;
	         dragOK=true;
	         dragXoffset=e.clientX-target.offsetLeft;
	         dragYoffset=e.clientY-target.offsetTop;
	         document.onmousemove=moveHandler;
	         document.onmouseup=cleanup;
	         return false;
	      }
		else {
			 hideCanvas;
	      }
	}

	//end drag handling
	
function welcomeToXRAY(){
	var theHUD = document.getElementById("XRAYHUD");
	var newHUDContent	
	newHUDContent= '<div class="elementInfo">';
	newHUDContent= newHUDContent+'<span class="XRAYclosebox"></span>';
	newHUDContent= newHUDContent+'<p class="XRAYtitlebar">XRAY</p>';
	newHUDContent= newHUDContent+'<p><strong>Welcome to XRAY</strong></p>'

	newHUDContent= newHUDContent+'</div>';
	
	newHUDContent= newHUDContent+'<p>Click any element on the page to XRAY it.</p>'
	newHUDContent= newHUDContent+'<p>Just click the close box or refresh the page to turn off XRAY.</p>'
	
	newHUDContent= newHUDContent +'<div id="XRAYabout">';
	newHUDContent= newHUDContent+'<p><a href="https://westciv.com/xray/" class=' +'"XRAYdetailedLink"'+' onmousedown=' +"return true" +'>New version available! Now supports IE, and with new features.</a></p>';
	newHUDContent= newHUDContent+'</div>';
	theHUD.innerHTML=newHUDContent;
	
	placeHUD(window.innerHeight/2-theHUD.offsetHeight/2, window.innerWidth/2);
	
	//fade the window
	//draw(0,0,window.innerWidth ,window.innerHeight, 'rgba(0,0,0,.4)');
	
	
}	


function addCSS (){

	if (isSafari2()) {
		theCSS="<link rel='stylesheet' type='text/css' href='https://westciv.com/xray/xraysf2.css'>";
		$('head').append(theCSS); //safari 2 doesn't like inserting links then giving them a URL to create style sheets so we use jquery for that		
	}
	
	else if (isIE()) {
		var theHead = document.getElementsByTagName('head');
		var theCSS = theHead[0].appendChild(document.createElement('link'));
		theCSS.rel='stylesheet';
		theCSS.href='https://westciv.com/xray/xraywin.css';
	}
	
	else {
		var theHead = document.getElementsByTagName('head');
		var theCSS = theHead[0].appendChild(document.createElement('link'));
		theCSS.rel='stylesheet';
		theCSS.href='https://westciv.com/xray/xray.css';
	}
}

function showDetails() {
	//document.navigate;
	document.navigate("https://westciv.com");
}

function documentScrolled(){
	//called by the scroll event on the document
	hideCanvas();
}

function windowResized(){
	//called by the resize event on the document
	hideCanvas();
}

function getElementOffsetLocation(obj) {
//adapted from an example at quirksmode.org - a must read resource for javascript, DOM and all web development

	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
	}
	return [curleft,curtop];
}

function insertCanvas () {
	// inserts a canvas element to do the drawing

	var theCanvas = document.createElement('CANVAS');
	document.body.appendChild(theCanvas);
	theCanvas.id='WCcanvas';
	
	if (!isSafari2()) {
		//canvas is scaled in all browsers when it is resized using CSS, other than Safari 2
		//in safari 2, we set the width and hiieght to 100% using CSS
		//in all other browsers, we set the canvas width and geight tothe visible width and height of the canvas 
		theCanvas.width=window.innerWidth-16;
		theCanvas.height=window.innerHeight;	
	}

	theCanvas.onmousedown=hideCanvas;
}

function insertHUD () {
	// inserts a div we use for reporting element information

	var theHUD = document.createElement('div');
	document.body.appendChild(theHUD);
	theHUD.id='XRAYHUD';

}

function insertLabels () {
	// inserts the divs we use for reporting element information

	var theLabel = document.createElement('div');
	document.body.appendChild(theLabel);
	theLabel.id='XRAYWidthLabel';
	theLabel.onmousedown=hideCanvas;
	
	var theLabel = document.createElement('div');
	document.body.appendChild(theLabel);
	theLabel.id='XRAYHeightLabel';
	theLabel.onmousedown=hideCanvas;
	
	var theLabel = document.createElement('div');
	document.body.appendChild(theLabel);
	theLabel.id='XRAYTopLeftLabel';
	theLabel.onmousedown=hideCanvas;

}

function showWidthLabel (theElement) {
	// inserts a div we use for reporting element information

	var theLabel = document.getElementById("XRAYWidthLabel");
	theLabel.style.visibility='visible';
	
	whereIs=getElementOffsetLocation(theElement);
	elementTop=whereIs[1];
    elementLeft=whereIs[0];
	elementTopMargin=parseInt(getElementProperty(theElement, 'margin-top'));
	elementBottomMargin=parseInt(getElementProperty(theElement, 'margin-bottom'));
	elementTopPadding=parseInt(getElementProperty(theElement, 'padding-top'));
	elementBottomPadding=parseInt(getElementProperty(theElement, 'padding-bottom'));
	
	elementVerticalSpace=elementTopMargin+elementBottomMargin+elementTopPadding+elementBottomPadding;
	elementBottom=theElement.offsetHeight+elementTop+10;//elementVerticalSpace+5;
	elementWidth=theElement.offsetWidth;

	//make sure that the label is showing
	var labelLeft=elementLeft+(elementWidth/2)-(theLabel.offsetWidth/2);
	var labelTop=elementBottom;
	
	if (labelLeft<0) labelLeft=60;
	if (labelLeft>window.innerWidth) labelLeft=window.innerWidth-theLabel.offsetWidth-10;
	
	if (labelTop<0) labelTop=10;
//	if (labelTop>window.innerHeight) labelTop=window.innerWidth-theLabel.offsetHeight-10;
	
	theLabel.style.left=labelLeft +'px';
	theLabel.style.top=labelTop+ 'px';
	
	// theLabel.style.top=+'px';
	// theLabel.style.left=+ 'px';

	theLabel.innerHTML=getElementProperty(theElement, 'width');
}

function showHeightLabel (theElement) {
	// show the heigth label for this element

	var theLabel = document.getElementById("XRAYHeightLabel");
	theLabel.style.visibility='visible';
	
	whereIs=getElementOffsetLocation(theElement);
	elementTop=whereIs[1];
    elementLeft=whereIs[0];
	elementLeftMargin=parseInt(getElementProperty(theElement, 'margin-left'));
	elementRightMargin=parseInt(getElementProperty(theElement, 'margin-right'));
	elementLeftPadding=parseInt(getElementProperty(theElement, 'padding-left'));
	elementRightPadding=parseInt(getElementProperty(theElement, 'padding-right'));
	
	elementHorizontalSpace=elementLeftMargin+elementRightMargin+elementLeftPadding+elementRightPadding;
	elementRight=theElement.offsetWidth+elementLeft+elementHorizontalSpace;
	elementHeight=theElement.offsetHeight;

	theLabel.innerHTML=getElementProperty(theElement, 'height');

	//make sure that the label is showing
	var labelLeft=elementLeft-(theLabel.offsetWidth)-10;
	var labelTop=elementTop+(elementHeight/2)-(theLabel.offsetHeight/2);
	if (labelLeft<0) labelLeft=10;
	if (labelLeft>window.innerWidth) labelLeft=window.innerWidth-theLabel.offsetWidth-10;
	
	if (labelTop<0) labelTop=10;
	//if (labelTop>window.innerHeight) labelTop=window.innerWidth-theLabel.offsetHeight-10;
	
	theLabel.style.left=labelLeft +'px';
	theLabel.style.top=labelTop+ 'px';

}

function showTopLeftLabel (theElement) {
	// show the topleft label for this element

	var theLabel = document.getElementById("XRAYTopLeftLabel");
	theLabel.style.visibility='visible';
	
	whereIs=getElementOffsetLocation(theElement);
	elementTop=whereIs[1];
    elementLeft=whereIs[0];
	elementLeftMargin=parseInt(getElementProperty(theElement, 'margin-left'));
	elementRightMargin=parseInt(getElementProperty(theElement, 'margin-right'));
	elementLeftPadding=parseInt(getElementProperty(theElement, 'padding-left'));
	elementRightPadding=parseInt(getElementProperty(theElement, 'padding-right'));
	
	elementHorizontalSpace=elementLeftMargin+elementRightMargin+elementLeftPadding+elementRightPadding;
	elementRight=theElement.offsetWidth+elementLeft+elementHorizontalSpace;
	elementHeight=theElement.offsetHeight;

	theLabel.innerHTML=elementTop + "px" + ", " + elementLeft + "px";

	//make sure that the label is showing
	var labelLeft=elementLeft-(theLabel.offsetWidth/2);
	var labelTop=elementTop-(theLabel.offsetHeight) -10;
	
	if (labelLeft<0) labelLeft=60;
	if (labelLeft>window.innerWidth) labelLeft=window.innerWidth-theLabel.offsetWidth-10;
	
	if (labelTop<0) labelTop=10;
	//if (labelTop>window.innerHeight) labelTop=window.innerWidth-theLabel.offsetHeight-10;
	
	theLabel.style.left=labelLeft +'px';
	theLabel.style.top=labelTop+ 'px';


	// theLabel.style.left= +'px';
	// theLabel.style.top=+ 'px';

}

function placeHUD(elementTop, elementLeft){
	//place the HUD relative to the element we are displaying inforrmation on
	
	var theHUD = document.getElementById("XRAYHUD");
	theHUD.style.visibility='visible';
	
	if (didDrag) return; //once dragged, don't position it
	
	theHUD.style.top=elementTop-50+'px';
	theHUD.style.left=elementLeft-50+'px';

}


function hideCanvas() {
	var canvas = document.getElementById("WCcanvas");
 	canvas.style.visibility='hidden';
	//canvas.style.display='none';
 	//alert('hiding canvas');
	hideLabels();

}

function hideLabels() {
	var widthLabel = document.getElementById("XRAYWidthLabel");
 	widthLabel.style.visibility='hidden';

	var heightLabel = document.getElementById("XRAYHeightLabel");
 	heightLabel.style.visibility='hidden';

	var topLeftLabel = document.getElementById("XRAYTopLeftLabel");
 	topLeftLabel.style.visibility='hidden';
}


function showCanvas() {
	var canvas = document.getElementById("WCcanvas");
 	//canvas.style.display='block';
	
	canvas.style.visibility='visible';
 	//$("#canvas").fadeIn("slow");
	// alert('showing canvas');

	//alert(canvas.height);
	
	//alert(getElementProperty(canvas, 'z-index'));
	//showHUD();
}

function hideHUD() {
	var theHUD = document.getElementById("XRAYHUD");
 	theHUD.style.visibility='hidden';
}

function showHUD() {
	var theHUD = document.getElementById("XRAYHUD");
 	theHUD.style.visibility='visible';

}

function inHUD(obj) {
	//is the element in the HUD element?
	
	if (obj.id=="XRAYHUD") return true;
	
//	alert(obj.parentNode);
	
	if (obj.parentNode) {
		while (obj = obj.parentNode) {
			if (obj.id=="XRAYHUD") return true;
		}
	}
}

function showElementDetails(theElement){
	//show details about the element in the HUD
	
	var theHUD = document.getElementById("XRAYHUD");
	var newHUDContent
	
	//alert();
	newHUDContent= '<div class="elementInfo">';
	newHUDContent= newHUDContent+'<span class="XRAYclosebox"></span>';
	newHUDContent= newHUDContent+'<p class="XRAYtitlebar">XRAY</p>';
	newHUDContent= newHUDContent+'<p><strong>element:</strong> ' + (theElement.nodeName).toLowerCase() +'</p>';
	newHUDContent= newHUDContent+'<p><strong>id:</strong> ' + (theElement.id) +'</p>';
	newHUDContent= newHUDContent+'<p><strong>class:</strong> ' + (theElement.className) +'</p>';
	newHUDContent= newHUDContent+'</div>';
	
	
	newHUDContent= newHUDContent+'<div id="HUDHierarchy">';
	newHUDContent= newHUDContent+'<p><strong>inheritance hierarchy</strong> '+'</p>';
	newHUDContent= newHUDContent+'<p>'+ getElementHierarchy(theElement) +'</p>';
	newHUDContent= newHUDContent+'</div>';

	newHUDContent= newHUDContent+'<div class="group">';
	newHUDContent= newHUDContent+'<p><strong>position:</strong> '+ getElementProperty(theElement, 'position') +'</p>';
	
	whereIs=getElementOffsetLocation(theElement);
	elementTop=whereIs[1];
    elementLeft=whereIs[0];
	
	
	newHUDContent= newHUDContent+'<ul>';
	newHUDContent= newHUDContent+'<li><strong>top: </strong> ' + getElementProperty(theElement, 'top')+ ' (' + elementTop +'px)</li>';
	newHUDContent= newHUDContent+'<li><strong>left: </strong>' + getElementProperty(theElement, 'left') + ' (' + elementLeft +'px)</li>';
	newHUDContent= newHUDContent+'<li><strong>width: </strong>' + getElementProperty(theElement, 'width')+ ' (' + theElement.offsetWidth +'px)</li>';
	newHUDContent= newHUDContent+'<li><strong>height: </strong>' + getElementProperty(theElement, 'height')+ ' (' + theElement.offsetHeight +'px)</li>';
	newHUDContent= newHUDContent+'<li><strong>float: </strong>' + getElementProperty(theElement, 'float')+'</li>';
	newHUDContent= newHUDContent+'</ul>';	
	newHUDContent= newHUDContent+'</div>';

	
	newHUDContent= newHUDContent+'<div class="group">';
	newHUDContent= newHUDContent+'<p><strong>margin</strong> '+'</p>';
	
	newHUDContent= newHUDContent+'<ul>';
	newHUDContent= newHUDContent+'<li><strong>top:</strong> ' + getElementProperty(theElement, 'margin-top')+'</li>';
	newHUDContent= newHUDContent+'<li><strong>right:</strong> ' + getElementProperty(theElement, 'margin-right')+'</li>';
	newHUDContent= newHUDContent+'<li><strong>bottom:</strong> ' + getElementProperty(theElement, 'margin-bottom')+'</li>';
	newHUDContent= newHUDContent+'<li><strong>left:</strong> ' + getElementProperty(theElement, 'margin-left')+'</li>';
	
	newHUDContent= newHUDContent+'</ul>';	
	newHUDContent= newHUDContent+'</div>';
	
	newHUDContent= newHUDContent+'<div class="group">';
	newHUDContent= newHUDContent+'<p><strong>padding</strong> '+'</p>';
	newHUDContent= newHUDContent+'<ul>';

	newHUDContent= newHUDContent+'<li><strong>top:</strong> ' + getElementProperty(theElement, 'padding-top')+'</li>';
	newHUDContent= newHUDContent+'<li><strong>right:</strong> ' + getElementProperty(theElement, 'padding-right')+'</li>';
	newHUDContent= newHUDContent+'<li><strong>bottom:</strong> ' + getElementProperty(theElement, 'padding-bottom')+'</li>';
	newHUDContent= newHUDContent+'<li><strong>left:</strong> ' + getElementProperty(theElement, 'padding-left')+'</li>';

	newHUDContent= newHUDContent+'</ul>';
	newHUDContent= newHUDContent+'</div>';
	
	newHUDContent= newHUDContent +'<div id="XRAYabout">';
	newHUDContent= newHUDContent+'<p><a href="https://westciv.com/xray/" class=' +'"XRAYdetailedLink"'+' onmousedown=' +"return true" +'>New version available! Now supports IE, and with new features.</a></p>';
	newHUDContent= newHUDContent+'</div>';
	theHUD.innerHTML=newHUDContent;
	
}

function getClientSize() {
	//https://www.howtocreate.co.uk/tutorials/javascript/browserwindow
	var myWidth = 0, myHeight = 0;
	  if( typeof( window.innerWidth ) == 'number' ) {
	    //Non-IE
	    myWidth = window.innerWidth;
	    myHeight = window.innerHeight;
	  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
	    //IE 6+ in 'standards compliant mode'
	    myWidth = document.documentElement.clientWidth;
	    myHeight = document.documentElement.clientHeight;
	  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
	    //IE 4 compatible
	    myWidth = document.body.clientWidth;
	    myHeight = document.body.clientHeight;
	  }
	return [myHeight, myWidth];	
	}
	

function getClientHeight(){
	//return the height of the display area

	theSize=getClientSize();
	theHeight=theSize[0];

	return theHeight
}

function getClientWidth(){
	//return the height of the display area
	
	theSize=getClientSize();
	theWidth=theSize[1];
    
	return theWidth
}


function getScrollXY() {

//https://www.howtocreate.co.uk/tutorials/javascript/browserwindow
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}


function getScrollX(){
	//return the current x scroll

	return getScrollXY()[0]
}

function getScrollY(){
	//return the current y scroll

	return getScrollXY()[1]
}

function getIEPropertyName(thePropertyName){
	//IE properties have the form propertyName, as opposed to the property-name
	var newName="";
	if (thePropertyName.indexOf('-')!=0) {
		var parts = new Array();
		parts = thePropertyName.split('-');
	}
		
	newName=parts[0];
	for (var i = 1; i < parts.length; i++){
		nextPart=parts[i].substring(0, 1).toUpperCase();
		newName=newName+nextPart+parts[i].substring(1,parts[i].length)
	} 
	return newName;
}

function getElementProperty(theElement, whichStyle)
{
	//adapted from quirksmode.org
	
	//if IE, change format of property name
	
	if(!document.defaultView) {
		whichStyle=getIEPropertyName(whichStyle)
	}
	
	if (theElement.currentStyle){ //problem is that this is not computed, its th evalue set, so could be 'auto'
		var y = theElement.currentStyle[whichStyle];
	}
	else if (window.getComputedStyle) {
		var y = document.defaultView.getComputedStyle(theElement,null).getPropertyValue(whichStyle);
	}
	
	else {
		elementCSSDeclaration=document.defaultView.getComputedStyle(theElement,"");
	    y= elementCSSDeclaration.getPropertyValue(whichStyle);
	}
	
//	alert(y);
	return y;
}


function setElementProperty (theElement, whichStyle, theValue) {
	// set the  value for the named property for the element to the given value
	//it's returned as a string so convert to an integer if you need to use it rather than display it
	//elementCSSDeclaration=document.defaultView.getComputedStyle(theElement,"");
    //

	if(!document.defaultView) {
		whichStyle=getIEPropertyName(whichStyle)
	}
	
	if (theElement.currentStyle) {
		//alert(whichStyle);
//		theElement.currentStyle[whichStyle]=theValue;
		theElement.style.whichStyle=theValue;
		
	}
	else if (window.getComputedStyle)
		theElement.style.setProperty(whichStyle, theValue, null);

}

function getElementHierarchy (theElement) {
	// return the inheritance hierarchy in the form parent<grandparent...<root
	//it's returned as a string so convert to an integer if you need to use it rather than display it
		var theHierarchy="";
		var i=0;
		theHierarchy=theElement.nodeName.toLowerCase();
		if (theElement.parentNode) {
			while ((theElement = theElement.parentNode) && (theElement.parentNode!=null))  {
				i++;
				//theHierarchy=theHierarchy+'&lt;'+ '<a href="#" onmousedown="xRayAncestor('+ i +')">'+theElement.nodeName.toLowerCase() +'</a>';
				theHierarchy= '<a href="#" onmousedown="xRayAncestor('+ i +')">'+theElement.nodeName.toLowerCase() +'</a>' +' &gt; '+ theHierarchy;
			}
		//alert(theHierarchy);			
		return theHierarchy;//.toLowerCase();
		}
	
}

function getIntegerValue(theVal) {
	//alert(theVal);

	var newVal= theVal.substr(0, theVal.length-2).valueOf();
	
	if (isNaN(newVal)) {
		//alert(theVal);
		return 0;
	}
	else {
		return parseInt(newVal);
		}
}


function clearCanvas () {
	//delete it and reinsert it
var canvas = document.getElementById("WCcanvas");

canvas.parentNode.removeChild(canvas);
insertCanvas();



}

function eraseCanvas (elementTop, elementLeft, elementWidth, elementHeight) {
 var canvas = document.getElementById("WCcanvas");
 var ctx = canvas.getContext("2d");
ctx.clearRect(elementLeft, elementTop, elementWidth, elementHeight);

}

function draw(elementTop, elementLeft, elementWidth, elementHeight, fillColor) {
 var canvas = document.getElementById("WCcanvas");
 var ctx = canvas.getContext("2d");

  showCanvas();

 ctx.fillStyle = fillColor
 ctx.fillRect (elementLeft, elementTop, elementWidth, elementHeight);

//alert(elementLeft + " " +  elementTop  + " " +  elementWidth + " " +  elementHeight);

}


function drawWidthLine(theElement) {
	//draw the line to show the width of the content
	
	 var canvas = document.getElementById("WCcanvas");
	 var ctx = canvas.getContext("2d");

//assume it's already showing - called after draw - which shows the canvas

windowScrollX=getScrollX();
windowScrollY=getScrollY();


whereIs=getElementOffsetLocation(theElement);
elementTop=parseInt(whereIs[1])-windowScrollY;
elementLeft=parseInt(whereIs[0])-windowScrollX;
elementTopMargin=parseInt(getElementProperty(theElement, 'margin-top'));
elementBottomMargin=parseInt(getElementProperty(theElement, 'margin-bottom'));
elementTopPadding=parseInt(getElementProperty(theElement, 'padding-top'));
elementBottomPadding=parseInt(getElementProperty(theElement, 'padding-bottom'));
elementLeftPadding=parseInt(getElementProperty(theElement, 'padding-left'));
elementRightPadding=parseInt(getElementProperty(theElement, 'padding-right'));
elementVerticalSpace=elementBottomMargin+elementBottomPadding;

elementBottom=parseInt(theElement.offsetHeight)+elementTop+5;//	+elementVerticalSpace;//+10;
elementWidth=parseInt(theElement.offsetWidth);

ctx.strokeColor='rgba(255,255,255,1)'

ctx.beginPath;
//do the line
ctx.moveTo(elementLeft+elementLeftPadding, elementBottom+2);
ctx.lineTo(elementLeft+elementWidth-elementRightPadding, elementBottom+2);

//now do the line limits

ctx.lineWidth=1;
ctx.moveTo(elementLeft+elementWidth-elementRightPadding, elementBottom-1);
ctx.lineTo(elementLeft+elementWidth-elementRightPadding, elementBottom+5);

ctx.moveTo(elementLeft+elementLeftPadding, elementBottom-1);
ctx.lineTo(elementLeft+elementLeftPadding, elementBottom+5);


ctx.stroke();
//alert(elementLeft+elementWidth);

ctx.closePath;	
	
}

function drawHeightLine(theElement) {
	//draw the line to show the height of the content
	
	 var canvas = document.getElementById("WCcanvas");
	 var ctx = canvas.getContext("2d");

//assume it's already showing - called after draw - which shows the canvas

windowScrollX=getScrollX();
windowScrollY=getScrollY();


whereIs=getElementOffsetLocation(theElement);
elementTop=parseInt(whereIs[1])-windowScrollY;
elementLeft=parseInt(whereIs[0])-windowScrollX;

elementLeftMargin=parseInt(getElementProperty(theElement, 'margin-left'));
elementRightMargin=parseInt(getElementProperty(theElement, 'margin-right'));
elementLeftPadding=parseInt(getElementProperty(theElement, 'padding-left'));
elementRightPadding=parseInt(getElementProperty(theElement, 'padding-right'));
elementTopPadding=parseInt(getElementProperty(theElement, 'padding-top'));
elementTopMargin=parseInt(getElementProperty(theElement, 'margin-top'));

//alert(elementTopPadding);

elementHorizontalSpace=elementLeftMargin+elementRightMargin+elementLeftPadding+elementRightPadding;
elementRight=parseInt(theElement.offsetWidth)+elementLeft+elementHorizontalSpace;
elementHeight=parseInt(theElement.offsetHeight);
//elementHeight=parseInt(getElementProperty(theElement, 'top'));
ctx.strokeColor='rgba(255,255,255,1)'

ctx.beginPath;
ctx.moveTo(elementLeft-elementRightMargin-5, elementTop+elementTopPadding);
ctx.lineTo(elementLeft-elementRightMargin-5, elementTop+elementHeight-elementBottomPadding);

ctx.moveTo(elementLeft-elementRightMargin-7, elementTop+elementTopPadding);
ctx.lineTo(elementLeft-elementRightMargin-3, elementTop+elementTopPadding);

ctx.moveTo(elementLeft-elementRightMargin-7, elementTop+elementHeight-elementBottomPadding);
ctx.lineTo(elementLeft-elementRightMargin-3, elementTop+elementHeight-elementBottomPadding);



ctx.stroke();
//alert(elementLeft+elementWidth);

ctx.closePath;	
	
}


function drawTopLeft(theElement) {
	//drawindicate where the top left is - it tricks people
	
var canvas = document.getElementById("WCcanvas");
var ctx = canvas.getContext("2d");

//assume it's already showing - called after draw - which shows the canvas

windowScrollX=getScrollX();
windowScrollY=getScrollY();

whereIs=getElementOffsetLocation(theElement);
elementTop=parseInt(whereIs[1])-windowScrollY;
elementLeft=parseInt(whereIs[0])-windowScrollX;

elementLeftMargin=parseInt(getElementProperty(theElement, 'margin-left'));
elementRightMargin=parseInt(getElementProperty(theElement, 'margin-right'));
elementLeftPadding=parseInt(getElementProperty(theElement, 'padding-left'));
elementRightPadding=parseInt(getElementProperty(theElement, 'padding-right'));
elementTopPadding=parseInt(getElementProperty(theElement, 'padding-top'));

elementHorizontalSpace=elementLeftMargin+elementRightMargin+elementLeftPadding+elementRightPadding;
elementRight=parseInt(theElement.offsetWidth)+elementLeft+elementHorizontalSpace;
elementHeight=parseInt(theElement.offsetHeight);

ctx.save();
ctx.strokeColor='rgba(255,0,0,1)'

ctx.beginPath;

ctx.arc(elementLeft, elementTop, 4, 0, (Math.PI*2), 1);

ctx.closePath();	
ctx.fill();

ctx.restore();	
}

function xRayAncestor(ancestorIndex) {
	//show the details for the nth ancestor of the currently targetted element
	var ancestorNode;
	var i=0;
	
	//alert(currentPatient);
	if (currentPatient){
		ancestorNode=currentPatient;
		for (var i = 0; i < ancestorIndex; i++){
				ancestorNode = ancestorNode.parentNode;
		}
	}
	
	//alert(ancestorNode);
	
	if (ancestorNode) {
		currentPatient=ancestorNode;
		drawElementSkeleton(ancestorNode);
		showElementDetails(ancestorNode);
		showWidthLabel(ancestorNode);
		showHeightLabel(ancestorNode);
		showTopLeftLabel(ancestorNode);
	}
}

var currentPatient; //this is the element currently being xrayed

function xRayElement(e) {
//xray the element - called by the click handler

//alert('click');

//return false;

if (!e) var e = window.event;
    if (e.target) var tg = e.target;
    else if (e.srcElement) var tg = e.srcElement;

    while (tg.nodeName == '#text'){
		tg = tg.parentNode;
	}
	
	if (tg.className=='XRAYclosebox'){ 
		//alert(tg.className);
		//hideHUD();
		uninstallXRAY();
		return false;
	}
	
	if (tg.className=='XRAYdetailedLink'){ 
		document.navigate("https://westciv.com");
		return true;
	}
	
	//alert(tg.className);
	
	if (inHUD(tg)) return false;
	currentPatient=tg;
	drawElementSkeleton(tg);
	showElementDetails(tg);
	showWidthLabel(tg);
	showHeightLabel(tg);
	showTopLeftLabel(tg);

	return false;
	
}

function drawElementSkeleton(theElement){
	//draws the 'skeleton' of the given element
		

		whereIs=getElementOffsetLocation(theElement);		
		
		elementTop=parseInt(whereIs[1]);
	    elementLeft=parseInt(whereIs[0]);
	    elementWidth=theElement.offsetWidth.valueOf();
	    elementHeight=theElement.offsetHeight.valueOf(); 

	 	topPadding=getElementProperty(theElement,'padding-top');
	  	topPadding=getIntegerValue(topPadding);
		
		bottomPadding=getElementProperty(theElement,'padding-bottom');
		bottomPadding=getIntegerValue(bottomPadding);
		leftPadding=getElementProperty(theElement,'padding-left');
		leftPadding=getIntegerValue(leftPadding);
		rightPadding=getElementProperty(theElement,'padding-right');
		rightPadding=getIntegerValue(rightPadding);

		topBorder=getElementProperty(theElement,'border-top-width');
	  	topBorder=getIntegerValue(topBorder);
		bottomBorder=getElementProperty(theElement,'border-bottom-width');
		bottomBorder=getIntegerValue(bottomBorder);
		leftBorder=getElementProperty(theElement,'border-left-width');
		leftBorder=getIntegerValue(leftBorder);
		rightBorder=getElementProperty(theElement,'border-right-width');
		rightBorder=getIntegerValue(rightBorder);
	

	    topMargin=getElementProperty(theElement,'margin-top');
	    topMargin=getIntegerValue(topMargin);
	    bottomMargin=getElementProperty(theElement,'margin-bottom');
	    bottomMargin=getIntegerValue(bottomMargin);
	    leftMargin=getElementProperty(theElement,'margin-left');
	    leftMargin=getIntegerValue(leftMargin);
	    rightMargin=getElementProperty(theElement,'margin-right');
	    rightMargin=getIntegerValue(rightMargin);
			
		clearCanvas();

	//semi opaque the whole window- needs to adjust canvas width and scale for window without scrollbars


		windowScrollX=getScrollX();
		windowScrollY=getScrollY();
		
		
		draw(0,0,window.innerWidth ,window.innerHeight, 'rgba(0,0,0,.4)');

		//clear the area where the element is
		eraseCanvas(elementTop-topMargin-topBorder-windowScrollY, elementLeft-leftMargin-leftBorder-windowScrollX, elementWidth+leftMargin+rightMargin+leftBorder+rightBorder, elementHeight+ topMargin + bottomMargin+bottomBorder+topBorder);

		//draw the margin box
		//window.defaultstatus=elementTop-topMargin-topBorder-windowScrollY
	   	draw(elementTop-topMargin-topBorder-windowScrollY, elementLeft-leftMargin-leftBorder, elementWidth+leftMargin+rightMargin+leftBorder+rightBorder, elementHeight+ topMargin + bottomMargin+bottomBorder+topBorder, 'rgba(0, 0, 255 , .4)');
		//alert(elementWidth+ " " + leftMargin+ " " + rightMargin+ " " + leftBorder+ " " + rightBorder +elementWidth+leftMargin+rightMargin+leftBorder+rightBorder);

		//draw the padding box
		//alert(elementWidth);
		//alert(elementTop-windowScrollY);//-windowScrollY + " " +  elementLeft-windowScrollX + " " +  elementWidth  + " " +   elementHeight)
		draw(elementTop-windowScrollY, elementLeft-windowScrollX, elementWidth, elementHeight, 'rgba(255, 0, 0, .4)');

		//draw the content box
		eraseCanvas(elementTop+topPadding+topBorder-windowScrollY, elementLeft+leftPadding+leftBorder-windowScrollX, elementWidth-leftPadding-rightPadding-leftBorder-rightBorder, elementHeight-topPadding-bottomPadding-topBorder-bottomBorder);
		
		drawWidthLine(theElement);
		drawHeightLine(theElement);
		
		//drawTopLeft(theElement);
		
	//now show info about the XRAY'd element
	placeHUD(window.innerHeight/2, window.innerWidth/2);
}

function uninstallXRAY(){
	//when the user closes the application, reove all the stuff, and event handlers
	
	document.onclick = null;
	document.onmouseup = null;
	document.onmousedown = null;
	document.onscroll = null;
	window.onresize = null;
	
	
	var canvas = document.getElementById("WCcanvas");
	canvas.parentNode.removeChild(canvas);
	
	var theHUD = document.getElementById('XRAYHUD');
	theHUD.parentNode.removeChild(theHUD);
	
	//alert();
	
	var theLabel = document.getElementById('XRAYWidthLabel');
	theLabel.parentNode.removeChild(theLabel);

	var theLabel = document.getElementById('XRAYHeightLabel');
	theLabel.parentNode.removeChild(theLabel);

	var theLabel = document.getElementById('XRAYTopLeftLabel');
	theLabel.parentNode.removeChild(theLabel);
	
	//remove the script elements
	
	var theScript = document.getElementById('XRAYjs');
	theScript.parentNode.removeChild(theScript);

	var theScript = document.getElementById('JQjs');
	theScript.parentNode.removeChild(theScript);


	
	
}

function installXRAY() {

	//installs handlers for clicking
	//to do if page is not already loaded, install this as the clik handler then return
	
	addCSS();
	insertCanvas();
	insertHUD();
	insertLabels();
	welcomeToXRAY();

	document.onclick = xRayElement;
	document.onmouseup = xRayElement;
	document.onmousedown = dragHandler;
	document.onscroll = documentScrolled;
	window.onresize = windowResized;	
	
	var theHUD = document.getElementById("XRAYHUD");
	theHUD.onmousedown=dragHandler;
	
	return;
	
	}
	
installXRAY(); // for deployment, simply call the install function as the page is already loaded 
//window.onload=installEventHandlers; // for deployment, simply call the install function as the page is already loaded 
