A({
	resizer: function get() {
		var a = this.a(),
		h = a.hasClass("h"),
		cpos,
		parent = a.parentNode,
		before = parent.child("[res=before]", !1, !0),
		after = parent.child("[res=after]", !1, !0),
		start,
		dest,
		preventer = function (e) {
			e.preventDefault(),
			e.stopPropagation(),
			event.stopImmediatePropagation();
		},
		getDest = function () {
			dest = {
				before: h ?
				before.css("height") / parent.css("height") * 100
				 :
				before.css("width") / parent.css("width") * 100,
				after: h ?
				after.css("height") / parent.css("height") * 100
				 :
				after.css("width") / parent.css("width") * 100
			}
		},
		resFunc = function (e) {
			requestAnimationFrame(function () {
				if (h)
					before.css({
						height: "calc(" + dest.before + "% + " + (e.Y - start.Y) + "px)"
					}),
					after.css({
						height: "calc(" + dest.after + "% - " + (e.Y - start.Y) + "px)"
					});
				else
					before.css({
						width: "calc(" + dest.before + "% + " + (e.X - start.X) + "px)"
					}),
					after.css({
						width: "calc(" + dest.after + "% - " + (e.X - start.X) + "px)"
					});
			});
			e.stopEvent();
		};
		a.on("mousedown", function (e) {
			getDest(),
			start = e,
			"html".addClass = "NOSELECT",
			document.on("mousemove", resFunc),
			window.addEventListener("scroll", preventer),
			window.addEventListener("wheel", preventer),
			window.addEventListener("dragstart", preventer);
		});
		window.A.on("mouseup", function () {
			window.removeEventListener("scroll", preventer),
			window.removeEventListener("wheel", preventer),
			window.removeEventListener("dragstart", preventer);
			document.not("mousemove", resFunc),
			"html".remClass("NOSELECT");
		});
	},
	selects: function (parentSelector, selectedClass) {
		var a = this.a(),
		down = false,
		cooChange = false,
		coo = {},
		elems = [],
		tmp,
		tmp2,
		shift = false,
		selector,
		fin = -1,
		selecting = false,
		fill = function (e) {
			selector = "body".addElem("div", {
					class: "selector"
				});
			coo.start = [e.X, e.Y + a.scrollTop, e.Y],
			coo.x = [],
			coo.y = [],
			coo.a = a.getBoundingClientRect(),
			shift = A._DATA.BJSListeners.keyLis.pressed.indexOf(16) > -1,
			selecting = !!".rightexplorer>f-scrollplane.selecting".a(),
			a.child(selectedClass, !0, !0).all(function (el, ind) {
				elems.push([el, el.hasClass("selected")]),
				tmp = el.getBoundingClientRect(),
				coo.x.push(tmp.x),
				coo.y.push(tmp.y + a.scrollTop),
				coo.h = tmp.height,
				coo.w = tmp.width;
			});
		},
		fnForHasElem = function (el) {
			if (el[2])
				return;
			el[2] = true;
			if (!el[1] || !shift)
				tmp2.addClass("selected");
			else
				tmp2.remClass("selected");
		},
		fnForNotHasElem = function (el) {
			if (el[2] === false)
				return;
			el[2] = false;
			if (shift)
				if (el[1])
					tmp2.addClass("selected");
				else
					tmp2.remClass("selected");
			else
				!selecting && el.remClass("selected");
		},
		fnForAll = function (el, ind) {
			tmp2 = el[0];
			if ((tmp[2] + tmp[0]) > coo.x[ind] &&
				(tmp[3] + tmp[1]) > coo.y[ind] &&
				(coo.x[ind] + coo.w) > tmp[2] &&
				(coo.y[ind] + coo.h) > tmp[3])
				fnForHasElem(el);
			else
				fnForNotHasElem(el);
		},
		setTmp = function (e) {
			tmp = [e.X - coo.start[0], e.Y + a.scrollTop - coo.start[1], coo.start[0], coo.start[1], coo.start[2]],
			tmp[0] < 0 && (tmp[2] -= (tmp[0] = -tmp[0])),
			tmp[1] < 0 && (tmp[3] -= (tmp[1] = -tmp[1]), tmp[4] -= tmp[1]),
			selector.css({
				width: tmp[0] + "px",
				height: tmp[1] + "px",
				left: tmp[2] + "px",
				top: tmp[4] + "px"
			});
		},
		fnForMove = function (e) {
			if (!down)
				return;
			if (!cooChange)
				cooChange = true,
				fill(e);
			setTmp(e);
			elems.all(fnForAll);
		},
		clearFn = function () {
			if (!down)
				return;
			down = false,
			cooChange = false,
			coo = {},
			elems = [],
			selector && selector.remElem(),
			selector = false;
		};
		a.on("mousedown", function (e) {
			down = true;

		}, true);
		a.on("select", function (e) {
			StopEvent(e)();
		});
		window.A.on("mousemove", fnForMove, true);
		window.A.on("mouseup", clearFn);
		window.A.on("contextmenu", clearFn);
		window.A.on("click", function (e) {
			var r = false,
			ctx = ".contextmenu".a();
			ctx && e.path.all(function (el) {
				if (r = el === ctx)
					return "break";
			}, "break");
			if (r)
				return;
			(parentSelector + ":not(.selecting)>" + selectedClass).all(function (el) {
				el.remClass("selected");
			});
		});
	},
	addFromText: function (txt, pos) {
		var a = this.a(),
		el = document.createElement('div');
		el.innerHTML = txt;
		el.children.all(function (elem) {
			elem.paste({
				in: a,
				pos: pos
			});
		});
		return a;
	},
	br: function get() {
		var a = this.a();
		a.parentNode.addElem({
			elem: "br",
			pos: a
		});
		return a;
	}
});

