/**
BJSEvents v 1.0.0 (in develop) -beta -full
No copyright
Prev define version: -
 **/

(window._BJSEventsInitF= function (W) {
	W.Ainit({
		StopEvent: function (e, touch) {
			return function () {
				!touch && e.preventDefault && e.preventDefault(),
				e.stopPropagation && e.stopPropagation(),
				e.cancelBubble = true,
				e.returnValue = false,
				e.stopImmediatePropagation && e.stopImmediatePropagation();
			};
		},
		TouchMouseEvent: function (e, path, touch) {
			if (e.constructor === W.TouchMouseEvent)
				this.Ainit(e,W);
			else
				this.Ainit(new W.BJSEvent(e, path, touch),W);
		},
		KeyCombinationEvent: function (e, path) {
			if (e.constructor === W.KeyCombinationEvent)
				this.Ainit(e,W);
			else
				this.Ainit(new W.BJSEvent(e, path, false),W),
				this.combination = e.combination,
				this.repeat = e.repeat,
				this.key = e.key,
				this.keyCode = e.keyCode;
		},
		ResizeEvent: function (e, path, touch) {
			if (e.constructor === W.ResizeEvent)
				this.Ainit(e,W);
			else
				this.Ainit(new W.BJSEvent(e, path, touch),W);
		},
		BJSEvent: function (e, path, touch) {
			var tmp;
			if (e.constructor === W.BJSEvent)
				this.Ainit(e,W);
			else
				tmp = W.A.cPos(e),
				tmp.l !== "X" && (this.X = tmp.l),
				tmp.t !== "Y" && (this.Y = tmp.t),
				tmp = path || e.path || (e.srcElement || e.target || e.toElement || e.fromElement || e.relatedTarget || {}).path || [],
				this.path = tmp,
				this.toElement = tmp[0],
				this.touch = touch || (touch = !!(W.TouchEvent && e.constructor === W.TouchEvent)),
				this.stopEvent = W.StopEvent(e, touch),
				this.origin = e,
				!W.A.isEmpty(e.height) && (this.height = e.height),
				!W.A.isEmpty(e.width) && (this.width = e.width);
		}
	});

	var DT = W.A._DATA,
	AT = W.A._TEMP,
	LL;

	DT.opt_spec.keys.push("_LIS");
	DT.opt_spec.funcs._LIS = "LisTree";

	DT.BJSListeners = {};
	DT = DT.BJSListeners;

	DT.keyCodes_spec = {
		backspace: 8,
		tab: 9,
		clear: 12,
		enter: 13,
		'return': 13,
		esc: 27,
		escape: 27,
		space: 32,
		left: 37,
		up: 38,
		right: 39,
		down: 40,
		del: 46,
		'delete': 46,
		home: 36,
		end: 35,
		pageup: 33,
		pagedown: 34,
		shift: 16,
		alt: 18,
		option: 18,
		ctrl: 17,
		control: 17,
		command: 91,
		',': 188,
		'.': 190,
		'/': 191,
		'`': 192,
		'-': 189,
		'=': 187,
		';': 186,
		'\'': 222,
		'[': 219,
		']': 221,
		'\\': 220
	};
	for (var k = 1; k < 20; k++)
		DT.keyCodes_spec['f' + k] = 111 + k;
	AT.addLisSeq = {};
	DT.ListenersList = {};
	LL = DT.ListenersList;

	W.A({
		emitEvent: function (ev, e, exp) {
			var a = this;
			A.isEmpty(a.a()) && A.error(A.errs.E_1);

			if (LL[ev])
				LL[ev].emitter(a, ev, e, exp);

			return a;
		},
		on: function (ev, func, s, exp, params) {
			/**создать слушателя.
			работает аналогично .addEventListener()
			автоматически определят наличие мыши(используя A.sensor) и использует mouse или touch события
			Дополнения:
			"combination"- аргументы func, ft и ft1 используются как keys, func и ft для .addKeyListener()
			 **/
			var a = this;
			s = W.A.args({
					strict: !A.isEmpty(s) && s.constructor !== W.Object ? !!s : false,
					level: A.isEmpty(s) || s.constructor !== W.Object || A.isEmpty(s.level) ? Infinity : null,
					prevl: s
				}, s);

			A.isEmpty(a.a()) && A.error(A.errs.E_1);

			if (LL[ev])
				LL[ev].adder(a, ev, func, s, exp);
			else
				a.a().addEventListener(ev, func, s.prevl);
			return a;
		},
		not: function (ev, func, exp) {
			/**удалить слушателя.
			работает аналогично .removeEventListener()
			 **/
			var a = this;
			A.isEmpty(a.a()) && A.error(A.errs.E_1);

			if (LL[ev])
				LL[ev].remover(a, ev, func, exp);
			else
				a.a().removeEventListener(ev, func);
			return a;
		},
		addLisData: function (lis, func, s, ev) {
			var a = this.a(),
			fin;
			!AT.addLisSeq[lis] && (AT.addLisSeq[lis] = A.start());
			return (AT.addLisSeq[lis] = AT.addLisSeq[lis].wait(function () {
						!DT[lis] && (DT[lis] = {
								element: [],
								funcs: [],
								listener: false
							});
						fin = DT[lis].element.indexOf(a);
						if (fin > -1) {
							DT[lis].funcs[fin].push([func, s, ev]);
						} else {
							DT[lis].funcs.push([[func, s, ev]]);
							DT[lis].element.push(a);
						}
					}));
		},
		remLisData: function (lis, func, rem) {
			var a = this.a(),
			fin;
			!AT.addLisSeq[lis] && (AT.addLisSeq[lis] = A.start());
			return (AT.addLisSeq[lis] = AT.addLisSeq[lis].wait(function () {
						fin = DT[lis].element.indexOf(a);
						if (fin > -1)
							func === true ?
							(DT[lis].funcs[fin] = []) :
							(rem = function () {
								var finfun = 0;
								DT[lis].funcs[fin].all(function (fn, i) {
									if (fn[0] === func) {
										DT[lis].funcs[fin].splice(i, 1);
										finfun++;
										return "break";
									}
								}, "break");

								finfun && rem();
							})();
						if (DT[lis].funcs[fin] && DT[lis].funcs[fin].length < 1)
							DT[lis].funcs.splice(fin, 1),
							DT[lis].element.splice(fin, 1);
						return a;
					}));
		},
		activateLis: function (e, lis, cur, eventConstrcutor) {
			var els = e.path || (e.srcElement || e.target || e.toElement || e.fromElement || e.relatedTarget).path,
			tmp;
			DT[lis]&&DT[lis].element.all(function (el, ind) {
				if ((tmp = els.indexOf(el)) > -1) {
					DT[lis].funcs[ind].all(function (fn) {
						if (fn[1].level < tmp)
							return;
						if (fn[1].strict ? fn[2] === cur : true)
							fn[0](new eventConstrcutor(e, els));
					});
				}
			});
		},
		LisTree: function setgetfun(act) {
			/**добавление сразу нескольких слушателей(вспомогательная функция для .opt()).
			в качестве аргумента принимает массив или объект следующего вида:{
			_ADD:[{listener:function},{listener:function}
			....
			],
			_REM:[{listener:function},{listener:function}
			....
			]
			}
			_ADD добавляет новые слушатели
			так же можно добавлять сразу несколь слушателей с одной функцией:{"lis0,lis1,lis2":function} если нужны другие аргументы для слушателя, то они передаются в массиве вместе в функцией {"lis1,2,3..":[function,arg1,2,3...]}
			_REM удаляет нужные слушатели, можно удалить так же несколько слушателей, как и с _ADD, так же может принимать другие аргументы в массиве
			если act- массив, то будет использовано _ADD
			функция возвращает a
			 **/
			var a = this.a(),
			key,
			liss,
			tmp;
			act = A.args({
					_ADD: !A.isEmpty(act) && act.__typeOfThis__ === "Array" ? act : [],
					_REM: []
				}, act);
			act._ADD.all(function (obj) {
				for (key in obj)
					liss = key.split(","),
					tmp = obj[key].__typeOfThis__ !== "Array" ? [obj[key]] : obj[key],
					liss.all(function (lis) {
						tmp.unshift(lis);
						a.on.apply(a, tmp);
					});
			});
			act._REM.all(function (obj) {
				for (key in obj)
					liss = key.split(","),
					tmp = obj[key].__typeOfThis__ !== "Array" ? [obj[key]] : obj[key],
					liss.all(function (lis) {
						tmp.unshift(lis);
						a.not.apply(a, tmp);
					});
			});
			return a;
		},
		getKeyCode: function (x) {
			return DT.keyCodes_spec[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
		}
	},W);
	LL.click = LL.touch = {
		lisData: "mclickLis",
		remover: function (a, ev, func, exp) {
			a.remLisData(this.lisData, func);
		},
		emitter: function (a, ev, e, exp) {
			var s = e || {
				clientX: 0,
				clientY: 0,
				path: a.path
			};
			s.path = s.path || a.path;
			W.A.activateLis(new BJSEvent(s, s.path, s.__typeOfThis__ === "Object" ? ev === "touch" : false), this.lisData, ev, W.TouchMouseEvent);
		},
		adder: function (a, ev, func, s, exp) {
			var lis = this.lisData,
			params = {
				timeTouchToContext: 400,
				moveDistanceForNotClick: 3,
				timeClickToClick: 3
			};
			a.addLisData(lis, func, s, ev).wait(function () {
				if (!DT[lis].listener) {
					DT[lis].listener = !0;
					var down = false,
					move = 0,
					time = {},
					waits = A.start(),
					rep = function () {
						return (waits = waits.wait(function () {
									return (down = false, move = 0, 0);
								}));
					},
					fun = function (e, t) {
						var fm = move,
						fd = down;
						fd && fm < params.moveDistanceForNotClick && A.start(function () {
							A.activateLis(e, lis, t, TouchMouseEvent);
						}).error(console.error);
					},
					clickFun = function (e) {
						waits = waits.wait(function (vl) {
								if (vl === 1)
									fun(e, "click");
							});
						rep();
					};
					W.A.on("touchend", function (e) {
						waits = waits.wait(function (vl) {
								if (vl === 2 && time())
									fun(e, "touch");
							});
						rep();
					}, true);
					W.A.on("mouseup", function (e) {
						(function interval(t) {
							if (t >= params.timeClickToClick)
								return clickFun(e);
							setTimeout(function () {
								interval(t + 1);
							}, 1);
						})(0);
					}, true);
					W.A.on("mousedown", function (e) {
						waits = waits.wait(function () {
								return 1;
							});
						down = true;
					}, true),
					W.A.on("touchstart", function (e) {
						waits = waits.wait(function () {
								return 2;
							});
						down = true;
						var flagTime = true;
						setTimeout(function () {
							flagTime = false;
						}, params.timeTouchToContext);
						time = function () {
							return flagTime;
						};
					}, true),
					W.A.on("mousemove", function (e) {
						move <= (params.moveDistanceForNotClick + 1) && down && move++;
					}),
					W.addEventListener("contextmenu", rep, false),
					W.addEventListener("dragend", rep, false),
					W.addEventListener("dragstart", rep, false);
				}
			});
		}
	};
	LL.touchstart = LL.mousedown = {
		lisData: "tmdownLis",
		remover: function (a, ev, func, exp) {
			a.remLisData(this.lisData, func);
		},
		emitter: function (a, ev, e, exp) {
			var s = e || {
				clientX: 0,
				clientY: 0,
				path: a.path
			};
			s.path = s.path || a.path;
			A.activateLis(new BJSEvent(s, s.path, s.__typeOfThis__ === "Object" ? ev === "touchstart" : false), this.lisData, ev, TouchMouseEvent);
		},
		adder: function (a, ev, func, s, exp) {
			var lis = this.lisData;
			a.addLisData(lis, func, s, ev).wait(function () {
				if (!DT[lis].listener) {
					DT[lis].listener = !0;
					var touch = mouse = tend = mv = false,
					fun = function (e, t) {
						A.start(function () {
							A.activateLis(e, lis, t, TouchMouseEvent);
						}).error(console.error);
					};
					W.addEventListener("touchstart", function (e) {
						if (mouse)
							return;
						touch = true;
						fun(e, "touchstart");
					},false);
					W.addEventListener("mousedown", function (e) {
						if (touch || tend)
							return (tend = false);
						mouse = true;
						fun(e, "mousedown");
					},false);
					W.addEventListener("mouseup", function (e) {
						touch = mouse = false;
					},false);
					W.addEventListener("touchend", function (e) {
						tend = !mv;
						mouse = touch = mv = false;
					},false);
					W.addEventListener("dragend", function () {
						touch = mouse = false;
					}, false);
					W.addEventListener("touchmove", function () {
						mv = true;
					},false);
				}
			});
		}
	};
	LL.mousemove = LL.touchmove = {
		lisData: "tmmoveLis",
		remover: function (a, ev, func, exp) {
			a.remLisData(this.lisData, func);
		},
		emitter: function (a, ev, e, exp) {
			var s = e || {
				clientX: 0,
				clientY: 0,
				path: a.path
			};
			s.path = s.path || a.path;
			A.activateLis(new BJSEvent(s, s.path, s.__typeOfThis__ === "Object" ? ev === "touchmove" : false), this.lisData, ev, TouchMouseEvent);
		},
		adder: function (a, ev, func, s, exp) {
			var lis = this.lisData;
			a.addLisData(lis, func, s, ev).wait(function () {
				if (!DT[lis].listener) {
					DT[lis].listener = !0;
					var touch = alw = up = false,
					fun = function (e, t) {
						A.start(function () {
							A.activateLis(e, lis, t, TouchMouseEvent);
						}).error(console.error);
					};
					W.A.on("touchstart", function (e) {
						touch = alw = true;
					}, true),
					W.addEventListener("touchmove", function (e) {
						if (!touch || !alw)
							return;
						fun(e, "touchmove");
					}),
					W.addEventListener("mousemove", function (e) {
						if (touch || up)
							return (up = false);
						fun(e, "mousemove");
					}, false),
					W.A.on("mouseup", function () {
						alw = false,
						touch = false,
						up = true;
					});
				}
			});
		}
	};
	LL.mouseup = LL.touchend = {
		lisData: "tmupLis",
		remover: function (a, ev, func, exp) {
			a.remLisData(this.lisData, func);
		},
		emitter: function (a, ev, e, exp) {
			var s = e || {
				clientX: 0,
				clientY: 0,
				path: a.path
			};
			s.path = s.path || a.path;
			A.activateLis(new BJSEvent(s, s.path, s.__typeOfThis__ === "Object" ? ev === "touchend" : false), this.lisData, ev, TouchMouseEvent);
		},
		adder: function (a, ev, func, s, exp) {
			var lis = this.lisData;
			a.addLisData(lis, func, s, ev).wait(function () {
				if (!DT[lis].listener) {
					DT[lis].listener = !0;
					var waits = A.start(),
					fun = function (e) {
						waits = waits.wait(function (vl) {
								if (vl !== 0)
									A.start(function () {
										A.activateLis(e, lis, (vl === 1 ? "mouseup" : "touchend"), TouchMouseEvent);
									}).error(console.error);
								return 0;
							});
					};
					W.A.on("mousedown", function (e) {
						waits = waits.wait(function () {
								return 1;
							});
					}, true);
					W.A.on("touchstart", function (e) {
						waits = waits.wait(function () {
								return 2;
							});
					}, true);
					W.addEventListener("mouseup", fun, false);
					W.addEventListener("touchend", fun, false);

					W.addEventListener("dragend", fun, false);
				}
			});
		}
	};
	LL.combination = {
		lisData: "keyLis",
		remover: function (a, ev, func, exp) {
			var lis = this.lisData,
			tmp,
			keys = func.almostArray ? func : func.split("+").all(function (k) {
					return A.getKeyCode(k);
				}).return,
			tmpFunc = [a.a()];
			!AT.addLisSeq[lis] && (AT.addLisSeq[lis] = A.start());
			AT.addLisSeq[lis] = AT.addLisSeq[lis].wait(function () {
					if ((keys = DT[lis].combins.fined(keys)) < 0 || (tmp = DT[lis].funcs[keys].fined(tmpFunc)) < 0)
						return;
					DT[lis].funcs[keys].splice(tmp, 1);
					if (DT[lis].funcs[keys].length < 1)
						DT[lis].funcs.splice(keys, 1),
						DT[lis].combins.splice(keys, 1);
				});
		},
		emitter: function (a, ev, e, exp) {
			var lis = this.lisData,
			keys = e.split("+").all(function (k) {
					return A.getKeyCode(k);
				}).return,
			fin,
			s = A.args({
					clientX: 0,
					clientY: 0,
					path: a.path
				}, exp);
			if ((fin = DT[lis].combins.fined(keys)) < 0)
				return;
			s.combination = DT[lis].combins[fin];

			DT[lis].funcs[fin].all(function (fn) {
				var path = s.path;
				if (path.indexOf(fn[0]) < 0)
					return;
				fn.keyListenerFunction(new KeyCombinationEvent(s, path));
			});
			return false;
		},
		adder: function (a, ev, func, s, exp) {
			var lis = this.lisData,
			tmp,
			keys = func.split("+").all(function (k) {
					return A.getKeyCode(k);
				}).return,
			tmpFunc;
			if (!DT[lis])
				DT[lis] = {
					combins: [],
					funcs: [],
					pressed: [],
					listener: false
				};
			!AT.addLisSeq[lis] && (AT.addLisSeq[lis] = A.start());
			AT.addLisSeq[lis] = AT.addLisSeq[lis].wait(function () {
					tmpFunc = (tmp = [a.a()], tmp.keyPrevHandler = A.isEmpty(exp) ? true : !!exp, tmp.keyListenerFunction = s.prevl, tmp);
					if ((tmp = DT[lis].combins.fined(keys)) < 0)
						DT[lis].funcs.push([tmpFunc]),
						DT[lis].combins.push(keys);
					else
						DT[lis].funcs[tmp].push(tmpFunc);

					if (DT[lis].listener)
						return;
					DT[lis].listener = !0;

					var waits = A.start();
					W.addEventListener("keydown", function (e, fin) {
						if (DT[lis].pressed.indexOf(e.keyCode) < 0)
							DT[lis].pressed.push(e.keyCode);
						DT[lis].pressed.clearArrFull;

						if ((fin = DT[lis].combins.fined(DT[lis].pressed)) < 0)
							return;
						e.combination = DT[lis].combins[fin];

						DT[lis].funcs[fin].all(function (fn) {
							var path = e.path || (e.srcElement || e.target || e.toElement || e.fromElement || e.relatedTarget).path;
							if (path.indexOf(fn[0]) < 0)
								return;
							fn.keyListenerFunction(new KeyCombinationEvent(e, path)),
							!fn.keyPrevHandler && StopEvent(e)();
						});
					}, true);
					W.addEventListener("keyup", function (e, fin) {
						if ((fin = DT[lis].pressed.indexOf(e.keyCode)) > -1)
							DT[lis].pressed.splice(fin, 1);
					}, true);
					W.addEventListener("focus", function () {
						DT[lis].pressed = [];
					}, true);
				});
		}
	};
	LL.resize = {
		lisData: "resLis",
		remover: function (a, ev, func, exp) {
			var lis = this.lisData;
			a.remLisData(lis, func).wait(function () {
				if (DT[lis].element.indexOf(a) < 0)
					a.child("[bjs-it_is=onresizer]", false, true).remElem();
			});
		},
		emitter: function (a, ev, e, exp) {
			var s = A.args({
					width: 0,
					height: 0
				}, e),
			lis = this.lisData;
			A.start(function () {
				A.activateLis({
					height: s.height,
					width: s.width,
					toElement: a.a()
				}, lis, "resize", ResizeEvent);
			}).error(function (err) {
				console.error(err);
			});
		},
		adder: function (a, ev, func, s, exp) {
			var lis = this.lisData,
			res = a.child("[bjs-it_is=onresizer]", false, true);
			if (!res)
				res = a.addElem("iframe", {
						_CSS: {
							width: "100%",
							height: "100%",
							position: "absolute",
							transform: "scale(0)",
							top: 0,
							left: 0
						},
						seamless: " ",
						sandbox: "allow-scripts allow-same-origin",
						"bjs-it_is": "onresizer"
					}),
				res.contentWindow.onresize = function () {
					A.start(function () {
						A.activateLis({
							height: res.contentWindow.innerHeight,
							width: res.contentWindow.innerWidth,
							toElement: a.a()
						}, lis, "resize", ResizeEvent);
					}).error(function (err) {
						console.error(err);
					});
				};
			a.addLisData(lis, func, s, ev);
		}
	};
	(function cleaner() {
		for (var nm in DT) {
			if (nm === "keyCodes_spec" || nm === "ListenersList")
				continue;
			if (nm === "keyLis") {
				DT[nm].funcs.all(function (fn, ind) {
					fn.all(function (fn2, ind2) {
						if (fn2[0] === window || fn2[0] === document || W.document.contains(fn2[0]))
							return;
						fn2[0].not("combination", DT[nm].combins[ind], fn2.keyListenerFunction);
					});
				});
				continue;
			}
			DT[nm].element.all(function (el, ind) {
				if (el === window || el === document || W.document.contains(el))
					return;
				el.remLisData(nm, true);
			});
		};
		setTimeout(cleaner, 10000);
	})();
})(window);
