;(function (W) {
	var rName = "light file redactor",
	rObj = {
		setText: function (TH, url, text) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			if (!(url in BUFFER.redactors))
				return;
			var red = BUFFER.redactors[url],
			textFrame = red.child(".qFileTextFrame"),
			tfBody = textFrame.contentDocument.body,
			textarea = tfBody.querySelector("textarea");
			textarea.value = text;
		},
		setFromFile: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			var red = BUFFER.redactors[url];
			UI.setLSToPlace(red.child(".backcontent"), true);
			PATH(url, UI.errors).common("getContent").wait(function (vl) {
				UI.setLSToPlace(red.child(".backcontent"), false);
				if (vl === 0)
					return 0;
				vl = vl[0];
				if (vl.type !== "ok") {
					UI.errors([vl.info]);
					return 0;
				}
				rObj.setText(TH, url, vl.content);
			}).error(console.error);
		},
		edit: function (TH, url, content) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			if (!(url in BUFFER.redactors)) {
				var red = BUFFER.redactors[url] = UI.setSrcToPlace("quickFileRedactor"),
				tfBody = red.child(".qFileTextFrame").contentDocument.body,
				textarea = W.A.createElem("textarea", {
						_CSS: {
							width: "100%",
							height: "100%",
							position: "fixed",
							top: 0,
							left: 0,
							background: "rgba(42, 33, 28, 1)",
							color: "rgb(150, 150, 150)",
							border: "none",
							outline: "none",
							resize: "none",
							"tab-size": 4,
							"white-space": "nowrap"
						}
					});
				tfBody.appendChild(textarea);
				textarea.addEventListener("keydown", function (e) {
					if (e.keyCode !== W.A._DATA.BJSListeners.keyCodes_spec.tab)
						return;
					tfBody.parentNode.parentNode.execCommand("insertText", false, "\t");
					StopEvent(e)();
				});
				red.opt("_url", url);
				if(content===undefined)
              		rObj.setFromFile(TH, url);
              	else
                  	rObj.setText(TH, url, content);
			} else {
				UI.dialogPanel({
					content: [{
							type: "message",
							text: "Do you want to reload the file? All unsaved changes will be lost!"
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
					func: function (data) {
						var pr = data.pressed;
						if (pr !== "y")
							return;
						UI.toTopFileRedactor(TH, url);
						rObj.setFromFile(TH, url);
					}
				});
				return;
			}

		},
		save: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			var red = BUFFER.redactors[url],
			textFrame = red.child(".qFileTextFrame"),
			tfBody = textFrame.contentDocument.body,
			textarea = tfBody.querySelector("textarea");
			UI.setLSToPlace(red.child(".backcontent"), true);
			PATH(url, UI.errors).common("setContent", {
				content: textarea.value
			}).wait(function (vl) {
				UI.setLSToPlace(red.child(".backcontent"), false);
				if (vl === 0)
					return 0;
				vl = vl[0];
				if (vl.type !== "ok") {
					UI.errors([vl.info]);
					return 0;
				}
			});
		},
		close: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			UI.easyCancel(TH);
			BUFFER.windows.redactors[url] && BUFFER.windows.redactors[url].close();
			delete BUFFER.redactors[url];
			delete BUFFER.windows.redactors[url];
		}
	};
	if (!W.FILE_REDACTORS_INIT)
		W.FILE_REDACTORS_INIT = {};
	W.FILE_REDACTORS_INIT[rName] = rObj;
})(window);