/*FUNCS ACTIVATION*/
".middle.h".resizer;
".middle.w".resizer;
(function () {
	var blh = ".rightmenu .blackbtn:not(.rightshower)".a(!0);
	blh = (blh[0].css("height") + blh[0].css("margin-top")) * blh.length;
	".rightmenu".on("resize", function (w) {
		if (w.height < blh) {
			".rightmenu".opt({
				rmhide: "."
			});
		} else {
			".rightmenu".opt({
				rmhide: "",
				show: ""
			});
		}
	});
})();

(function () {
	".pathRow>input".on("combination", "enter", function (e) {
		UI.openDir("", e.toElement.val());
	}, false);
	window.A.on("combination", "esc", function (e) {
		".dialog[toplayer]".all(function (el) {
			UI.closeDialog(el.opt("uid"));
		});
	}, false);
  	window.A.on("combination","ctrl+shift+f",function(e){
      	UI.createFile(document,BUFFER.explorer.curDir);
    },false);
  	window.A.on("combination","ctrl+shift+d",function(e){
      	UI.createDir(document,BUFFER.explorer.curDir);
    },false);
  	window.A.on("combination","ctrl+shift+r",function(e){
      	UI.openDir(document,BUFFER.explorer.curDir,"stay");
    },false);
  	window.A.on("combination","ctrl+shift+o",function(e){
      	UI.dialogPanel({
          	content:[
              	{
                  	type:"message",
                	text:"enter path:"
                },
              	{
                  	type:"input",
                  	inpID:"path",
                  	opt:{
                      	value:"@ROOT:/"
                    }
                },
              	{
                  	type:"button",
                  	btntext:"open",
                  	btnID:"open"
                },
              	{
                  	type:"button",
                  	btntext:"cancel",
                  	btnID:"cancel"
                }
            ],
          	func:function(data){
              	if(data.pressed!=="open")
                  	return;
              	if(data.values.path=="")
                  	return UI.errors(["no name"]);
              	UI.openDir(document,data.values.path,PATH(data.values.path).fixUrl()===PATH(BUFFER.explorer.curDir).fixUrl()?"stay":"");
            }
        });
    },false);
})();

".rightexplorer>f-scrollplane".selects(".rightexplorer>f-scrollplane", ".dirPlace");
/*END*/

