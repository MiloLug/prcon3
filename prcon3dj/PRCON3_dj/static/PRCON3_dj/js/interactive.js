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
		A.on("blur", function (e) {
			delstat("hover"),
			delstat("taped");
			elem = false;
		});
	})();
	/*END*/