window.UI.ctx= {
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
							class: "blackbtn txtnowrap" + (el.click === false ? " noclick" : ""),
							_TXT: el.btntext,
							bid: el.btnID,
							ofCtxUID: mUID,
							funcs: el.funcs ? el.funcs : "",
							_LIS: el.click === false ? [] : [{
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
			treeMenu: function (TH, coo, bbl) {
				var list = {
					content: [],
					func: function (data) {
						var pr = data.pressed,
						url = TH.attrFromPath("_url");
						switch (pr) {
						case "reloadInTree":
							UI.reloadListsChanges(TH, url, "tree");
							break;
						}
					}
				};
				if (TH.opt("opened") === "true")
					list.content.push({
						type: "button",
						btntext: "reload",
						btnID: "reloadInTree"
					});
				UI.ctx.openContextmenu(list, coo, bbl);
			},
			dirFileMenu: function (TH, coo, bbl) {
				var sel = TH.hasClass("selected"),
				list = {
					content: [{
							type: "button",
							btntext: "Copy",
							btnID: "copy" + (sel ? "all" : "")
						}, {
							type: "button",
							btntext: "Copy URL",
							btnID: "copyurl"
						}, {
							type: "line",
						}, {
							type: "button",
							btntext: "Delete",
							btnID: "delete"
						}, {
							type: "button",
							btntext: "Rename - d.r.",
							btnID: "rename"
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
									return el.attrFromPath("_url");
								}).return);
							break;
						case "copy":
							BUFFER.explorer.copied = [url];
							break;
						case "copyurl":
							UI.copyText(TH, url);
							break;
						case "copyall":
							BUFFER.explorer.copied = ".dirPlace.selected".all(function (el) {
									return el.attrFromPath("_url");
								}).return;
							break;
						}
					}
				};
				if (sel)
					list.content.push({
						type: "line",
					}, {
						type: "button",
						btntext: "Delete selected",
						btnID: "deleteall"
					}, {
						type: "button",
						btntext: "Rename selected - d.r.",
						btnID: "remaneall"
					});

				UI.ctx.openContextmenu(list, coo, bbl);
			},
			rightexplorer: function (TH, coo, bbl) {
				var list = {
					content: [{
							type: "button",
							btntext: "Create file",
							btnID: "mkfile"
						}, {
							type: "button",
							btntext: "Create dir",
							btnID: "mkdir"
						}, {
							type: "button",
							click: !!BUFFER.explorer.copied.length,
							btntext: "Paste",
							text: "Paste",
							btnID: "paste",
						}, {
							type: "button",
							btntext: "Reload",
							btnID: "reload"
						}
					],
					func: function (data) {
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
							UI.openDir(document, url, "stay");
							break;
						case "paste":
							UI.paste(TH, {
								list: BUFFER.explorer.copied,
								destinationDir: url
							});
							break;
						}
					}
				};
				UI.ctx.openContextmenu(list, coo);
			}
		}