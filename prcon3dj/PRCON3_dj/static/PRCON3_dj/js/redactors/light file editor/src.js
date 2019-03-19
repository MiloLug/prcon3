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
	<meta charset="UTF-8">\
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/loader.css"/>\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/layers.css"/>\
<head/>\
<body>\
	<div class="lsplace">\
		<div class="loadscreen start">\
			<div class="box">\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
			</div>\
		</div>\
	</div>\
	<script src="static/PRCON3_dj/js/CE.js"></script>\
	<script src="static/PRCON3_dj/js/bjs.js"></script>\
	<script src="static/PRCON3_dj/js/bjs_events.js"></script>\
	<script src="'+CUR_REDACTOR_PATH+'js.js"></script>\
	<script src="static/PRCON3_dj/js/lang/setter.js"></script>\
	<script src="static/PRCON3_dj/js/common.js"></script>\
	<script src="static/PRCON3_dj/js/parser.js"></script>\
	<script src="static/PRCON3_dj/js/interactive.js"></script>\
	<script src="static/PRCON3_dj/js/scroll.js"></script>\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/scroll.css"/>\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/fonts/hack/index.css"/>\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/common.css"/>\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/generalStructure.css"/>\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/forBlocks.css"/>\
	<link rel="stylesheet" type="text/css" href="static/PRCON3_dj/css/rules.css"/>\
	<link rel="stylesheet" type="text/css" href="'+CUR_REDACTOR_PATH+'style.css"/>\
	<div class="sources" hidden>\
		<div act="dialogInputSrc">\
	  		<input type="text" class="inputstyle cls">\
	      	<textarea type="text" class="inputstyle cls"></textarea>\
	      	<button class="blackbtn bwhitefont cls"></button>\
	      	<label class="chbstyle"><input type="checkbox" hidden><div>&#10003;</div><text></text></label>\
	  	</div>\
	  	<div act="loadscreen">\
			<div class="box">\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
				<div></div>\
			</div>\
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
	<div class="dialogback" hidden>\
	</div>\
<body/>\
<script src="static/PRCON3_dj/js/UI_main.js"></script>\
<script src="'+CUR_REDACTOR_PATH+'UI.js"></script>\
<script src="static/PRCON3_dj/js/UI_click.js"></script>\
<script>UI.setLSToPlace("body",false);\
  window.opened=true;</script>';
})(window);