/*INTERACTIVE STATE*/
(function () {
	var RAF = window.requestAnimationFrame,
	CAF = window.cancelAnimationFrame,
	curRAF,
	elem,
	alw = true,
	delstat = function (s) {
		curRAF = RAF(function () {
				("[" + s + "]").all(function (l) {
					l.opt(s, "");
				});
			});
	},
	wElem = function (e, tmp) {
		RAF(function () {
			if (elem === e.toElement || !alw)
				return;
			elem = e.toElement;
			e.path.all(function (el, ind) {
				if (ind === 0)
					"[hover]".all(function (elem) {
						if (e.path.indexOf(elem) < 0)
							elem.opt("hover", "");
					});
				el !== window && el !== document && el.opt("hover", ".");
			});
		});
	};
	A.on("mousemove", wElem, true),
	document.addEventListener("mouseleave", function (e) {
		delstat("hover"),
		elem = alw = false;
	}),
	document.addEventListener("mouseenter", function (e) {
		alw = true;
	}),

	A.on("touchend", function () {
		delstat("hover"),
		delstat("taped");
		elem = false;
	}, true),
	A.on("mousedown", function (e) {
		RAF(function () {
			e.path.all(function (el) {
				el !== window && el !== document && el.opt({
					hover: ".",
					taped: "."
				});
			});
		});
	}),
	A.on("mouseup", function () {
		delstat("taped");
		elem = false;
	}),
	A.on("mouseup", function (e) {
		RAF(function () {
			e.path.all(function (el) {
				el !== window && el !== document && el.opt({
					hover: "."
				});
			});
		});
	}, true);
})();
/*END*/
var UI = {
	toTopLayer: function (elem) {
		elem.parentNode.children.all(function (th) {
			th.opt("topLayer", "");
		});
		elem.opt("topLayer", ".");
	},
	getAct: function (act) {
		var el = (".sources>" + "[act=" + act + "]"),
		txt = el.html(),
		_ = {};
		return Preprocess({
			js: function (t) {
				return Function("selfAct,_", t + " ;")(el, _);
			},
			set: function (t) {
				return Function("selfAct,_", "return " + t + ";")(el, _);
			}
		}, {
			commandStart: "@",
			bodyStart: "::",
			end: "::@"
		}, txt);
	},
	setSrcToPlace: function (act, demult) {
		var src = "[act=" + act + "]",
		req = false;
		(demult ? (".srcplace>" + src).a(!0).length < 1 : true) ?
		UI.toTopLayer(req = ".srcplace".addElem("div", {
					act: act,
					class: "back",
					_TXT: UI.getAct(act)
				})) : UI.toTopLayer((".srcplace>" + src).a());
		return req;
	},
	setLSToPlace: function (elem, set) {
		var req = false;
		elem = elem.child(".lsplace", !1, !0) || elem.addElem("div", {
				class: "lsplace"
			});
		set ?
		elem.child(".loadscreen", !0).length < 1 && (
			req = true,
			elem.addElem("div", {
				class: "loadscreen",
				_TXT: UI.getAct("loadscreen")
			}))
		 : elem.html("");
		return req;
	},
	closeDialog: function (uid) {
		(uid = ".dialog[uid=" + uid + "]",
			uid = [
				uid,
				uid.previousElement
			], uid[0]).remElem();
		if (!".dialogback".a().children.length)
			".dialogback".opt({
				hidden: "."
			});
		else
			UI.toTopLayer(uid[1]);
	},
	dialogPanel: function (param) {
		var s = A.args({
				content: [{
						type: "message",
						text: "Warning!!!"
					}, {
						type: "button",
						btntext: "ok",
						btnID: "ok"
					}, {
						type: "button",
						btntext: "cancel",
						btnID: "cancel"
					}
				],
				func: function () {}
			}, param),
		dialog = ".dialogback".addElem("div", {
				class: "dialog",
				uid: UID.get(),
				_TXT: "<f-scrollplane></f-scrollplane><f-scroll-y no='.'><f-wheel></f-wheel></f-scroll-y><div class='downmenu'></div>"
			}),
		bc,
        inpcount=0,
		fn = function (e) {
			var data = {
				pressed: e.toElement.opt("bid"),
				values: {},
				checked: {}
			}
			dialog.child("f-scrollplane>input", !0).all(function (el) {
				data.values[el.opt("iid")] = el.val();
			});
			dialog.child("f-scrollplane>.chbstyle>input", !0).all(function (el) {
				data.checked[el.opt("cid")] = el.checked;
			});
			UI.closeDialog(dialog.opt("uid"));
			s.func(data);
		};

		UI.toTopLayer(dialog);
		".dialogback".opt({
			hidden: ""
		});

		bc = dialog.child("f-scrollplane");
		s.content.all(function (el,ind) {
			switch (el.type) {
			case "message":
				bc.addElem("div", {
					class: "message",
					_TXT: el.text
				});
				break;
			case "button":
				"[act=dialogInputSrc]>button".copy({
					pasteIn: dialog.child(".downmenu")
				}).opt({
					bid: el.btnID,
					_TXT: el.btntext,
					_LIS: [{
							click: fn
						}
					]
				}).opt(el.opt || {});
				break;
			case "input":
				"[act=dialogInputSrc]>input".copy({
					pasteIn: bc
				}).opt({
					iid: el.inpID
				}).opt(el.opt || {})[inpcount<1?(inpcount++,"focus"):"a"]();
				break;
			case "checkbox":
				"[act=dialogInputSrc]>.chbstyle".copy({
					pasteIn: bc,
					deep: true
				}).br.child("input").opt({
					cid: el.chcID
				}).opt(el.opt || {}).parentNode.child("text").html = el.chctext;
				break;
			}
		});
	},
	errors: function (errors, next) {
		(next = function () {
			if (!errors.length)
				return;
			var er = errors.splice(0, 1)[0],
			up = function (msg) {
				UI.dialogPanel({
					content: [{
							type: "message",
							text: msg
						}, {
							type: "button",
							btnID: "ok",
							btntext: "ok"
						}
					],
					func: function () {
						next();
					}
				});
			};
			switch (er) {
			case "no password":
			case "wrong password":
				up("Password is missing or incorrect. <br> Enter another password.");
				break;
			case "net err":
				up("Network connection error. <br> Check your network connection");
				break;
			case "no ftp login":
				up("Ftp login is missig.");
				break;
			case "ftp con err":
				up("Ftp connection error.");
				break;
			case "ftp login err":
				up("Error connecting to ftp account.");
				break;
			case "not main":
				up("Invalid server client address.");
				break;
			case "logged":
				up("you are already logged in");
				break;
			case "no acc":
				up("account not found in storage");
				break;
			case "wrong path":
				up("path is not exists or not available");
				break;
          	case "no name":
                up("you did not enter the name of the object being created");
                break;
            case "already exists":
                up("this object already exists in the destination folder");
                break;
            }
		})();
	},
	closeAll: function () {
		A.toArray(BUFFER.windows.viewInReload).all(function (w) {
			w.close();
		});
		A.toArray(BUFFER.windows.redactors).all(function (w) {
			w.close();
		});
		".srcplace".html = "";
		BUFFERToLocal();
		BUFFER = new N_BUFFER();
		localToBUFFER();
	},
	/*ALL ACTIONS*/

	openLogin: function () {
		UI.setSrcToPlace("login", true),
		".back[act=loginLocal]".errored().remElem(),
		".back[act=loginFtp]".errored().remElem();
	},
	openLoginFtp: function () {
		UI.setSrcToPlace("loginFtp", true),
		".back[act=loginLocal]".errored().remElem(),
		".back[act=login]".errored().remElem();
	},
	openLoginLocal: function () {
		var back = UI.setSrcToPlace("loginLocal", true);
		".back[act=login]".errored().remElem(),
		".back[act=loginFtp]".errored().remElem(),
		BUFFER.localData.accounts.name.all(function (nm, i) {
			back.child(".backcontent").addElem("button", {
				title: BUFFER.localData.accounts.ftp[i] ?
				"PHP: " + BUFFER.localData.accounts.urlPhp[i] +
				"\nFTP url: " + BUFFER.localData.accounts.urlFtp[i] +
				"\nFTP login: " + BUFFER.localData.accounts.login[i]
				 :
				BUFFER.localData.accounts.login[i],
				funcs: "sendLoginLocal",
				class: "cls",
				_TXT: nm
			});
		});
	},
	openSettings: function () {
		var bc = UI.setSrcToPlace("settings", true).child(".backcontent>f-scrollplane"),
		dom = [],
		tmp = {};
		SETTINGS_DECLARE.all(function (dec) {
			if (!tmp[dec.group])
				tmp[dec.group] = [];
			tmp[dec.group].push(dec);
		});
		for (var g in tmp) {
			var bdiv = {
				div: {
					class: "group",
					group: g,
					_DOM: [{
							div: {
								class: "groupname center",
								_TXT: g
							}
						}
					]
				}
			}
			tmp[g].all(function (dec) {
				var tmpdom = {
					div: {
						title: !dec.realtime ? "need to reload" : "",
						class: "blackbtn sett_cont",
						_DOM: [{
								div: {
									class: "sett_info",
									_TXT: dec.info + (!dec.realtime ? "<br><text class='ntr'>[&#8635;]</text>" : "")
								}
							}
						]
					}
				},
				buffSett = dec.param ? objWalk(BUFFER.localData.settings, dec.param.iteration ? ["I"] : []) : {};
				switch (dec.type) {
				case "checkbox":
					tmpdom.div._DOM.unshift("[act=dialogInputSrc] .chbstyle".copy(true)
						.child("input").opt({
							checked: buffSett[dec.param.name] ? "." : "",
							_LIS: [{
									change: function (e) {
										buffSett[dec.param.name] = A.eGetElem(e).checked;
										if (dec.realtime)
											applySettings();
									}
								}
							],
							funcs: dec.funcs ? dec.funcs : ""
						}).parentNode
						.child("text").html(dec.chctext).parentNode);
					break;
				case "button":
					tmpdom.div._DOM.unshift({
						button: {
							class: "blackbtn cls",
							_TXT: dec.btntext,
							funcs: dec.funcs ? dec.funcs : ""
						}
					});
					break;
				case "input":
					tmpdom.div._DOM.unshift({
						input: {
							class: "inputstyle cls",
							placeholder: dec.inptext,
							_VAL: buffSett[dec.param.name] || "",
							type: dec.inptype || "text",
							_LIS: [{
									change: function (e) {
										buffSett[dec.param.name] = A.eGetElem(e).val();
										if (dec.realtime)
											applySettings();
									}
								}
							],
							funcs: dec.funcs ? dec.funcs : ""
						}
					});
					break;
				}
				bdiv.div._DOM.push(tmpdom);
			});
			dom.push(bdiv);
		}
		bc.DOMTree(dom);
	},
	resetSettings: function () {
		BUFFER.localData.settings = new N_SETTINGS();
		BUFFERToLocal();
		applySettings();
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "Do you want to reload page?"
				}, {
					type: "button",
					btnID: "ok",
					btntext: "yes"
				}, {
					type: "button",
					btnID: "n",
					btntext: "no"
				}
			],
			func: function (req) {
				if (req.pressed === "ok") {
					window.location.reload();
				}
			}
		});
	},
	easyCancel: function (TH) {
		TH.parent(function (el) {
			return el.hasClass("back");
		}).remElem();

	},
	showResizeButton: function () {
		".middlebtn.hide".a() ? ".middlebtn".all(function (el) {
			el.remClass("hide");
		}) : ".middlebtn".all(function (el) {
			el.addClass("hide");
		});
	},
	toggleRightMenu: function () {
		".rightmenu[show]".a() ? ".rightmenu".opt({
			show: ""
		}) : ".rightmenu".opt({
			show: "."
		});
	},
	generateTree: function (TH, url) {
		return A.start(function (rW) {
			var path = PATH(url).arrUrl(),
			tempPath = "",
			tempObj,
			curElem = "",
			TTO = BUFFER.explorer.tree,
			load = A.start(),
			gen = function (und, w) {
				curElem = path.shift();
				if (curElem === undefined) {
					rW.value = 1;
					return;
				}
				if (!TTO.hasOwnProperty(curElem) || !TTO[curElem].opened) {
					PATH(tempPath + curElem, UI.errors).common("getList").wait(function (d) {
						if (d === 0) {
							rW.value = 0;
							return;
						}
                      	d=d[0];
						tempObj = {};
						d.all(function (r) {
							tempObj[r.name] = {
								type: r.type,
								list: {},
								opened: false,
								parent: curElem,
								url: r.url
							};
						});
						TTO[curElem] = {
							type: "dir",
							list: tempObj,
							opened: true,
							parent: null,
							url: tempPath + curElem
						};
						tempPath += curElem + "/";
						TTO = TTO[curElem].list;
						load = load.wait(gen, true);
						w.value = 1;
					});
				} else {
					tempPath += curElem + "/";
					TTO = TTO[curElem].list;
					load = load.wait(gen, true);
					w.value = 1;
				}
			};
			load.wait(gen, true);
		}, true);
	},
	parseTree: function (TH, url, offset) {
		var down = typeof url === "undefined" ? BUFFER.explorer.tree : objWalk(BUFFER.explorer.tree, PATH(url).arrUrl(), ["list"]);
		function parse(tree) {
			var dom = [];
			tree = tree || down;
			for (var nm in tree) {
				if (nm === "." || nm === "..")
					continue;
				var inEl = [{
						div: {
							class: "typeimg",
							_TXT: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64" width="64" height="64"><use xlink:href="#SVG' + tree[nm].type + 'Icon" x="0" y="0"/></svg><div></div>'
						}
					}, {
						div: {
							class: "rowtext txtnowrap",
							funcs: tree[nm].type === "dir" ? "openDir" : "openFile",
							_TXT: nm
						}
					}
				];
				tree[nm].type === "dir" ? inEl.unshift({
					div: {
						class: "dirarr showarrow",
						funcs: "reloadTree",
						_TXT: "&#9013;"
					}
				}) : inEl.unshift({
					div: {
						class: "dirarr buffer NOSELECT",
						_TXT: "&#9013;"
					}
				});
				dom.push({
					div: {
						class: "tree cls " + tree[nm].type,
						_url: tree[nm].url,
						opened: tree[nm].opened,
						contextfuncs: "dirFileMenu",
						bubblecontext: ".",
						_DOM: inEl
					}
				});
				if (tree[nm].opened)
					dom.push({
						div: {
							class: "tree offset",
							url: tree[nm].url,
							_DOM: parse(tree[nm].list)
						}
					})
			}
			return dom;
		};
		(offset || ".leftexplorer>f-scrollplane").html = "";
		(offset || ".leftexplorer>f-scrollplane").DOMTree(parse());
	},
	reloadTree: function (TH, url, offset) {
		return (BUFFER.loadprocess.reloadTree = BUFFER.loadprocess.reloadTree.wait(function (non, rW) {
					url = url || TH.attrFromPath("_url");
					var thP = TH.errored().parent(),
					opened = thP.errored().opt("opened");

					if (opened === "true") {
						var tmp = objWalk(BUFFER.explorer.tree, PATH(url).arrUrl(), ["list"], true);
						tmp.list = {};
						tmp.opened = false;
						thP.nextSibling.remElem();
						thP.opt("opened", "false");
						rW.value = 1;
						return;
					}
					if (opened === "false")
						offset = offset || thP.parentNode.addElem({
								elem: "div",
								pos: thP.nextSibling
							}, {
								class: "tree offset",
								url: url
							});
					UI.setLSToPlace(".leftexplorer", true);
					UI.generateTree(TH, url).wait(function (d) {
						UI.setLSToPlace(".leftexplorer", false);
						rW.value = 1;
						if (d !== 1)
							return;
						UI.parseTree(TH, url, offset);
						thP.errored().opt("opened", "true");
					});
				}, true));
	},
	openDir: function (TH, url, type) {
		return (BUFFER.loadprocess.openDir = BUFFER.loadprocess.openDir.wait(function (non, rW) {
					var RE = ".rightexplorer>f-scrollplane";
					url = PATH(url || (TH ? TH.attrFromPath("_url") : false) || BUFFER.explorer.curDir).fixUrl();
					UI.setLSToPlace(".rightexplorer", true);
					var path = PATH(url, UI.errors);
					path.common("getList").wait(function (d) {
						UI.setLSToPlace(".rightexplorer", false);
						if (d === 0) {
							UI.setPathRow(BUFFER.explorer.curDir);
							rW.value = 0;
							return;
						}
						
                      	d=d[0];
                      
						if (type === "back")
							UI.addBack(BUFFER.explorer.curDir);
						else if (type === "forward")
							UI.addForward(BUFFER.explorer.curDir);
						else if (type !== "stay")
							UI.addBack(BUFFER.explorer.curDir),
							BUFFER.explorer.forward = [];

						BUFFER.explorer.curDir = UI.setPathRow(url);
						RE.html = "";
						d.all(function (r) {
							if (r.name === "." || r.name === "..")
								return "continue";
							RE.addElem("div", {
								class: "dirPlace",
								_url: r.url,
								funcs: "selectIfSelecting," + (r.type === "dir" ? "openDir" : "openFile"),
								contextfuncs: "dirFileMenu",
								bubblecontext: "."
							}).DOMTree([{
										div: {
											class: "typeimg",
											_TXT: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64" width="64" height="64"><use xlink:href="#SVG' + r.type + 'Icon" x="14.0625%" y="0"/></svg><div></div>'
										}
									}, {
										div: {
											class: "rowtext txtnowrap",
											_TXT: r.name
										}
									}, {
										div: {
											class: "closer"
										}
									}
								]);
						}, "break", "continue");
                      	RE.opt("_url",url);
						rW.value = 1;
					});
				}, true));
	},
	selectIfSelecting: function (TH) {
		if (".rightexplorer>f-scrollplane.selecting".a()) {
			TH.toggle("selected", "");
			return "break";
		}
	},
	toggleDirSelecting: function () {
		".rightexplorer>f-scrollplane".toggle("selecting", "") === 2 && UI.clearDirSelecting();
	},
	clearDirSelecting: function () {
		".rightexplorer>f-scrollplane .selected".all(function (el) {
			el.remClass("selected");
		});
	},
	setPathRow: function (url) {
		".pathRow>input".val = url;
		return url;
	},
	addBack: function (url) {
		BUFFER.explorer.back.unshift(url);
		return url;
	},
	addForward: function (url) {
		BUFFER.explorer.forward.unshift(url);
		return url;
	},
	goBack: function (TH) {
		if (BUFFER.explorer.back.length < 1)
			return;
		UI.openDir(TH, BUFFER.explorer.back.shift(), "forward");
	},
	goForward: function (TH) {
		if (BUFFER.explorer.forward.length < 1)
			return;
		UI.openDir(TH, BUFFER.explorer.forward.shift(), "back");
	},
	sendLoginLocal: function (TH, name) {
		name = name || TH.html();
		var row = getAccRow(name);
		if (row.index < 0 && (BUFFERToLocal(), localToBUFFER(), UI.openLoginLocal(), row = getAccRow(name), row.index < 0)) {
			UI.errors(["no acc"]);
			return;
		}
		row = row.row;
		A.ajax({
			url: row.ftp ? row.urlPhp : row.login,
			type: "POST",
			async: true,
			dataType: "json",
			data: {
				acc: row,
				funcs: [{
						name: "login"
					}
				]
			},
			success: function (d) {
				if (d.error.length > 0) {
					UI.errors(d.error);
					return;
				};
				setAccount(row);
			},
			resCode: function (c) {
				c === 404 && UI.errors(["not main"]);
			},
			error: function () {
				UI.errors(["net err"]);
			}
		});
	},
	sendLogin: function (TH, ftp, log, pass, urlPhp, urlFtp) {
		log = log || ".back .login".val(),
		pass = pass || ".back .pass".val(),
		ftp && (
			urlPhp = urlPhp || ".back .urlPhp".val(),
			urlFtp = urlFtp || ".back .urlFtp".val()),
		A.ajax({
			url: ftp ? urlPhp : log,
			type: "POST",
			async: true,
			dataType: "json",
			data: {
				acc: {
					ftp: ftp,
					password: pass,
					login: log,
					urlFtp: urlFtp
				},
				funcs: [{
						name: "login"
					}
				]
			},
			success: function (e) {
				if (e.error.length > 0) {
					UI.errors(e.error);
					return;
				};
				var data = BUFFER.localData.accounts,
				local = data.login.indexOf(log),
				setLogin = function (nm) {
					if (log === ACCOUNT.login && pass === ACCOUNT.password && (ftp ? urlFtp === ACCOUNT.urlFtp && urlPhp === ACCOUNT.urlPhp : true))
						UI.dialogPanel({
							content: [{
									type: "message",
									text: "you are already logged in. Relogin?"
								}
							],
							func: function (d) {
								d.pressed === "ok" && setAccount(nm || "", ftp, log, pass, urlPhp, urlFtp);
							}
						});
					else
						setAccount(nm || "", ftp, log, pass, urlPhp, urlFtp);
				},
				store = {
					newAcc: function (login, password) {
						UI.dialogPanel({
							content: [{
									type: "message",
									text: "Do you want to add this account to the local store?"
								}, {
									type: "input",
									inpID: "name",
									opt: {
										placeholder: "NAME"
									}
								}, {
									type: "button",
									btnID: "ok",
									btntext: "ok"
								}, {
									type: "button",
									btnID: "cancel",
									btntext: "cancel"
								}
							],
							func: function (res) {
								if (res.pressed === "ok") {
									var name = res.values.name,
									pos = data.name.indexOf(name);
									if (pos > -1)
										store.upAcc(login, password, pos);
									else
										data.name.push(name),
										data.login.push(login),
										data.ftp.push(ftp),
										data.urlFtp.push(urlFtp),
										data.urlPhp.push(urlPhp),
										data.password.push(password),
										BUFFERToLocal(),
										setLogin(name);
								} else
									setLogin(name);

							}
						});
					},
					upAcc: function (login, password, pos) {
						UI.dialogPanel({
							content: [{
									type: "message",
									text: "This account already exists in the local store (name: " + data.name[pos] + "). <br> Do you want to update the data?"
								}, {
									type: "button",
									btnID: "ok",
									btntext: "ok"
								}, {
									type: "button",
									btnID: "no",
									btntext: "no"
								}, {
									type: "button",
									btnID: "new",
									btntext: "new store"
								}
							],
							func: function (res) {
								res.pressed === "ok" && (
									data.password[pos] = password,
									data.ftp[pos] = ftp,
									data.urlFtp[pos] = urlFtp,
									data.urlPhp[pos] = urlPhp,
									data.login[pos] = login,
									BUFFERToLocal()),
								res.pressed === "new" && store.newAcc(login, password),
								(res.pressed === "ok" || res.pressed === "no") && setLogin(data.name[pos]);
							}
						});
					}
				};
				ftp && data.urlFtp.all(function (url, ind) {
					if (url === urlFtp && data.login[ind] === log && data.urlPhp[ind] === urlPhp) {
						local = ind;
						return "break";
					}
				}, "break");
				if (BUFFER.localData.settings.showAccountSaveMessage)
					if (local < 0)
						store.newAcc(log, pass);
					else
						store.upAcc(log, pass, local);
				else
					setLogin();
			},
			resCode: function (c) {
				c === 404 && UI.errors(["not main"]);
			},
			error: function () {
				UI.errors(["net err"]);
			}
		});
	},
	sendLoginFtp: function (TH) {
		UI.sendLogin(TH, true);
	},
	clearLocal: function () {
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "Do you really want to delete ALL local data?"
				}, {
					type: "button",
					btnID: "ok",
					btntext: "ok"
				}, {
					type: "button",
					btnID: "cancel",
					btntext: "cancel"
				}
			],
			func: function (req) {
				if (req.pressed === "ok") {
					clearLocal();
				}
			}
		});
	},
  	reloadListsChanges:function(TH,url){
      		url=PATH(url).fixUrl();
      		PATH(BUFFER.explorer.curDir).fixUrl()===url&&UI.openDir(document, url, "stay");
      		var tree;
			".tree.cls.dir[opened=true]".all(function (el) {
				if (PATH(el.opt("_url")).fixUrl() === url)
					return (tree = el, "break");
			}, "break");
          	if (tree)
				BUFFER.loadprocess.reloadTree = BUFFER.loadprocess.reloadTree.wait(function (non, rW) {
      				tree = objWalk(BUFFER.explorer.tree, PATH(url).arrUrl(), ["list"], true),
					tree.list = {},
					tree.opened = false,
					UI.setLSToPlace(".leftexplorer", true),
					UI.generateTree(TH, url).wait(function (d) {
						UI.setLSToPlace(".leftexplorer", false);
						rW.value = 1;
						if (d !== 1)
							return;
						UI.parseTree();
					});
        		},true);
    },
	deleteDirFile: function (TH, url, parent, path) {
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "Do you want to delete it?"
				}, {
					type: "message",
					text: url
				}, {
					type: "button",
					btntext: "yes",
					btnID: "yes"
				}, {
					type: "button",
					btntext: "no",
					btnID: "no"
				}
			],
			func: function (data) {
				if (data.pressed !== "yes")
					return;
				url = url || TH.attrFromPath("_url"),
				path = PATH(url, UI.errors),
				path.common("delete").wait(function (vl, W) {
					UI.reloadListsChanges(TH,path.parentDir);
				});
			}
		});
	},
	deleteAllList: function (TH, list) {
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "Do you want to delete it?"
				}, {
					type: "message",
					text: list.join("<br>")
				}, {
					type: "button",
					btntext: "yes",
					btnID: "yes"
				}, {
					type: "button",
					btntext: "no",
					btnID: "no"
				}
			],
			func: function (data) {
				if (data.pressed !== "yes")
					return;
				var parent = PATH(list[0]).parentDir;
				PATH(parent, UI.errors).common("deleteList", {
					list: list
				}).wait(function (vl, W) {
					UI.reloadListsChanges(TH,parent);
				});
			}
		});
	},
  	createDir:function(TH,url){
      	UI.dialogPanel({
			content: [{
					type: "message",
					text: "Endter dir name:"
				}, {
					type: "input",
					inpID: "name",
                  	opt:{
                      	placeholder:"new dir"
                    }
				}, {
					type: "button",
					btntext: "create",
					btnID: "create"
				}, {
					type: "button",
					btntext: "cancel",
					btnID: "cancel"
				}
			],
			func: function (data) {
				if (data.pressed !== "create")
					return;
              	if (data.values.name == "")
                  	return UI.errors(["no name"]);
				
              	var url = url || TH.attrFromPath("_url"),
				path = PATH(url, UI.errors);
				path.common("create",{
                  	name:data.values.name,
                  	type:"dir"
                }).wait(function (vl, W) {
                  	if(vl.type==="requery" && vl.info==="obj exists")
                      	return UI.errors(["already exists"]);
					UI.reloadListsChanges(TH,path.url);
				});
			}
		});
    },
  	createFile:function(TH,url){
      	UI.dialogPanel({
			content: [{
					type: "message",
					text: "Endter file name:"
				}, {
					type: "input",
					inpID: "name",
                  	opt:{
                      	placeholder:"new file"
                    }
				}, {
					type: "button",
					btntext: "create",
					btnID: "create"
				}, {
					type: "button",
					btntext: "cancel",
					btnID: "cancel"
				}
			],
			func: function (data) {
				if (data.pressed !== "create")
					return;
              	if (data.values.name == "")
                  	return UI.errors(["no name"]);
				
              	var url = url || TH.attrFromPath("_url"),
				path = PATH(url, UI.errors);
				path.common("create",{
                  	name:data.values.name,
                  	type:"file"
                }).wait(function (vl, W) {
                  	if(vl.type==="requery" && vl.info==="obj exists")
                      	return UI.errors(["already exists"]);
					UI.reloadListsChanges(TH,path.url);
				});
			}
		});
    },
	ctx: {
		openContextmenu: function (param, coo, bbl) {
			var s = A.args({
					content: [{
							type: "message",
							text: "hmm...."
						}, {
							type: "line"
						}, {
							type: "button",
							btntext: "test btn",
							btnID: "test1"
						}
					],
					func: function () {}
				}, param),
			mUID = UID.get(),
			menu = bbl ? ".contextmenu".a(!0).end.addClass("preshow") : "body".addElem("div", {
					class: "contextmenu preshow",
					uid: mUID,
					_CSS: {
						top: coo.Y + "px",
						left: coo.X + "px"
					},
					_TXT: "<f-scrollplane></f-scrollplane><f-scroll-y><f-wheel></f-wheel></f-scroll-y>"
				}),
			tmp = menu.child("f-scrollplane"),
			fun = function (e, tmp2) {
				tmp2 = e.toElement.opt("bid");
				UI.ctx.closeContextmenu(menu.opt("uid"));
				s.func && s.func({
					pressed: tmp2
				});
			};
			bbl && tmp.addElem("hr"),
			s.content.all(function (el) {
				switch (el.type) {
				case "message":
					tmp.addElem("div", {
						class: "message",
						_TXT: el.text
					}).opt(el.opt || {});
					break;
				case "button":
					tmp.addElem("button", {
						class: "blackbtn txtnowrap",
						_TXT: el.btntext,
						bid: el.btnID,
						ofCtxUID: mUID,
						funcs: el.funcs ? el.funcs : "",
						_LIS: [{
								click: fun
							}
						]
					}).opt(el.opt || {});
					break;
				case "line":
					tmp.addElem("hr", el.opt || {});
					break;
				}
			});

			tmp = [menu.getBoundingClientRect(),
				"body".a().getBoundingClientRect()];
			(tmp[0].height + coo.Y) > tmp[1].height && menu.css("top", (
					(tmp[2] = tmp[1].height - tmp[0].height) > tmp[1].height ? tmp[1].height - tmp[1].height / 10 : tmp[2]) + "px"),
			(tmp[0].width + coo.X) > tmp[1].width && menu.css("left", (
					(tmp[2] = tmp[1].width - tmp[0].width) > tmp[1].width ? tmp[1].width - tmp[1].width / 10 : tmp[2]) + "px");
			menu.remClass("preshow");
		},
		closeContextmenu: function (uid) {
			("[uid=" + uid + "]").remElem();
		},
		dirFileMenu: function (TH, coo, bbl) {
			var list = {
				content: [{
						type: "button",
						btntext: "delete",
						btnID: "delete"
					}
				],
				func: function (data) {
					var pr = data.pressed,
					url = TH.attrFromPath("_url");
					switch (pr) {
					case "delete":
						UI.deleteDirFile(TH, url);
						break;
					case "deleteall":
						UI.deleteAllList(TH, ".dirPlace.selected".all(function (el) {
								return el.opt("_url");
							}).return);
						break
					}
				}
			};
			if (TH.hasClass("selected"))
				list.content.push({
					type: "button",
					btntext: "delete selected",
					btnID: "deleteall"
				});
			UI.ctx.openContextmenu(list, coo);
		},
		rightexplorer: function (TH, coo, bbl) {
			var list={
            	content:[
                  	{
						type: "button",
						btntext: "create file",
						btnID: "mkfile"
					},
                  	{
						type: "button",
						btntext: "create dir",
						btnID: "mkdir"
					},
                  	{
                      	type: "button",
                      	btntext: "reload",
                      	btnID: "reload"
                    }
                ],
              	func:function(data){
                	var pr = data.pressed,
					url = TH.attrFromPath("_url");
					switch (pr) {
					case "mkdir":
						UI.createDir(TH, url);
						break;
                    case "mkfile":
                        UI.createFile(TH, url);
						break;
					case "reload":
                        UI.openDir(document,url,"stay");
						break
					}
                }
            };
        	UI.ctx.openContextmenu(list, coo);
		}
	}
};

