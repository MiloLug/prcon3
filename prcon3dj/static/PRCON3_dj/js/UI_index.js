/*END*/
(function (A, window, document) {
	"use strict";
	window.A.on("combination", "ctrl+r", function (e) {
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "close page?".tr
				}, {
					type: "button",
					btnID: "y",
					btntext: "yes".tr
				}, {
					type: "button",
					btnID: "n",
					btntext: "no".tr
				}
			],
			onEnter: "y",
			func: function (data) {
				if (data.pressed === "y")
					window.allowUnload = true,
					window.location.reload();
			}
		});
	}, false);
	window.UI.Ainit({
		langSet: function () {
			var cont = [{
					type: "message",
					text: "lan reload".tr
				}, {
					type: "button",
					btntext: "cancel".tr,
					btnID: "cl"
				}
			];
			A.toArray(LANG_LIST, true).all(function (prop) {
				if (prop[0] === "@default@")
					return;
				cont.push({
					type: "checkbox",
					chctext: prop[0],
					chcID: prop[0],
					opt: {
						checked: CUR_LANG === prop[1] ? "." : "",
						_INIT: function (e) {
							e.on("change", function () {
								if (!e.checked)
									return e.checked = true;
								localStorage.setItem(PRCON_LANGUAGE_SAVE_NAME, prop[1]);
								window.allowUnload = true;
								window.location.reload();
							});
						}
					}
				});
			});
			UI.dialogPanel({
				content: cont
			});
		},
		redactorSet: function () {
			var cont = [{
					type: "message",
					text: "red reload".tr
				}, {
					type: "button",
					btntext: "cancel".tr,
					btnID: "cl"
				}
			];
			A.toArray(REDACTORS_LIST, true).all(function (prop) {
				if (prop[0] === "@default@")
					return;
				cont.push({
					type: "checkbox",
					chctext: prop[0],
					chcID: prop[0],
					opt: {
						checked: CUR_REDACTOR === prop[1] ? "." : "",
						_INIT: function (e) {
							e.on("change", function () {
								if (!e.checked)
									return e.checked = true;
								localStorage.setItem(PRCON_REDACTOR_CURRENT_NAME, prop[1]);
								window.allowUnload = true;
								window.location.reload();
							});
						}
					}
				});
			});
			UI.dialogPanel({
				content: cont
			});
		},
		closeAll: function () {
			var wcloser = function (w) {
				w.allowUnload = true;
				w.close();
			};
			A.toArray(BUFFER.windows.viewInReload).all(wcloser);
			A.toArray(BUFFER.windows.redactors).all(wcloser);
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
			var back = UI.setSrcToPlace("loginLocal", true),
			sp = back.child(".backcontent>f-scrollplane");
			".back[act=loginLocal] f-scrollplane".selects(".back[act=loginLocal] f-scrollplane", ".forsel"),
			".back[act=login]".errored().remElem(),
			".back[act=loginFtp]".errored().remElem(),
			BUFFER.localData.accounts.name.all(function (nm, i) {
				sp.addElem("button", {
					title: BUFFER.localData.accounts.ftp[i] ?
					"PHP: " + BUFFER.localData.accounts.urlPhp[i] +
					"\nFTP url: " + BUFFER.localData.accounts.urlFtp[i] +
					"\nFTP login: " + BUFFER.localData.accounts.login[i]
					 :
					BUFFER.localData.accounts.login[i],
					funcs: "sendLoginLocal",
					class: "cls item forsel",
					contextfuncs: "loginLocalListItem",
					name:nm,
					_TXT: nm
				});
			});
		},
		openedFiles: function (TH, url) {
			var back = UI.setSrcToPlace("openedFilesList", true),
			cont = back.child(".backcontent>f-scrollplane");
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			Object.keys(BUFFER.redactors).all(function (nm, i) {
				cont.addElem("button", {
					funcs: "toTopFileRedactor,easyCancel",
					class: "cls item",
					emhover: url === nm ? "." : "",
					_url: nm,
					_TXT: nm
				});
			});
		},
		openDownloads: function (TH) {
			var back = UI.setSrcToPlace("downloads", true),
			cont = back.child(".backcontent>f-scrollplane");
			for (var nm in BUFFER.downloads) {
				var el = A.createElem("div", {
						_TXT: UI.getAct(BUFFER.downloads[nm].up ? "uploadsFileSrc" : "downloadsFileSrc")
					}).children[0].pasteIn(cont);
				el.opt({
					_url: nm
				});
				el.child(".name").html = BUFFER.downloads[nm].up ? BUFFER.downloads[nm].name : PATH(nm).name;
				BUFFER.downloads[nm].inDownloads = el;
				BUFFER.downloads[nm].inDownSpeed = el.child(".speed");
				BUFFER.downloads[nm].inDownIng = el.child(".downloading");
				BUFFER.downloads[nm].inDownBar = el.child(".bar");
			}
		},
		toTopFileRedactor: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			UI.toTopLayer(BUFFER.redactors[url].a().parent(function (el) {
					return el.className === "back";
				}) || BUFFER.redactors[url]);
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
							title: !dec.realtime ? "need to reload".tr : "",
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
						var inpval = buffSett[dec.param.name] || "";
						tmpdom.div._DOM.unshift({
							input: {
								class: "inputstyle cls",
								placeholder: dec.inptext,
								type: "text",
								_LIS: [{
										change: function (e) {
											var val = A.eGetElem(e).val();
											if (dec.inptype === "number" && !A.isNumeric(val))
												return (A.eGetElem(e).val = val == "" ? 0 : inpval);
											inpval = val;
											buffSett[dec.param.name] = val;
											if (dec.realtime)
												applySettings();
										}
									}
								],
								funcs: dec.funcs ? dec.funcs : "",
								_AFTER: {
									_VAL: buffSett[dec.param.name] || ""
								}
							}
						});
						break;
					case "select":
						tmpdom.div._DOM.unshift({
							select: {
								class: "selstyle cls",
								_DOM: dec.options.all(function (op) {
									return {
										option: {
											_TXT: op
										}
									};
								}).return,
								_LIS: [{
										change: function (e) {
											buffSett[dec.param.name] = A.eGetElem(e)[dec.compareBy];
											if (dec.realtime)
												applySettings();
										}
									}
								],
								funcs: dec.funcs ? dec.funcs : "",
								_AFTER: {
									_INIT: function (el) {
										el[dec.compareBy] = buffSett[dec.param.name] || ""
									}
								}
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
		deleteAccs:function(TH,names){
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "delete it?".tr
					}, {
						type: "message",
						text: "Accounts".tr+":\n"+names.join("\n")
					}, {
						type: "button",
						btntext: "yes".tr,
						btnID: "yes"
					}, {
						type: "button",
						btntext: "no".tr,
						btnID: "no"
					}
				],
				onEnter: "yes",
				func: function (data) {
					if (data.pressed !== "yes")
						return;
					var pos,
						accs=BUFFER.localData.accounts,
						openedLogin = ".back[act=loginLocal]".a(),
						logList={},
						posp;
					openedLogin&&openedLogin.child(".item.forsel",!0).all(function(el){
						logList[el.opt("name")]=el;
					});
					names.all(function(name){
						pos=accs.name.indexOf(name);
						posp=pos+1;
						if(pos<0||name===ACCOUNT.name)
							return;
						accs.name.splice(pos,posp);
						accs.login.splice(pos,posp);
						accs.password.splice(pos,posp);
						accs.ftp.splice(pos,posp);
						accs.urlPhp.splice(pos,posp);
						accs.urlFtp.splice(pos,posp);
						accs.portFtp.splice(pos,posp);
						delete accs.data.explorer[name];
						openedLogin&&logList[name].remElem();
					});
					BUFFERToLocal();
				}
			});
		},
		resetSettings: function () {
			BUFFER.localData.settings = new N_SETTINGS();
			BUFFERToLocal();
			applySettings();
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "close page?".tr
					}, {
						type: "button",
						btnID: "ok",
						btntext: "yes".tr
					}, {
						type: "button",
						btnID: "n",
						btntext: "no".tr
					}
				],
				onEnter: "ok",
				func: function (req) {
					if (req.pressed === "ok") {
						window.allowUnload = true;
						window.location.reload();
					}
				}
			});
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
							d = d[0];
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
					if (nm === ".")
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
							_type: tree[nm].type,
							_url: tree[nm].url,
							opened: tree[nm].opened,
							contextfuncs: "dirFileMenu, treeMenu",
							bubblecontext: ".",
							mergecontext: ".",
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
									pos: thP.nextSibling || undefined
								}, {
									class: "tree offset",
									url: url
								});
						UI.setLSToPlace(thP || ".leftexplorer", true);
						UI.generateTree(TH, url).wait(function (d) {
							UI.setLSToPlace(thP || ".leftexplorer", false);
							rW.value = 1;
							if (d !== 1)
								return;
							UI.parseTree(TH, url, offset);
							thP.errored().opt("opened", "true");
						});
					}, true));
		},
		openDir: function (TH, url, type, list) {
			BUFFER.loadprocess.openDir.XHR&&BUFFER.loadprocess.openDir.XHR.abort();
			return (BUFFER.loadprocess.openDir = BUFFER.loadprocess.openDir.wait(function (non, rW) {
						var RE = ".rightexplorer>f-scrollplane";
						url = PATH(url || (TH ? TH.attrFromPath("_url") : false) || BUFFER.explorer.curDir).fixUrl();
						UI.setLSToPlace(".rightexplorer", true);
						var path = PATH(url, UI.errors),
							start=(list ? A.start(function () {
								return list;
							}) : path.common("getList", {
								getSize: true
							}));
						!list&&pendTo(function(){
							return start.XHR;
						}).wait(function(xhr){
							rW.XHR=xhr;
						});
						start.wait(function (d) {
							UI.setLSToPlace(".rightexplorer", false);
							if (d === 0) {
								UI.setPathRow(BUFFER.explorer.curDir);
								rW.value = 0;
								return;
							}
							d = d[0];

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
								if (r.name === ".")
									return "continue";
								RE.addElem("div", {
									class: "dirPlace",
									_type: r.type,
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
												class: "rowtext",
												_TXT: r.name
											}
										}, {
											div: {
												class: "closer",
												title: r.type === "dir" ? "" : formatBytes(r.size || 0)
											}
										}, r.type === "dir" ? {}
										 : {
											div: {
												class: "size center",
												_TXT: formatBytes(r.size || 0)
											}
										}
									]);
							}, "break", "continue");
							RE.opt("_url", url);
							rW.value = 1;
						});
					}, true));
		},
		fileEditor: function (fn, args, windowed) {
			if (FILE_REDACTOR) {
				var red = FILE_REDACTOR;
				if (windowed)
					red = red.windowed;
				return red[fn].apply(red, args);
			} else {
				UI.errors(["no editor"]);
				return false;
			}
		},
		closeRedactor: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			if (!(url in BUFFER.redactors))
				return;
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "close file?".tr + "<br>" + url
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
					UI.fileEditor("close", [TH, url]);
				}
			});
		},
		openFile: function (TH, url, content) {
			var windowed = !BUFFER.localData.settings.defaultFileEditorType;
			UI.fileEditor("edit", [TH, url, content], windowed);
		},
		saveFile: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			if (!url)
				return;
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "save file?".tr + "<br>" + url
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
					UI.fileEditor("save", [TH, url]);
				}
			});
		},
		windowedRedactor: function (TH, url) {
			UI.fileEditor("edit", [TH, url], true);
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
			BUFFER.loadprocess.setHash = BUFFER.loadprocess.setHash.wait(function(v){
				window.location.hash = url;
				return "setJS";
			});
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
			UI.setLSToPlace("body", true);
			A.ajax({
				url: row.ftp ? row.urlPhp : row.login,
				type: "POST",
				async: true,
				dataType: "form",
				data: [{
						name: "query",
						value: A.json({
							acc: row,
							funcs: [{
									name: "login"
								}
							]
						})
					}
				],
				success: function (d) {
					d = A.json(d);
					UI.setLSToPlace("body", false);
					if (d.error.length > 0) {
						UI.errors(d.error);
						return;
					};
					setAccount(row);
				},
				resCode: function (c) {
					c === 404 && (
						UI.setLSToPlace("body", false),
						UI.errors(["not main"]));
				},
				error: function () {
					UI.setLSToPlace("body", false);
					UI.errors(["net err"]);
				}
			});
		},
		sendLogin: function (TH, ftp, log, pass, urlPhp, urlFtp, portFtp) {
			log = log || ".back .login".val(),
			pass = pass || ".back .pass".val(),
			ftp && (
				urlPhp = urlPhp || ".back .urlPhp".val(),
				urlFtp = urlFtp || ".back .urlFtp".val(),
				portFtp = !A.isEmpty(portFtp) ? parseFloat(portFtp) : 21),
			UI.setLSToPlace("body", true);
			A.ajax({
				url: ftp ? urlPhp : log,
				type: "POST",
				async: true,
				dataType: "form",
				data: [{
						name: "query",
						value: A.json({
							acc: {
								ftp: ftp,
								password: pass,
								login: log,
								urlFtp: urlFtp,
								portFtp: portFtp
							},
							funcs: [{
									name: "login"
								}
							]
						})
					}
				],
				success: function (e) {
					e = A.json(e);
					UI.setLSToPlace("body", false);
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
										text: "already logged".tr
									}
								],
								func: function (d) {
									d.pressed === "ok" && setAccount(nm || "", ftp, log, pass, urlPhp, urlFtp, portFtp);
								}
							});
						else
							setAccount(nm || "", ftp, log, pass, urlPhp, urlFtp, portFtp);
					},
					store = {
						newAcc: function (login, password) {
							UI.dialogPanel({
								content: [{
										type: "message",
										text: "account to local?".tr
									}, {
										type: "input",
										inpID: "name",
										opt: {
											placeholder: "NAME"
										}
									}, {
										type: "button",
										btnID: "ok",
										btntext: "ok".tr
									}, {
										type: "button",
										btnID: "cancel",
										btntext: "cancel".tr
									}
								],
								onEnter: "ok",
								onEsc: "cancel",
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
											data.portFtp.push(portFtp),
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
										text: "Account exists".tr + "\n(" + "name".tr + ":" + data.name[pos] + ")"
									}, {
										type: "button",
										btnID: "ok",
										btntext: "ok".tr
									}, {
										type: "button",
										btnID: "no",
										btntext: "no".tr
									}, {
										type: "button",
										btnID: "new",
										btntext: "new store".tr
									}
								],
								func: function (res) {
									res.pressed === "ok" && (
										data.password[pos] = password,
										data.ftp[pos] = ftp,
										data.urlFtp[pos] = urlFtp,
										data.urlPhp[pos] = urlPhp,
										data.portFtp[pos] = portFtp,
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
					c === 404 && (
						UI.setLSToPlace("body", false),
						UI.errors(["not main"]));
				},
				error: function () {
					UI.setLSToPlace("body", false);
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
						text: "delete all data?".tr
					}, {
						type: "button",
						btnID: "ok",
						btntext: "ok".tr
					}, {
						type: "button",
						btnID: "cancel",
						btntext: "cancel".tr
					}
				],
				func: function (req) {
					if (req.pressed === "ok") {
						clearLocal();
					}
				}
			});
		},
		reloadListsChanges: function (TH, url, type) {
			url = PATH(url).fixUrl();
			PATH(BUFFER.explorer.curDir).fixUrl() === url && type !== "tree" && UI.openDir(document, url, "stay");
			if (type === "dir")
				return;
			var tree,
			offset,
			treeObj;
			".tree.cls.dir[opened=true]".all(function (el) {
				if (PATH(el.opt("_url")).fixUrl() === url)
					return (tree = el, offset = el.nextElementSibling, "break");
			}, "break");
			if (tree)
				BUFFER.loadprocess.reloadTree = BUFFER.loadprocess.reloadTree.wait(function (non, rW) {
						treeObj = objWalk(BUFFER.explorer.tree, PATH(url).arrUrl(), ["list"], true),
						treeObj.list = {},
						treeObj.opened = false,
						UI.setLSToPlace(tree, true),
						UI.generateTree(TH, url).wait(function (d) {
							UI.setLSToPlace(tree, false);
							rW.value = 1;
							if (d !== 1)
								return;
							UI.parseTree(TH, url, offset);
						});
					}, true);
		},
		startLoadWaiting: function (fn, url) {
			url = PATH(url).fixUrl();
			var fnwait = function (obj) {
				var tree,
				offset;
				".tree.cls.dir[opened=true]".all(function (el) {
					if (PATH(el.opt("_url")).fixUrl() === url)
						return (tree = el, offset = el.nextElementSibling, "break");
				}, "break");
				return fn(obj, function (tf) {
					tree && UI.setLSToPlace(tree, tf);
					tree && UI.setLSToPlace(offset, tf);
					UI.setLSToPlace(".rightexplorer", tf);
					return tf;
				});
			};
			var waiter = A.start(fnwait, true);
			BUFFER.loadprocess.openDir = BUFFER.loadprocess.openDir.wait(function () {
					return waiter;
				});
			BUFFER.loadprocess.reloadTree = BUFFER.loadprocess.reloadTree.wait(function () {
					return waiter;
				});
		},
		treeParentOfNotExists: function (TH, url) {
			var arr = PATH(url).arrUrl(),
			child = arr.pop(),
			treeObj;
			while (arr.length > 0) {
				treeObj = objWalk(BUFFER.explorer.tree, arr, ["list"], true);
				if (treeObj && treeObj.opened && !treeObj.list[child])
					return PATH(arr).fixUrl();
				child = arr.pop();
			}
			return false;
		},
		curDirParentOfNotExists: function (TH, url) {
			var arr = PATH(url).arrUrl(),
			curDir = BUFFER.explorer.curDir,
			child = arr.pop(),
			curUrl,
			list = ".rightexplorer .dirPlace".a(!0).all(function (el) {
					return PATH(el.opt("_url")).name;
				}).return;
			while (arr.length > 0) {
				curUrl = arr.join("/") + "/";
				if (curUrl === curDir && list.indexOf(child) < 0)
					return curDir;
				child = arr.pop();
			}
			return false;
		},
		deleteDirFile: function (TH, url, parent, path) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "delete it?".tr
					}, {
						type: "message",
						text: url
					}, {
						type: "button",
						btntext: "yes".tr,
						btnID: "yes"
					}, {
						type: "button",
						btntext: "no".tr,
						btnID: "no"
					}
				],
				onEnter: "yes",
				func: function (data) {
					if (data.pressed !== "yes")
						return;
					url = url || TH.attrFromPath("_url"),
					path = PATH(url, UI.errors);
					UI.startLoadWaiting(function (obj, ls) {
						ls(true);
						path.common("delete").wait(function () {
							ls(false);
							obj.value = 1;
							UI.reloadListsChanges(TH, path.parentDir);
						});
					}, path.parentDir);
				}
			});
		},
		extractZip: function (TH, url, path) {
			url = url || TH.attrFromPath("_url"),
			path = PATH(url, UI.errors),
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "extract to".tr + ":"
					}, {
						type: "input",
						inpID: "dest",
						opt: {
							_VAL: path.parentDir
						}
					}, {
						type: "button",
						btntext: "ok".tr,
						btnID: "ok"
					}, {
						type: "button",
						btntext: "cancel".tr,
						btnID: "cl"
					}
				],
				onEnter: "ok",
				func: function (data) {
					if (data.pressed !== "ok" || !data.values.dest)
						return;
					UI.startLoadWaiting(function (obj, ls) {
						ls(true);
						path.common("extractZip", {
							destinationDir: data.values.dest
						}).wait(function (vl, W) {
							ls(false);
							obj.value = 1;
							var parent = UI.curDirParentOfNotExists(TH, data.values.dest);
							parent && UI.reloadListsChanges(TH, parent);
							parent = UI.treeParentOfNotExists(TH, data.values.dest);
							parent && UI.reloadListsChanges(TH, parent);
							UI.reloadListsChanges(TH, data.values.dest);
						});
					}, PATH(data.values.dest).parentDir);
				}
			});
		},
		deleteAllList: function (TH, list) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "delete it?".tr
					}, {
						type: "message",
						text: list.join("<br>")
					}, {
						type: "button",
						btntext: "yes".tr,
						btnID: "yes"
					}, {
						type: "button",
						btntext: "no".tr,
						btnID: "no"
					}
				],
				onEnter: "yes",
				func: function (data) {
					if (data.pressed !== "yes")
						return;
					var parent = PATH(list[0]).parentDir;

					UI.startLoadWaiting(function (obj, ls) {
						ls(true);
						PATH(parent, UI.errors).common("deleteList", {
							list: list
						}).wait(function (vl, W) {
							ls(false);
							obj.value = 1;
							UI.reloadListsChanges(TH, parent);
						});
					}, parent);
				}
			});
		},
		createZip: function (TH, url, list) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "enter archive".tr + ":"
					}, {
						type: "input",
						inpID: "name",
						opt: {
							placeholder: "my.zip"
						}
					}, {
						type: "button",
						btntext: "create".tr,
						btnID: "create"
					}, {
						type: "button",
						btntext: "cancel".tr,
						btnID: "cancel"
					}
				],
				onEnter: "create",
				func: function (data) {
					if (data.pressed !== "create")
						return;
					if (data.values.name == "")
						return UI.errors(["no name"]);

					list = list || [];
					if (list.length < 1)
						return;

					url = url || TH.attrFromPath("_url");

					var path = PATH(url, UI.errors);
					UI.setLSToPlace("body", true);
					path.common("createZip", {
						name: data.values.name,
						list: list
					}).wait(function (vl, W) {
						UI.setLSToPlace("body", false);
						vl = vl[0];
						if (vl.type === "requery" && vl.info === "obj exists" || vl.type === "error")
							return UI.errors([vl.info]);
						UI.reloadListsChanges(TH, path.url);
					});
				}
			});
		},
		rename: function (TH, parent, oldNames) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "enter rename".tr + ":<br><pre>function (oldName,oldExtension,nameIndex){</pre>"
					}, {
						type: "message",
						text: "<pre>var newName;</pre>",
						opt: {
							_CSS: JS_STYLE.renameDialogCodeTab
						}
					}, {
						type: "textarea",
						inpID: "name",
						opt: {
							placeholder: "new name",
							_CSS: JS_STYLE.renameDialogTextArea,
							_VAL: oldNames.length < 2 ? oldNames[0] : "",
							_LIS: [{
									"combination": ["tab", function (e) {
											document.execCommand("insertText", false, "\t");
										}, false]
								}
							]
						}
					}, {
						type: "message",
						text: "<pre>return newName;</pre>",
						opt: {
							_CSS: JS_STYLE.renameDialogCodeTab
						}
					}, {
						type: "message",
						text: "<pre>}</pre>"
					}, {
						type: "checkbox",
						chctext: "this is JS".tr,
						chcID: "isjs"
					}, {
						type: "checkbox",
						chctext: "no ext rename".tr,
						chcID: "noext"
					}, {
						type: "message",
						text: "no ext rename info".tr
					}, {
						type: "button",
						btntext: "rename".tr,
						btnID: "rename"
					}, {
						type: "button",
						btntext: "cancel".tr,
						btnID: "cancel"
					}
				],
				onEnter: "rename",
				func: function (data) {
					if (data.pressed !== "rename")
						return;
					if (data.values.name == "")
						return UI.errors(["no name"]);
					if (!oldNames || oldNames.length < 1)
						return UI.errors(["no processed"]);

					var send = {
						oldNames: oldNames,
						newNames: oldNames.all(function (nm, i) {
							nm = PATH(nm).divNameExt();
							if (data.checked.isjs)
								nm = new String(Function("oldName,oldExtension,nameIndex", "var newName;\n\r" + data.values.name + ";\n\r return newName;")(nm[0], nm[1] || "", i));
							else
								nm = new String(data.values.name);
							return nm;
						}).return,
						staticExtension: data.checked.noext
					};

					parent = parent || PATH(TH.attrFromPath("_url")).parentDir;

					var path = PATH(parent, UI.errors);
					UI.setLSToPlace("body", true);
					path.common("rename", send).wait(function (vl, W) {
						UI.setLSToPlace("body", false);
						vl = vl[0];
						if (vl.type === "requery" && vl.info === "obj exists" || vl.type === "error")
							return UI.errors([vl.info]);
						UI.reloadListsChanges(TH, path.url);
						UI.dialogPanel({
							content: [{
									type: "message",
									text: "renamed".tr + ":<br>" + vl.renames.all(function (rn) {
										return rn[0] + " => " + rn[1];
									}).return.join("<br>")
								}, {
									type: "button",
									btntext: "ok".tr,
									btnID: "ok"
								}
							],
							onEnter: "ok"
						});
					});
				}
			});
		},
		createDir: function (TH, url) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "Enter dir name".tr + ":"
					}, {
						type: "input",
						inpID: "name",
						opt: {
							placeholder: "new dir"
						}
					}, {
						type: "button",
						btntext: "create".tr,
						btnID: "create"
					}, {
						type: "button",
						btntext: "cancel".tr,
						btnID: "cancel"
					}
				],
				onEnter: "create",
				func: function (data) {
					if (data.pressed !== "create")
						return;
					if (data.values.name == "")
						return UI.errors(["no name"]);

					url = url || TH.attrFromPath("_url");

					var path = PATH(url, UI.errors);
					UI.setLSToPlace("body", true);
					path.common("create", {
						name: data.values.name,
						type: "dir"
					}).wait(function (vl, W) {
						UI.setLSToPlace("body", false);
						vl = vl[0];
						if (vl.type === "requery" && vl.info === "obj exists" || vl.type === "error")
							return UI.errors([vl.info]);
						UI.reloadListsChanges(TH, path.url);
					});
				}
			});
		},
		createFile: function (TH, url) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "Enter file name".tr + ":"
					}, {
						type: "input",
						inpID: "name",
						opt: {
							placeholder: "new file"
						}
					}, {
						type: "button",
						btntext: "create".tr,
						btnID: "create"
					}, {
						type: "button",
						btntext: "cancel".tr,
						btnID: "cancel"
					}
				],
				onEnter: "create",
				func: function (data) {
					if (data.pressed !== "create")
						return;
					if (data.values.name == "")
						return UI.errors(["no name"]);

					url = url || TH.attrFromPath("_url");
					var path = PATH(url, UI.errors);
					UI.setLSToPlace("body", true);
					path.common("create", {
						name: data.values.name,
						type: "file"
					}).wait(function (vl, W) {
						UI.setLSToPlace("body", false);
						vl = vl[0];
						if (vl.type === "requery" && vl.info === "obj exists" || vl.type === "error")
							return UI.errors([vl.info]);
						UI.reloadListsChanges(TH, path.url);
					});
				}
			});
		},
		stopLoading: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			BUFFER.downloads[url] && BUFFER.downloads[url].xhr.wait(function (vl) {
				vl.x.XHR.abort();
			});
		},
		stopAllLoads: function (TH) {
			for (var nm in BUFFER.downloads)
				BUFFER.downloads[nm].xhr.wait(function (vl) {
					vl.x.XHR.abort();
				});
		},
		paste: function (TH, args) {
			if (!args || !args.list.length)
				return;
			UI.setLSToPlace(".rightexplorer", true);
			PATH(args.destinationDir).common("copyListTo", args).wait(function (vl, W) {
				UI.setLSToPlace(".rightexplorer", false);
				vl = vl[0];
				if (vl.type !== "ok")
					return;
				var errs = [],
				ok = [];
				(function iter(arr) {
					arr.all(function (el) {
						if (el.type !== "ok")
							errs.push(el.url);
						else
							ok.push(el.url),
							iter(el.includes);
					});
				})(vl.objList);
				errs.length && UI.dialogPanel({
					content: [{
							type: "message",
							text: "not copied".tr + ":<br>" + errs.join("<br>")
						}, {
							type: "button",
							btntext: "ok".tr,
							btnID: "ok"
						}
					]
				});
				var checked = [];
				args.deleteSource && args.list.all(function (url) {
					url = PATH(url).parentDir;
					if (checked.indexOf(url) > -1)
						return;
					checked.push(url);
					ok.length && UI.reloadListsChanges(TH, url);
				});
				ok.length && UI.reloadListsChanges(TH, args.destinationDir);
			});
		},
		getLocalData: function (TH) {
			BUFFERToLocal();
			var date = new Date(),
			text = A.json({
					language: localStorage.getItem(PRCON_LANGUAGE_SAVE_NAME),
					redactor: localStorage.getItem(PRCON_REDACTOR_CURRENT_NAME),
					storage: A.json(localStorage.getItem(PRCON_LOCAL_STORAGE_NAME))
				});
			getFile(text, "prcon3_local_storage_" + fullDate() + ".json", "application/json");
		},
		setLocalData: function (TH) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "please, select .json file".tr + ":"
					}, {
						type: "uploader",
						accept: ".json",
						upltext: "...",
						uplID: "file"
					}, {
						type: "button",
						btntext: "ok".tr,
						btnID: "ok"
					}, {
						type: "button",
						btntext: "cancel".tr,
						btnID: "cl"
					}
				],
				onEnter: "ok",
				func: function (d) {
					if (d.pressed !== "ok" || d.fileLists.file.length !== 1)
						return;
					var reader = new FileReader();
					reader.addEventListener("loadend", function () {
						var res = reader.result;
						if (!res)
							return UI.errors(["empty file"]);
						res = A.json(res);
						if (res.__typeOfThis__ == "String")
							return UI.errors(["file cont is dep code"]);
						if (res.language && res.language.__typeOfThis__ == "String") {
							localStorage.setItem(PRCON_LANGUAGE_SAVE_NAME, res.language);
						}
						if (res.redactor && res.redactor.__typeOfThis__ == "String") {
							localStorage.setItem(PRCON_REDACTOR_CURRENT_NAME, res.redactor);
						}
						if (res.storage && res.storage.__typeOfThis__ == "Object") {
							window.BUFFERToLocal = function () {};
							res.storage.version=BUFFER.localData.version;
							localStorage.removeItem(PRCON_LOCAL_STORAGE_NAME);
							localStorage.setItem(PRCON_LOCAL_STORAGE_NAME, A.json(res.storage));
							localToBUFFER();
						}
						if (res.language || res.redactor || res.storage)
							window.allowUnload = true,
							window.location.reload();
					});
					reader.readAsText(d.fileLists.file[0]);
				}
			});
		},
		download: function (TH, list, reload) {
			var inLoad = [];
			list.all(function (item) {
				var path = PATH(item, UI.errors),
				url = path.fixUrl(),
				downObj,
				tmp = [-1, -1],
				reloadInfo = 0,
				tm,
				speed,
				per;
				if (BUFFER.downloads[url]) {
					if (reload) {
						BUFFER.downloads[url].download.XHR.abort();
					} else {
						inLoad.push(url);
						return;
					}
				}
				BUFFER.downloads[url] = downObj = {
					type: A.start(function () {}, true),
					name: path.name,
					delete : A.start(function () {}, true),
					speed: A.start(function () {}, true),
					downloaded: A.start(function () {}, true),
					xhr: A.start(function () {}, true)
				};
				downObj.delete.wait(function () {
					var tmpin = downObj.inDownloads;
					tmpin && setTimeout(function () {
						tmpin.remElem();
					}, 1000);
					downObj.inDownloads = undefined;
					delete BUFFER.downloads[url];
				});
				downObj.type.progress(function (vl) {
					downObj.inDownIng && downObj.inDownIng.html(vl.tr);
					if (vl === "complete") {
						downObj.inDownSpeed && downObj.inDownSpeed.html(formatBytes(0)),
						downObj.inDownBar && downObj.inDownBar.css("width", "100%")
						downObj.delete.value = true;
					}
					if (vl === "stop" || vl === "error") {
						downObj.inDownSpeed && downObj.inDownSpeed.html(formatBytes(0)),
						downObj.delete.value = true;
					}
				});
				downObj.type.progressValue = "getting size";
				downObj.size = path.common("sizeOf").wait(function (size) {
						if (size === 0)
							downObj.type.progressValue = "error";
						else
							downObj.type.progressValue = "downloading";
						return [size[0] * 4 / 3, formatBytes(size[0] * 4 / 3)];
					});
				downObj.download = downObj.size.wait(function () {
						return (downObj.xhr.value = {
								x: path.common("getBase64")
							}).x;
					});
				downObj.download.wait(function (vl) {
					downObj.type.value = downObj.speed.value = downObj.downloaded.value = true;
					if (vl === 0)
						return (downObj.type.progressValue = "error", 0);
					vl = vl[0];
					getFile(b64toBlob(vl.content, vl.mime), downObj.name);
					downObj.type.progressValue = "complete";
				});
				downObj.download.progress(function (dt) {
					if (dt.type === "abort") {
						return downObj.download.value = 0;
					}
					tm = downObj.size.wait(function (vl) {
							return vl;
						});
					tm.wait(function (vl) {
						if (dt.type === "down" && dt.data.loaded <= vl[0]) {
							downObj.downloaded.progressValue = dt.data.loaded;
							if (tmp[0] > -1) {
								var tmp1 = [tmp[0], tmp[1]],
								tm1 = (tm.time - reloadInfo) > 500;
								speed = (dt.data.loaded - tmp1[1]) / (tm.time - tmp1[0]) * 1000;
								per = dt.data.loaded / vl[0] * 100;
								per > 100 && (per = 100);
								if (tm1)
									reloadInfo = tm.time;
								tm1 && (
									downObj.inDownIng && downObj.inDownIng.html(formatBytes(dt.data.loaded) + "/" + vl[1]),
									downObj.inDownSpeed && downObj.inDownSpeed.html(formatBytes(speed)),
									downObj.inDownBar && downObj.inDownBar.css("width", per + "%"));

								downObj.speed.progressValue = speed;
							}
							tmp[0] = tm.time;
							tmp[1] = dt.data.loaded;
						}
					}).error(console.error);
				});
				BUFFER.loadprocess.reloadDownloads.progressValue = true;
				var downPlace = ".srcplace>[act=downloads]".a();
				if (downPlace) {
					var cont = downPlace.child(".backcontent>f-scrollplane"),
					el = A.createElem("div", {
							_TXT: UI.getAct("downloadsFileSrc")
						}).children[0].pasteIn(cont);
					el.opt({
						_url: url
					});
					el.child(".name").html = path.name;
					downObj.inDownloads = el;
					downObj.inDownSpeed = el.child(".speed");
					downObj.inDownIng = el.child(".downloading");
					downObj.inDownBar = el.child(".bar");

				}
			});
			if (inLoad.length)
				UI.dialogPanel({
					content: [{
							type: "message",
							text: "already in load".tr + "\n" + inLoad.join("\n")
						}, {
							type: "button",
							btntext: "reload".tr,
							btnID: "rn"
						}, {
							type: "button",
							btntext: "close".tr,
							btnID: "cl"
						}
					],
					onEnter: "rn",
					func: function (data) {
						if (data.pressed === "rn")
							UI.download(TH, inLoad, reload);
					}
				});
		},
		upload: function (TH, list, destination, reload) {
			var inLoad = [];
			list.all(function (item) {
				var path = PATH(destination, UI.errors),
				url = path.fixUrl(),
				downObj,
				tmp = [-1, -1],
				reloadInfo = 0,
				tm,
				speed,
				per;
				if (BUFFER.downloads[url]) {
					(function newUrl(c) {
						if (BUFFER.downloads[c + "_" + url])
							return newUrl(c + 1);
						url = c + "_" + url;
					})(0);
				}
				BUFFER.downloads[url] = downObj = {
					type: A.start(function () {}, true),
					up: true,
					name: item.name,
					delete : A.start(function () {}, true),
					speed: A.start(function () {}, true),
					downloaded: A.start(function () {}, true),
					xhr: A.start(function () {}, true),
					name: item.name
				};
				downObj.delete.wait(function () {
					var tmpin = downObj.inDownloads;
					tmpin && setTimeout(function () {
						tmpin.remElem();
					}, 1000);
					downObj.inDownloads = undefined;
					delete BUFFER.downloads[url];
				});
				downObj.type.progress(function (vl) {
					downObj.inDownIng && downObj.inDownIng.html(vl.tr);
					if (vl === "complete") {
						downObj.inDownSpeed && downObj.inDownSpeed.html(formatBytes(0)),
						downObj.inDownBar && downObj.inDownBar.css("width", "100%")
						downObj.delete.value = true;
						UI.reloadListsChanges(TH, destination);
					}
					if (vl === "stop" || vl === "error") {
						downObj.inDownSpeed && downObj.inDownSpeed.html(formatBytes(0)),
						downObj.delete.value = true;
					}
				});
				downObj.type.progressValue = "getting size";
				downObj.size = A.start(function () {
						return [item.size, formatBytes(item.size)];
					});
				downObj.download = downObj.size.wait(function () {
						return (downObj.xhr.value = {
								x: path.common("uploadFile", {
									name: item.name,
									index: 0
								}, [item])
							}).x;
					});
				downObj.download.wait(function (vl) {
					console.log(vl);
					downObj.type.value = downObj.speed.value = downObj.downloaded.value = true;
					if (vl === 0)
						return (downObj.type.progressValue = "error", 0);
					vl = vl[0];
					if (vl.type === "ok")
						return downObj.type.progressValue = "complete";
					else {
						console.log(vl);
						return downObj.type.progressValue = "error";
					}
				});
				downObj.download.progress(function (dt) {
					if (dt.type === "abort") {
						return downObj.download.value = 0;
					}
					tm = downObj.size.wait(function (vl) {
							return vl;
						});
					tm.wait(function (vl) {
						if (dt.type === "up" && dt.data.loaded <= vl[0]) {
							downObj.downloaded.progressValue = dt.data.loaded;
							if (tmp[0] > -1) {
								var tmp1 = [tmp[0], tmp[1]],
								tm1 = (tm.time - reloadInfo) > 500;
								speed = (dt.data.loaded - tmp1[1]) / (tm.time - tmp1[0]) * 1000;
								per = dt.data.loaded / vl[0] * 100;
								per > 100 && (per = 100);
								if (tm1)
									reloadInfo = tm.time;
								tm1 && (
									downObj.inDownIng && downObj.inDownIng.html(formatBytes(dt.data.loaded) + "/" + vl[1]),
									downObj.inDownSpeed && downObj.inDownSpeed.html(formatBytes(speed)),
									downObj.inDownBar && downObj.inDownBar.css("width", per + "%"));

								downObj.speed.progressValue = speed;
							}
							tmp[0] = tm.time;
							tmp[1] = dt.data.loaded;
						}
					}).error(console.error);
				});
				BUFFER.loadprocess.reloadDownloads.progressValue = true;
				var downPlace = ".srcplace>[act=downloads]".a();
				if (downPlace) {
					var cont = downPlace.child(".backcontent>f-scrollplane"),
					el = A.createElem("div", {
							_TXT: UI.getAct("uploadsFileSrc")
						}).children[0].pasteIn(cont);
					el.opt({
						_url: url
					});
					el.child(".name").html = item.name;
					downObj.inDownloads = el;
					downObj.inDownSpeed = el.child(".speed");
					downObj.inDownIng = el.child(".downloading");
					downObj.inDownBar = el.child(".bar");

				}
			});
		},
		getLocalFiles: function (TH, multiple, accept) {
			multiple = multiple || TH.attrFromPath("multiple");
			accept = accept || TH.attrFromPath("accept");
			queryFiles(function (files) {
				TH.files = files;
				var txt = "";
				for (var i = 0, len = files.length; i < len; i++) {
					txt += files[i].name + "<br>";
				}
				TH.html = txt;
			}, multiple, accept);
		},
		copyText: function (TH, txt) {
			if (window.clipboardData) {
				window.clipboardData.setData("Text", txt);
			} else {
				var tmpElem = "body".addElem('textarea', {
						_CSS: {
							position: "absolute",
							left: "-1000px",
							top: "-1000px"
						},
						_VAL: txt
					});
				tmpElem.select();
				if (!document.execCommand("copy", false, null))
					UI.dialogPanel({
						content: [{
								type: "message",
								text: "copy instruction".tr
							}, {
								type: "textarea",
								inpID: ".",
								opt: {
									_VAL: txt,
									_INIT: function (a) {
										a.select();
									}
								}
							}, {
								type: "button",
								btntext: "ok".tr,
								btnID: "ok"
							}
						],
						onEnter: "ok"
					});
				tmpElem.remElem();
			}

		}
	});
	/*END*/
})(window.A, window, document);

//var rand=(min=0,max=100)=>Math.floor(Math.random() * (max-min))+min,interval;
//(interval=(l,x)=>{
//	if(l>=10)
//		x=-1;
//	if(l<=0)
//		x=1;
//	"body".css({
//		"clip-path": "polygon("+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%,"+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%,"+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%,"+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%,"+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%, "+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%, "+rand()/rand()*rand()+"% "+l+"%, "+l+"% "+l+"%, "+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%, "+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%, "+rand()/rand()*rand()+"% "+rand()/rand()*rand()+"%)",
//		"transform":"skew("+rand()+"deg)"
//	});
//	setTimeout(interval,rand(1,1000),l+1*x,x);
//})(0,1)
