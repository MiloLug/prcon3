".LFEW_TextArea".on("combination","tab",function(e){
	document.execCommand("insertText", false, "\t");
},false);
window.A.on("combination","ctrl+s",function(e){
	window.UI.saveFile();
},false);
window.A.on("combination","ctrl+r",function(e){
	window.UI.closeRedactor();
},false);

window.UI.Ainit({
	closeRedactor: function (TH) {
		window.rObj.windowed.attention(false,window.thisUrl);
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "close file?".tr+"<br>" + window.thisUrl
				}, {
					type: "button",
					btntext: "yes".tr,
					btnID: "y"
				}, {
					type: "button",
					btntext: "no".tr,
					btnID: "n"
				}
			],
			onEnter: "y",
			onEsc: "n",
			func: function (data) {
				var pr = data.pressed;
				if (pr !== "y")
					return;
				window.rObj.close(false, window.thisUrl);
			}
		});
	},
	saveFile: function (TH) {
		window.rObj.windowed.attention(false,window.thisUrl);
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "save file?".tr+"<br>" + window.thisUrl
				}, {
					type: "button",
					btntext: "yes".tr,
					btnID: "y"
				}, {
					type: "button",
					btntext: "no".tr,
					btnID: "n"
				}
			],
			onEnter: "y",
			onEsc: "n",
			func: function (data) {
				var pr = data.pressed;
				if (pr !== "y")
					return;
				window.rObj.windowed.save(false, window.thisUrl);
			}
		});
	},
	unWindowedRedactor: function(TH){
		window.rObj.windowed.unwindowed(false, window.thisUrl);
	}
});