A.on("click", function (e) {
	e.path.all(function (TH) {
		var FN = TH.errored(function (t) {
				return t !== document && t !== window;
			}).opt("funcs");
		if (FN === errored || !FN)
			return "continue";
		FN = FN.split(",");
		FN.all(function (fun) {
			return UI[fun](TH);
		}, "break", "continue");
	});
});
window.addEventListener("contextmenu", function (e, ccount) {
	e.preventDefault();
	e = new BJSEvent(e);
	".contextmenu".all(function (cm) {
		UI.ctx.closeContextmenu(cm.opt("uid"));
	});
	ccount = 0;
	e.path.all(function (TH, ind, FN) {
		if (TH === document)
			return "break";
		FN = TH.opt("contextfuncs");
		if (!FN || (ind > 0 && !TH.opt("bubblecontext")) || (ccount > 0 && !TH.opt("mergecontext")))
			return "continue";
		FN = FN.split(","),
		FN.all(function (fun) {
			return UI.ctx[fun](TH, e, ccount > 0);
		}, "break", "continue");
		ccount++;
	}, "break", "continue");
});
A.on("mousedown", function (e, tmp) {
	tmp = ".contextmenu".a();
	if (tmp && e.path.indexOf(tmp) < 0)
		UI.ctx.closeContextmenu(tmp.opt("uid"));
});
/*END*/
