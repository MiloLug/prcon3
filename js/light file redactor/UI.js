".LFEW_TextArea".on("combination","tab",function(e){
	document.execCommand("insertText", false, "\t");
	e.stopEvent();
});
window.UI.Ainit({
	closeRedactor: function (TH,url) {
		window.rObj.windowed.attention(false,window.thisUrl);
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "Do you want to close this file?<br>" + window.thisUrl
				}, {
					type: "button",
					btntext: "yes",
					btnID: "y"
				}, {
					type: "button",
					btntext: "no",
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
	saveFile: function (TH,url) {
		window.rObj.windowed.attention(false,window.thisUrl);
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "Do you want to save this file?<br>" + window.thisUrl
				}, {
					type: "button",
					btntext: "yes",
					btnID: "y"
				}, {
					type: "button",
					btntext: "no",
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
	unWindowedRedactor: function(TH,url){
		window.rObj.windowed.unwindowed(false, window.thisUrl);
	}
});
