A.include("js",[
  	CUR_REDACTOR_PATH+"style.js",
  	CUR_REDACTOR_PATH+"src.js"
]);
A.include("css",CUR_REDACTOR_PATH+"style.css");

(function (W) {
	var rName = "light file redactor",
	rObj = {
		setText: function (TH, url, text) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			if (!(url in W.BUFFER.redactors))
				return;
			var red = W.BUFFER.redactors[url],
			textFrame = red.child(".lFileTextFrame"),
			tfBody = textFrame.contentDocument.body,
			textarea = tfBody.querySelector("textarea");
			textarea.value = text;
		},
		setFromFile: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			var red = W.BUFFER.redactors[url];
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
			if (!(url in W.BUFFER.redactors)) {
				var red = UI.setSrcToPlace("lightFileRedactor"),
				tfBody = red.child(".lFileTextFrame").contentDocument.body,
				textarea = W.A.createElem("textarea", {
						_CSS: JS_STYLE.lightFileRedactor.textarea
					});
				W.BUFFER.redactors[url] = red;
				tfBody.appendChild(textarea);
				textarea.addEventListener("keydown", function (e) {
					if (e.keyCode !== W.A._DATA.BJSListeners.keyCodes_spec.tab)
						return;
					tfBody.parentNode.parentNode.execCommand("insertText", false, "\t");
					StopEvent(e)();
				});
				red.opt("_url", url);
				if (content === undefined)
					rObj.setFromFile(TH, url);
				else
					rObj.setText(TH, url, content);
			} else {
				if (url in BUFFER.windows.redactors)
					return rObj.windowed.edit(TH, url);
				UI.dialogPanel({
					content: [{
							type: "message",
							text: "reload file?".tr
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
		windowed: {
			setText: function (TH, url, text) {
				url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				if (!(url in W.BUFFER.redactors) || !(url in W.BUFFER.windows.redactors))
					return;
				W.BUFFER.windows.redactors[url].A(".LFEW_TextArea").val = text;
			},
			setFromFile: function (TH, url) {
				url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				if (!(url in W.BUFFER.redactors) || !(url in W.BUFFER.windows.redactors))
					return;
				var red = W.BUFFER.redactors[url],
				rW = BUFFER.windows.redactors[url];
				rW.UI.setLSToPlace("body", true);
				PATH(url, rW.UI.errors).common("getContent").wait(function (vl) {
					rW.UI.setLSToPlace("body", false);
					if (vl === 0)
						return 0;
					vl = vl[0];
					if (vl.type !== "ok") {
						rW.UI.errors([vl.info]);
						return 0;
					}
					rObj.windowed.setText(TH, url, vl.content);
				}).error(console.error);
			},
			save: function (TH, url) {
				url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				if (!(url in W.BUFFER.redactors) || !(url in W.BUFFER.windows.redactors))
					return;
				var rW = BUFFER.windows.redactors[url];
				rW.UI.setLSToPlace("body", true);
				PATH(url, UI.errors).common("setContent", {
					content: rW.A(".LFEW_TextArea").val()
				}).wait(function (vl) {
					rW.UI.setLSToPlace("body", false);
					if (vl === 0)
						return 0;
					vl = vl[0];
					if (vl.type !== "ok") {
						UI.errors([vl.info]);
						return 0;
					}
				});
			},
			attention: function (TH, url) {
				url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				if (!(url in BUFFER.redactors) || !(url in BUFFER.windows.redactors))
					return;
				var rW = BUFFER.windows.redactors[url],
				hold = false,
				tmpStr = ["****", rW.A(".LFEW_Title").html()],
				hfun = function () {
					hold = true;
					rW.A.not("mousemove", hfun);
					rW.A.not("mousedown", hfun);
					rW.A(".LFEW_Title").html = tmpStr[1];
				},
				i = 1;

				rW.A.on("mousemove", hfun);
				rW.A.on("mousedown", hfun);
				W.blur();
				rW.focus();

				(function interval() {
					if (hold)
						return (rW.A(".LFEW_Title").html = tmpStr[1]);
					i = i < 1 ? 1 : 0;
					rW.A(".LFEW_Title").html = tmpStr[i];
					setTimeout(interval, 600);
				})();

			},
			edit: function (TH, url, content) {
				url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				var fromRedactor = false;
				if (url in BUFFER.redactors) {
					if (url in BUFFER.windows.redactors) {
						rObj.windowed.attention(TH, url);
						BUFFER.windows.redactors[url].UI.dialogPanel({
							content: [{
									type: "message",
									text: "reload file?".tr
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
							func:function (data) {
								var pr = data.pressed;
								if (pr !== "y")
									return;
								rObj.windowed.setFromFile(TH, url);
							}
						});
						return;
					} else {
						content = BUFFER.redactors[url].child(".lFileTextFrame").contentDocument.body.querySelector("textarea").value;
						fromRedactor = true;
					}
				}
				var rW = W.open("about:blank");
				if (!rW)
					return UI.errors(["no pop-up"]);
				
				fromRedactor && BUFFER.redactors[url].remElem();
				delete BUFFER.redactors[url];

				rW.thisUrl = url;
				rW.rObj = rObj;
				rW.document.open("about:blank").write(W.JS_SRC.lightFileRedactorWindowed);
				rW.document.close();
				var red = rW.document.body;
				
				if(BUFFER.windows.redactors[url]&&BUFFER.windows.redactors[url]!==rW)
					return rW.close();
				rW.window.addEventListener("unload", function(e){
					!rW.allowRClose&&rObj.close(false, url);	
				});
				BUFFER.windows.redactors[url] = rW;
				BUFFER.redactors[url]=red;		
				
				(function interval() {
					if (!rW.opened)
						return setTimeout(interval, 1);
					if (content === undefined)
						rObj.windowed.setFromFile(TH, url);
					else
						rObj.windowed.setText(TH, url, content);
					rW.A(".LFEW_Title").html = PATH(url).name;
				})();
			},
			unwindowed:function(TH,url){
				url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				if (!(url in BUFFER.redactors) || !(url in BUFFER.windows.redactors))
					return;
				var rW = BUFFER.windows.redactors[url];
				
				rW.allowRClose=true;
				
				rObj.close(false,url);
				rObj.edit(false,url,rW.A(".LFEW_TextArea").val());
			}
		},
		save: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			var red = BUFFER.redactors[url],
			textFrame = red.child(".lFileTextFrame"),
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
			TH && UI.easyCancel(TH);
			W.BUFFER.windows.redactors[url] && (W.BUFFER.windows.redactors[url].allowUnload=true, W.BUFFER.windows.redactors[url].close());
			delete W.BUFFER.redactors[url];
			delete W.BUFFER.windows.redactors[url];
		}
	};
	W.FILE_REDACTOR = rObj;
})(window);
