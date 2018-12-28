window.Preprocess = function (commands, punctuation, txt) {
	var req = {
		commandStart: -1,
		bodyStart: -1,
		end: -1
	},
	splittxt = txt.split(""),
	pn = {
		commandStart: punctuation.start.split(""),
		bodyStart: punctuation.bodyStart.split(""),
		end: punctuation.end.split("")
	},
	proc = function(i,s,tmp,prop){
		req[prop] = i;
		for (var i2 = 1, len2 = pn[prop].length, s2; (s2 = pn[prop][i2], i2 < len2); i2++) {
			tmp = i + i2;
			if (s2 !== splittxt[tmp]) {
				req[prop] = -1;
				break;
			}
			req[prop] = tmp;
		}
		return tmp;
	};
	root: for (var i = 0, len = splittxt.length, s, tmp; (s = splittxt[i], tmp = i, i < len); i++) {
		if (req.commandStart > -1 && req.bodyStart > -1 && req.end > -1)
			break;
      	if (s === pn.end[0]) {
			if (req.bodyStart > -1) {
              	i=proc(i,s,tmp,"end");
				continue root;
			}
		}
		if (s === pn.bodyStart[0]) {
			if (req.commandStart > -1) {
				i=proc(i,s,tmp,"bodyStart");
				continue root;
			}
		}
		if (s === pn.commandStart[0]) {
			if (req.bodyStart < 0) {
				i=proc(i,s,tmp,"commandStart");
				continue root;
			}
		}
	}
  	if (!(req.commandStart > -1 && req.bodyStart > -1 && req.end > -1))
		return txt;

	req.body = splittxt.slice(req.bodyStart +1, req.end +1 - pn.end.length).join("");
	req.command = splittxt.slice(req.commandStart +1, req.bodyStart - pn.bodyStart.length +1).join("").trim();
	req.full = splittxt.slice(req.commandStart - pn.commandStart.length +1, req.end +1).join("");
	
	req.prepr = Preprocess(commands, punctuation, req.body);
	req.return = commands[req.command] ? commands[req.command](req.prepr) : req.prepr;
	req.repl = txt.replace(req.full, req.return);

	return Preprocess(commands, punctuation, req.repl);
}
