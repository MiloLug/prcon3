window.UI.ctx = {
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
				btntext: "Reload".tr,
				btnID: "reloadInTree"
			});
		UI.ctx.openContextmenu(list, coo, bbl);
	},
	dirFileMenu: function (TH, coo, bbl) {
		var sel = TH.hasClass("selected"),
		url = TH.attrFromPath("_url"),
		exp = PATH(url).divNameExt()[1],
		type = TH.attrFromPath("_type"),
		list = ".dirPlace.selected".all(function (el) {
				return el.attrFromPath("_url");
			}).return,
		content = {
			content: [type==="file"?{
					type: "button",
					btntext: "Edit".tr,
					btnID: "edit" + (sel ? "all" : "")
				}:{}, {
					type: "button",
					btntext: "Copy".tr,
					btnID: "copy" + (sel ? "all" : "")
				}, {
					type: "button",
					btntext: "Cut".tr,
					btnID: "cut" + (sel ? "all" : "")
				}, {
					type: "button",
					btntext: "Copy".tr+" URL",
					btnID: "copyurl" + (sel ? "all" : "")
				}, type === "dir" ? {
					type: "button",
					click: !!BUFFER.explorer.copied.length,
					btntext: "Paste".tr,
					btnID: "paste"
				}
				 : {}, type === "file" ? {
					type: "button",
					btntext: "Download".tr,
					btnID: "download" + (sel ? "all" : "")
				}
				 : {}, {
					type: "line",
				}, {
					type: "button",
					btntext: "Add to archive".tr,
					btnID: "addZip" + (sel ? "all" : "")
				}, exp === "zip" ? {
					type: "button",
					btntext: "Exzip".tr,
					btnID: "exzip"
				}
				 : {}, {
					type: "line",
				}, {
					type: "button",
					btntext: "Delete".tr,
					btnID: "delete" + (sel ? "all" : "")
				}, {
					type: "button",
					btntext: "Rename".tr,
					btnID: "rename" + (sel ? "all" : "")
				}
			],
			func: function (data) {
				switch (data.pressed) {
				case "delete":
					UI.deleteDirFile(TH, url);
					break;
				case "edit":
					UI.openFile(TH, url);
					break;
				case "editall":
					".dirPlace.selected".all(function (el) {
						el.attrFromPath("_type") === "file" && UI.openFile(TH, el.attrFromPath("_url"));
					});
					break;
				case "deleteall":
					UI.deleteAllList(TH, list);
					break;
				case "copy":
					BUFFER.explorer.copied = [url];
					BUFFER.explorer.copiedCut = false;
					break;
				case "cut":
					BUFFER.explorer.copied = [url];
					BUFFER.explorer.copiedCut = true;
					break;
				case "cutall":
					BUFFER.explorer.copied = list;
					BUFFER.explorer.copiedCut = true;
					break;
				case "copyurl":
					UI.copyText(TH, url);
					break;
				case "copyurlall":
					UI.copyText(TH, list.join("\n"));
					break;
				case "copyall":
					BUFFER.explorer.copied = list;
					BUFFER.explorer.copiedCut = false;
					break;
				case "paste":
					UI.paste(TH, {
						list: BUFFER.explorer.copied,
						destinationDir: url,
						deleteSource: BUFFER.explorer.copiedCut
					});
					break;
				case "addZip":
					UI.createZip(TH, PATH(url).parentDir, [url]);
					break;
				case "addZipall":
					UI.createZip(TH, PATH(list[0]).parentDir, list);
					break;
				case "rename":
					var tmpP = PATH(url);
					UI.rename(TH, tmpP.parentDir, [tmpP.name]);
					break;
				case "renameall":
					UI.rename(TH, PATH(list[0]).parentDir, list.all(function (el) {
							return PATH(el).name;
						}).return);
					break;
				case "download":
					UI.download(TH, [url]);
					break;
				case "downloadall":
					list = [];
					".dirPlace.selected".all(function (el) {
						el.attrFromPath("_type") === "file" && list.push(el.attrFromPath("_url"));
					});
					UI.download(TH, list);
					break;
				case "exzip":
					UI.extractZip(TH, url);
					break;
				}
			}
		};
		UI.ctx.openContextmenu(content, coo, bbl);
	},
	rightexplorer: function (TH, coo, bbl) {
		var list = {
			content: [{
					type: "button",
					btntext: "Create file".tr,
					btnID: "mkfile"
				}, {
					type: "button",
					btntext: "Create dir".tr,
					btnID: "mkdir"
				}, {
					type: "button",
					click: !!BUFFER.explorer.copied.length,
					btntext: "Paste".tr,
					btnID: "paste",
				}, {
					type: "button",
					btntext: "Reload".tr,
					btnID: "reload"
				}, {
					type: "button",
					btntext: "Upload".tr,
					btnID: "upload"
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
				case "upload":
					UI.dialogPanel({
						content: [{
								type: "message",
								text: "select files".tr + ":"
							}, {
								type: "uploader",
								upltext: "...",
								uplID: "files",
								multiple: true
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
							if (data.pressed !== "ok" || !data.fileLists.files[0])
								return;
							var arr = [],
							files = data.fileLists.files;
							for (var i = 0, len = files.length; i < len; i++) {
								arr.push(files[i]);
							}
							UI.upload(TH, arr, url);
						}
					});
					break;
				case "paste":
					UI.paste(TH, {
						list: BUFFER.explorer.copied,
						destinationDir: url,
						deleteSource: BUFFER.explorer.copiedCut
					});
					break;
				}
			}
		};
		UI.ctx.openContextmenu(list, coo);
	},
	loginLocalListItem:function(TH,coo,bbl){
		var sel = TH.hasClass("selected"),
		thname = TH.opt("name"),
		names = "[act=loginLocal] .forsel.selected".all(function (el) {
				return el.opt("name");
			}).return,
		list = {
			content: [{
					type: "button",
					btntext: "Delete".tr,
					btnID: "del"
				}
			],
			func: function (data) {
				var pr = data.pressed;
				switch (pr) {
				case "del":
					UI.deleteAccs(TH,sel?names:[thname]);
					break;
				}
			}
		};
		UI.ctx.openContextmenu(list, coo);
	}
}
