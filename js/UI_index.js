(function (A, window, document) {
	"use strict";
	window.UI.Ainit({
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
		openedFiles: function (TH, url) {
			var back = UI.setSrcToPlace("openedFilesList", true),
			cont = back.child(".backcontent");
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			Object.keys(BUFFER.redactors).all(function (nm, i) {
				cont.addElem("button", {
					funcs: "toTopFileRedactor,easyCancel",
					class: "cls",
					emhover: url === nm ? "." : "",
					_url: nm,
					_TXT: nm
				});
			});
		},
		toTopFileRedactor: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			UI.toTopLayer(BUFFER.redactors[url]);
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
									_INIT: function(el){
                                      	el[dec.compareBy]=buffSett[dec.param.name] || ""
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
				onEnter: "ok",
				func: function (req) {
					if (req.pressed === "ok") {
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
			return (BUFFER.loadprocess.openDir = BUFFER.loadprocess.openDir.wait(function (non, rW) {
						var RE = ".rightexplorer>f-scrollplane";
						url = PATH(url || (TH ? TH.attrFromPath("_url") : false) || BUFFER.explorer.curDir).fixUrl();
						UI.setLSToPlace(".rightexplorer", true);
						var path = PATH(url, UI.errors);
						(list ? A.start(function () {
								return list;
							}) : path.common("getList")).wait(function (d) {
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
							RE.opt("_url", url);
							rW.value = 1;
						});
					}, true));
		},
		fileEditor: function (fn, args, windowed) {
			if (BUFFER.localData.settings.fileEditor) {
				var red = FILE_REDACTORS_INIT[BUFFER.localData.settings.fileEditor];
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
						text: "Do you want to close this file?<br>" + url
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
					UI.fileEditor("close", [TH, url]);
				}
			});
		},
		openFile: function (TH, url, content) {
          	var windowed=!BUFFER.localData.settings.defaultFileEditorType;
			UI.fileEditor("edit", [TH, url, content], windowed);
		},
		saveFile: function (TH, url) {
			url = PATH(url || TH.attrFromPath("_url")).fixUrl();
			if (!url)
				return;
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "Do you want to save this file?<br>" + url
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
				dataType: "json",
				data: {
					acc: row,
					funcs: [{
							name: "login"
						}
					]
				},
				success: function (d) {
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
		sendLogin: function (TH, ftp, log, pass, urlPhp, urlFtp) {
			log = log || ".back .login".val(),
			pass = pass || ".back .pass".val(),
			ftp && (
				urlPhp = urlPhp || ".back .urlPhp".val(),
				urlFtp = urlFtp || ".back .urlFtp".val()),
			UI.setLSToPlace("body", true);
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
				onEnter: "yes",
				func: function (data) {
					if (data.pressed !== "yes")
						return;
					url = url || TH.attrFromPath("_url"),
					path = PATH(url, UI.errors),
					path.common("delete").wait(function (vl, W) {
						UI.reloadListsChanges(TH, path.parentDir);
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
				onEnter: "yes",
				func: function (data) {
					if (data.pressed !== "yes")
						return;
					var parent = PATH(list[0]).parentDir;
					PATH(parent, UI.errors).common("deleteList", {
						list: list
					}).wait(function (vl, W) {
						UI.reloadListsChanges(TH, parent);
					});
				}
			});
		},
		createDir: function (TH, url) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "Enter dir name:"
					}, {
						type: "input",
						inpID: "name",
						opt: {
							placeholder: "new dir"
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
						if (vl.type === "requery" && vl.info === "obj exists")
							return UI.errors(["already exists"]);
						UI.reloadListsChanges(TH, path.url);
					});
				}
			});
		},
		createFile: function (TH, url) {
			UI.dialogPanel({
				content: [{
						type: "message",
						text: "Enter file name:"
					}, {
						type: "input",
						inpID: "name",
						opt: {
							placeholder: "new file"
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
						if (vl.type === "requery" && vl.info === "obj exists")
							return UI.errors(["already exists"]);
						UI.reloadListsChanges(TH, path.url);
					});
				}
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
							text: "not copied:<br>" + errs.join("<br>")
						}, {
							type: "button",
							btntext: "ok",
							btnID: "ok"
						}
					]
				});

				ok.length && UI.reloadListsChanges(TH, args.destinationDir);
			});
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
								text: "Copy to clipboard: Ctrl C, Enter"
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
								btntext: "ok",
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
