A({
	resizer: function (staticName) {
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
			e.stopEvent && e.stopEvent();
		},
		setFn = function (replace) {
			requestAnimationFrame(function () {
				var LD = BUFFER.localData.UIStatics;
				!LD[staticName] && (LD[staticName] = []);

				(!LD[staticName][0] || replace) && (LD[staticName][0] = before.opt("style")),
				(!LD[staticName][1] || replace) && (LD[staticName][1] = after.opt("style"));

				before.opt("style", LD[staticName][0]),
				after.opt("style", LD[staticName][1]);
			});
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
			setFn(true);
		});

		setFn();

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
					class: "selector",
					contextfuncs: "."
				});
			coo.start = [e.X, e.Y + a.scrollTop, e.Y],
			coo.x = [],
			coo.y = [],
			coo.h = [],
			coo.w = [],
			coo.a = a.getBoundingClientRect(),
			shift = A._DATA.BJSListeners.keyLis.pressed.indexOf(16) > -1,
			selecting = !!(parentSelector+".selecting").a(),
			a.child(selectedClass, !0, !0).all(function (el, ind) {
				elems.push([el, el.hasClass("selected")]),
				tmp = el.getBoundingClientRect(),
				coo.x.push(tmp.x),
				coo.y.push(tmp.y + a.scrollTop),
				coo.h.push(tmp.height),
				coo.w.push(tmp.width);
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
				(coo.x[ind] + coo.w[ind]) > tmp[2] &&
				(coo.y[ind] + coo.h[ind]) > tmp[3])
				fnForHasElem(el);
			else
				fnForNotHasElem(el);
		},
		setTmp = function (e) {
			tmp = [e.X - coo.start[0], e.Y + a.scrollTop - coo.start[1], coo.start[0], coo.start[1], coo.start[2]],
			tmp[0] < 0 && (tmp[2] -= (tmp[0] = -tmp[0]) -1),
			tmp[1] < 0 && (tmp[3] -= (tmp[1] = -tmp[1]), tmp[4] -= tmp[1] -1),
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
			"html".remClass("NOSELECT");
		};
		a.on("mousedown", function (e) {
			down = true;
			"html".addClass = "NOSELECT";
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
	}
});

/*FUNCS ACTIVATION*/
".upDownPResizer".resizer("udPRes");
".leftRightEResizer".resizer("lrERes");
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
	window.A.on("combination", "ctrl+shift+f", function (e) {
		UI.createFile(document, BUFFER.explorer.curDir);
	}, false);
	window.A.on("combination", "ctrl+shift+d", function (e) {
		UI.createDir(document, BUFFER.explorer.curDir);
	}, false);
	window.A.on("combination", "ctrl+shift+r", function (e) {
		UI.openDir(document, BUFFER.explorer.curDir, "stay");
	}, false);
	window.A.on("combination", "ctrl+shift+o", function (e) {
		UI.dialogPanel({
			content: [{
					type: "message",
					text: "enter path:"
				}, {
					type: "input",
					inpID: "path",
					opt: {
						value: "@ROOT:/",
						_INIT: function (a) {
							a.selectionStart = a.value.length;

						}
					}
				}, {
					type: "button",
					btntext: "open",
					btnID: "open"
				}, {
					type: "button",
					btntext: "cancel",
					btnID: "cancel"
				}
			],
			onEnter: "open",
			func: function (data) {
				if (data.pressed !== "open")
					return;
				if (data.values.path == "")
					return UI.errors(["no name"]);
				UI.setLSToPlace("body", true);
				var url = PATH(data.values.path).fixUrl();
				PATH(url, UI.errors).common("ifEqual", {
					if : [{
							name: "isDir",
							args: {
								url: url
							},
							return : {
								type: "self"
							},
							equal: true
						}
					],
					then: [{
							name: "getList",
							args: {
								url: url
							}
						}
					], else : [{
								name: "getContent",
								args: {
									url: url
								}
							}
						]
			}).wait(function (vl) {
				UI.setLSToPlace("body", false);
				if (vl === 0)
					return;
				vl = vl[0];
				if (vl.type === "then")
					UI.openDir(document, url, url === PATH(BUFFER.explorer.curDir).fixUrl() ? "stay" : "", vl.return);
					else
						UI.openFile(false, url, vl.return[0].content);
				});
			}
		});
	}, false);
})();

".rightexplorer>f-scrollplane".selects(".rightexplorer>f-scrollplane", ".dirPlace");
/*END*/
