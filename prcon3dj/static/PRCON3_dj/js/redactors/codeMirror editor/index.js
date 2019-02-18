(function (W) {
	var rName = "codeMirror redactor";
	W.TEMP_SETTINGS_DECLARE.push({
		type: "select",
		options: [
			"isotope",
			"bespin"
		],
		group: "highlightning code > other",
		compareBy: "value",
		realtime: false,
		info: "select theme of editor".tr,
		param: {
			name: "HCODE_T",
			def: "bespin",
			iteration: false
		}
	}, {
		type: "checkbox",
		group: "highlightning code > other",
		chctext: "folding",
		realtime: false,
		info: "enable code folding".tr,
		param: {
			name: "HCODE_F",
			def: true,
			iteration: false
		}
	}, {
		type: "checkbox",
		group: "highlightning code > other",
		chctext: "auto-close brackets",
		realtime: false,
		info: "enable auto-close brackets ( {} ()\ \"\" '' )".tr,
		param: {
			name: "HCODE_A_brackets",
			def: true,
			iteration: false
		}
	}, {
		type: "checkbox",
		group: "highlightning code > other",
		chctext: "auto-close tags",
		realtime: false,
		info: "enable auto-close HTML tags".tr,
		param: {
			name: "HCODE_A_tags",
			def: true,
			iteration: false
		}
	}, {
		type: "checkbox",
		group: "highlightning code > other",
		chctext: "match brackes",
		realtime: false,
		info: "enable pair brackets highlighting".tr,
		param: {
			name: "HCODE_M_brackets",
			def: true,
			iteration: false
		}
	}, {
		type: "checkbox",
		group: "highlightning code > other",
		chctext: "match tags",
		realtime: false,
		info: "enable pair HTML tags highlighting".tr,
		param: {
			name: "HCODE_M_tags",
			def: true,
			iteration: false
		}
	}, {
		type: "checkbox",
		chctext: "SASS",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_H_SASS",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "coffeescript",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_H_coffeescript",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "PHP",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_H_PHP",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "markdown",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_H_markdown",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "python",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_H_python",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "CSS",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "need for".tr + " PHP",
		param: {
			name: "HCODE_H_CSS",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "C like languages",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "need for".tr + " PHP",
		param: {
			name: "HCODE_H_Clike",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "javascript",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "need for".tr + " PHP, JSON",
		param: {
			name: "HCODE_H_javascript",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "HTML",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "need for".tr + " PHP",
		param: {
			name: "HCODE_H_HTML",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "XML",
		group: "highlightning code > highlight languages".tr,
		realtime: false,
		info: "need for".tr + " PHP, HTML",
		param: {
			name: "HCODE_H_XML",
			def: true
		}
	}, {
		type: "select",
		options: [
			"PHP",
			"PHP + JS",
			"PHP + HTML",
			"PHP + CSS",
			"PHP + JS + CSS + HTML"
		],
		group: "highlightning code > lint languages",
		compareBy: "value",
		realtime: false,
		info: "select PHP linting mode (what languages will be analyzed when working with PHP)".tr,
		param: {
			name: "HCODE_L_PHPMode",
			def: "PHP",
			iteration: false
		}
	}, {
		type: "select",
		options: [
			"HTML",
			"HTML + JS",
			"HTML + CSS",
			"HTML + JS + CSS"
		],
		group: "highlightning code > lint languages",
		compareBy: "value",
		realtime: false,
		info: "select HTML linting mode (what languages will be analyzed when working with HTML)".tr,
		param: {
			name: "HCODE_L_HTMLMode",
			def: "HTML",
			iteration: false
		}
	}, {
		type: "checkbox",
		chctext: "JSON",
		group: "highlightning code > lint languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_L_JSON",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "javascript",
		group: "highlightning code > lint languages".tr,
		realtime: false,
		info: "need for".tr + " PHP + JS, HTML + JS",
		param: {
			name: "HCODE_L_javascript",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "coffeescript",
		group: "highlightning code > lint languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_L_coffeescript",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "CSS",
		group: "highlightning code > lint languages".tr,
		realtime: false,
		info: "need for".tr + " PHP + CSS, HTML + CSS",
		param: {
			name: "HCODE_L_CSS",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "HTML",
		group: "highlightning code > lint languages".tr,
		realtime: false,
		info: "need for".tr + " PHP + HTML",
		param: {
			name: "HCODE_L_HTML",
			def: true
		}
	}, {
		type: "checkbox",
		chctext: "PHP",
		group: "highlightning code > lint languages".tr,
		realtime: false,
		info: "",
		param: {
			name: "HCODE_L_PHP",
			def: true
		}
	});
	W.E_SETTINGS();
	A.include("js", [
			CUR_REDACTOR_PATH + "src.js",
			CUR_REDACTOR_PATH + "codeMirror_init.js"
		]);
	A.include("css", CUR_REDACTOR_PATH + "style.css");
	var rObj = {
		setText: function (TH, url, text) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			if (!(url in W.BUFFER.redactors))
				return;
			var red = W.BUFFER.redactors[url];
			red.setValue(text);
			red.clearHistory();
		},
		setFromFile: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			var red = W.BUFFER.redactors[url];
			UI.setLSToPlace(red.getWrapperElement().parentNode, true);
			PATH(url, UI.errors).common("getContent").wait(function (vl) {
				UI.setLSToPlace(red.getWrapperElement().parentNode, false);
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
			var options = cmOption(PATH(url).divNameExt()[1] || "");

			if (!(url in W.BUFFER.redactors)) {
				var onplace = UI.setSrcToPlace("CodeMirrorFileRedactor"),
				red = CodeMirror(onplace.child(".backcontent"), options);
				red.a=function(){return red.getWrapperElement();};
				W.BUFFER.redactors[url] = red;
				onplace.opt("_url", url);
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
				W.BUFFER.windows.redactors[url].CMObj.setValue(text);
            },
			setFromFile: function (TH, url) {
              	url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				if (!(url in W.BUFFER.redactors) || !(url in W.BUFFER.windows.redactors))
					return;
				var rW = BUFFER.windows.redactors[url];
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
					content: rW.CMObj.getValue()
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
				tmpStr = ["****", rW.A(".CMFEW_Title").html()],
				hfun = function () {
					hold = true;
					rW.A.not("mousemove", hfun);
					rW.A.not("mousedown", hfun);
					rW.A(".CMFEW_Title").html = tmpStr[1];
				},
				i = 1;

				rW.A.on("mousemove", hfun);
				rW.A.on("mousedown", hfun);
				W.blur();
				rW.focus();

				(function interval() {
					if (hold)
						return (rW.A(".CMFEW_Title").html = tmpStr[1]);
					i = i < 1 ? 1 : 0;
					rW.A(".CMFEW_Title").html = tmpStr[i];
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
							func: function (data) {
								var pr = data.pressed;
								if (pr !== "y")
									return;
								rObj.windowed.setFromFile(TH, url);
							}
						});
						return;
					} else {
						content = BUFFER.redactors[url].getValue();
						fromRedactor = true;
					}
				}
				var rW = W.open(CUR_REDACTOR_PATH+"index.html"),
					bu = function(){rObj.close(false, url);};
				if (!rW)
					return UI.errors(["no pop-up"]);

				fromRedactor && UI.easyCancel(BUFFER.redactors[url].getWrapperElement().parentNode);
				delete BUFFER.redactors[url];

				rW.thisUrl = url;
              	rW.thisExt = PATH(url).divNameExt()[1] || "";
				rW.rObj = rObj;
				
				if (BUFFER.windows.redactors[url] && BUFFER.windows.redactors[url] !== rW)
					return rW.close();
				rW.addEventListener("beforeunload",bu);
				BUFFER.windows.redactors[url] = rW;
				BUFFER.redactors[url] = rW;

				(function interval() {
					if (!rW.opened)
						return setTimeout(interval, 1);
					rW.removeEventListener("beforeunload",bu);
					rW.addEventListener("unload", function(e){
						!rW.notAllowClose&&rObj.close(false, url);	
					});
					if (content === undefined)
						rObj.windowed.setFromFile(TH, url);
					else
						rObj.windowed.setText(TH, url, content);
					rW.A(".CMFEW_Title").html = PATH(url).name;
				})();
			},
			unwindowed: function (TH, url) {
              	url = PATH(url || TH.attrFromPath("_url")).fixUrl();
				if (!(url in BUFFER.redactors) || !(url in BUFFER.windows.redactors))
					return;
				var rW = BUFFER.windows.redactors[url];
				rW.notAllowClose=true;
				rObj.close(false, url);
				rObj.edit(false, url, rW.CMObj.getValue());
            }
		},
		save: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			var red = BUFFER.redactors[url];
			UI.setLSToPlace(red.getWrapperElement().parentNode, true);
			PATH(url, UI.errors).common("setContent", {
				content: red.getValue()
			}).wait(function (vl) {
				UI.setLSToPlace(red.getWrapperElement().parentNode, false);
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
			BUFFER.windows.redactors[url] && (BUFFER.windows.redactors[url].allowUnload = true, BUFFER.windows.redactors[url].close());
			delete W.BUFFER.redactors[url];
			delete W.BUFFER.windows.redactors[url];
		}
	};
	W.FILE_REDACTOR = rObj;
})(window);
