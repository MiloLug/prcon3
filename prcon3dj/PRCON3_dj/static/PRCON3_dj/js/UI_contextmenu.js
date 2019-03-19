window.addEventListener("contextmenu", function (e, ccount) {   
		e = new BJSEvent(e);
		".contextmenu".all(function (cm) {
			UI.ctx.closeContextmenu(cm.opt("uid"));
		});
		ccount = 0;
		e.path.all(function (TH, ind, FN) {
			if (TH === document)
				return "break";
			FN = TH.opt("contextfuncs");
			if (FN===null || (ind > 0 && !TH.opt("bubblecontext")) || (ccount > 0 && !TH.opt("mergecontext")))
				return "continue";
          	e.origin.preventDefault();
			FN = FN.split(","),
			FN.all(function (fun, fnInd) {
				fun=fun.trim();
				return fun&&UI.ctx[fun](TH, e, ccount > 0 || fnInd > 0);
			}, "break", "continue");
			ccount = 1;
		}, "break", "continue");
	});
	A.on("mousedown", function (e, tmp) {
		tmp = ".contextmenu".a();
		if (tmp && e.path.indexOf(tmp) < 0)
			UI.ctx.closeContextmenu(tmp.opt("uid"));
	});
