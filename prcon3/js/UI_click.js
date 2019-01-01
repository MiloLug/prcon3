A.on("click", function (e) {
		e.path.all(function (TH) {
			var FN = TH.errored(function (t) {
					return t !== document && t !== window;
				}).opt("funcs");
			if (FN === errored || !FN)
				return "continue";
			FN = FN.split(",");
			FN.all(function (fun) {
				return UI[fun.trim()](TH);
			}, "break", "continue");
		});
	});