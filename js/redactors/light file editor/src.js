(function(W){
W.JS_SRC.lightFileRedactor='\
	<div class="backcontent">\
		<iframe seamless=" " sandbox="allow-scripts allow-same-origin" class="lFileTextFrame"></iframe>\
	</div>\
	<div class="downmenu">\
		<button class="blackbtn bwhitefont cls" funcs="saveFile">'+'save'.tr+'</button>\
		<button class="blackbtn bwhitefont cls" funcs="closeRedactor">'+'close'.tr+'</button>\
		<button class="blackbtn bwhitefont cls" funcs="windowedRedactor">'+'in window'.tr+'</button>\
		<button class="blackbtn bwhitefont cls" funcs="openedFiles">'+'opened files'.tr+'</button>\
	</div>';
W.JS_SRC.lightFileRedactorWindowed='\
<head>\
	<title class="LFEW_Title"></title>\
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" charset="utf-8">\
	<link rel="stylesheet" type="text/css" href="css/loader.css"/>\
	<link rel="stylesheet" type="text/css" href="css/layers.css"/>\
<head/>\
<body>\
	<div class="lsplace">\
		<div class="loadscreen start">\
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 180 180" width="100%" height="100%">\
	          	<circle class="SVGloaderCirc1" cx="50%" cy="50%" r="80"></circle>\
	          	<circle class="SVGloaderCirc2"></circle>\
	      	</svg>\
	      	<div></div>\
		</div>\
	</div>\
	<script src="js/js.js"></script>\
	<script src="js/events.js"></script>\
	<script src="js/redactors/light file editor/js.js"></script>\
	<script src="js/lang/setter.js"></script>\
	<script src="js/common.js"></script>\
	<script src="js/parser.js"></script>\
	<script src="js/interactive.js"></script>\
	<link rel="stylesheet" type="text/css" href="css/common.css"/>\
	<link rel="stylesheet" type="text/css" href="css/generalStructure.css"/>\
	<link rel="stylesheet" type="text/css" href="css/forBlocks.css"/>\
	<link rel="stylesheet" type="text/css" href="css/rules.css"/>\
	<link rel="stylesheet" type="text/css" href="js/redactors/light file editor/style.css"/>\
	<div class="sources" hidden>\
		<div act="dialogInputSrc">\
	  		<input type="text" class="inputstyle cls">\
	      	<textarea type="text" class="inputstyle cls"></textarea>\
	      	<button class="blackbtn bwhitefont cls"></button>\
	      	<label class="chbstyle"><input type="checkbox" hidden><div>&#10003;</div><text></text></label>\
	  	</div>\
	  	<div act="loadscreen">\
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 180 180" width="100%" height="100%">\
	          	<circle class="SVGloaderCirc1" cx="50%" cy="50%" r="80"/>\
	          	<circle class="SVGloaderCirc2"/>\
	      	</svg>\
	      	<div></div>\
		</div>\
	</div>\
	<div class="backcontent">\
		<textarea class="LFEW_TextArea"></textarea>\
	</div>\
	<div class="downmenu">\
		<button class="blackbtn bwhitefont cls" funcs="saveFile">'+'save'.tr+'</button>\
		<button class="blackbtn bwhitefont cls" funcs="closeRedactor">'+'close'.tr+'</button>\
		<button class="blackbtn bwhitefont cls" funcs="unWindowedRedactor">'+'not in window'.tr+'</button>\
	</div>\
	<div class="dialogback center" hidden>\
	</div>\
<body/>\
<script src="js/UI_main.js"></script>\
<script src="js/redactors/light file editor/UI.js"></script>\
<script src="js/UI_click.js"></script>\
<script>UI.setLSToPlace("body",false);\
  window.opened=true;</script>';
})(window);