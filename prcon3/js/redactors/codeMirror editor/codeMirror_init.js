(function(W){
  	var s = BUFFER.localData.settings,
	CMP = CUR_REDACTOR_PATH + "codeMirror/";
	A.include("css", [
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/codemirror.min.css",
			s.HCODE_T === "bespin" ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/theme/bespin.min.css" : "",
			s.HCODE_T === "isotope" ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/theme/isotope.min.css" : "",
			s.HCODE_F ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/foldgutter.min.css" : "",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/dialog/dialog.min.css",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/hint/show-hint.min.css",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/lint/lint.min.css"
		]);
	A.include("js", "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/codemirror.min.js");

	s.HCODE_F && A.include("js", [
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/foldcode.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/foldgutter.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/brace-fold.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/xml-fold.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/indent-fold.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/markdown-fold.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/fold/comment-fold.min.js"
		]);
	A.include("js", [
			s.HCODE_H_XML ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/xml/xml.min.js" : "",
			s.HCODE_H_XML && s.HCODE_H_HTML ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/htmlmixed/htmlmixed.min.js" : "",
			s.HCODE_H_javascript ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/javascript/javascript.min.js" : "",
			s.HCODE_H_CSS ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/css/css.min.js" : "",
			s.HCODE_H_Clike ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/clike/clike.min.js" : "",
			s.HCODE_H_python ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/python/python.min.js" : "",
			s.HCODE_H_markdown ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/markdown/markdown.min.js" : "",
			s.HCODE_H_XML && s.HCODE_H_HTML && s.HCODE_H_javascript && s.HCODE_H_CSS && s.HCODE_H_PHP ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/php/php.min.js" : "",
			s.HCODE_H_coffeescript ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/coffeescript/coffeescript.min.js" : "",
			s.HCODE_H_SASS ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/mode/sass/sass.min.js" : "",

			s.HCODE_A_brackets ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/edit/closebrackets.min.js" : "",
			s.HCODE_M_brackets ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/edit/matchbrackets.min.js" : "",
			s.HCODE_A_tags ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/edit/closetag.min.js" : "",
			s.HCODE_M_tags ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/edit/matchtags.min.js" : "",

			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/dialog/dialog.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/search/search.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/search/searchcursor.min.js",
			"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/lint/lint.min.js",

			s.HCODE_L_javascript ? "https://cdnjs.cloudflare.com/ajax/libs/jshint/2.9.6/jshint.min.js" : "",
			s.HCODE_L_CSS ? "https://unpkg.com/csslint@1.0.5/dist/csslint.js" : "",
			s.HCODE_L_PHP ? CMP + "PHP.hint.js" : "",
			s.HCODE_L_HTML ? CMP + "HTML.hint.js" : "",
			s.HCODE_L_JSON ? "https://unpkg.com/jsonlint@1.6.3/web/jsonlint.js" : "",
			s.HCODE_L_coffeescript ? CMP + "CoffeeScript.js" : "",
			s.HCODE_L_coffeescript ? CMP + "coffeescript.hint.js" : "",

			s.HCODE_L_JSON ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/lint/json-lint.min.js" : "",
			s.HCODE_L_javascript ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/lint/javascript-lint.min.js" : "",
			s.HCODE_L_coffeescript ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/lint/coffeescript-lint.min.js" : "",
			s.HCODE_L_CSS ? "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.0/addon/lint/css-lint.min.js" : "",
		]);

	if (s.HCODE_L_PHP)
		switch (s.HCODE_L_PHPMode) {
		case "PHP + JS + CSS + HTML":
			s.HCODE_L_javascript && s.HCODE_L_CSS && s.HCODE_L_HTML && A.include("js", CMP + "PHP + JS + CSS + HTML.lint.js");
			break;
		case "PHP + JS":
			s.HCODE_L_javascript && A.include("js", CMP + "PHP + JS.lint.js");
			break;
		case "PHP + CSS":
			s.HCODE_L_CSS && A.include("js", CMP + "PHP + CSS.lint.js");
			break;
		case "PHP + HTML":
			s.HCODE_L_HTML && A.include("js", CMP + "PHP + HTML.lint.js");
			break;
		case "PHP":
			A.include("js", CMP + "PHP.lint.js");
			break;
		}

	if (s.HCODE_L_HTML)
		switch (s.HCODE_L_HTMLMode) {
		case "HTML + JS + CSS":
			s.HCODE_L_javascript && s.HCODE_L_CSS && s.HCODE_L_HTML && A.include("js", CMP + "HTML + JS + CSS.lint.js");
			break;
		case "HTML + JS":
			s.HCODE_L_javascript && A.include("js", CMP + "HTML + JS.lint.js");
			break;
		case "HTML + CSS":
			s.HCODE_L_CSS && A.include("js", CMP + "HTML + CSS.lint.js");
			break;
		case "HTML":
			A.include("js", CMP + "HTML.lint.js");
			break;
		}

	W.cmOption = function (exp) {
		var mode = "text/plain",
		req,
		lint = false;
		switch (exp) {
		case "js":
			s.HCODE_H_javascript && (mode = "text/javascript");
			s.HCODE_L_javascript && (lint = true);
			break;
		case "json":
			s.HCODE_H_javascript && (mode = "application/json");
			s.HCODE_L_JSON && (lint = true);
			break;
		case "coffee":
			s.HCODE_H_coffeescript && (mode = "text/x-coffeescript");
			s.HCODE_L_coffeescript && (lint = true);
			break;
		case "py":
			s.HCODE_H_python && (mode = "text/x-python");
			break;
		case "pyx":
			s.HCODE_H_python && (mode = "text/x-cython");
			break;
		case "php":
			s.HCODE_H_XML && s.HCODE_H_HTML && s.HCODE_H_javascript && s.HCODE_H_CSS && s.HCODE_H_PHP && (mode = "application/x-httpd-php-open");
			if (s.HCODE_L_PHP)
				switch (s.HCODE_L_PHPMode) {
				case "PHP + JS + CSS + HTML":
					s.HCODE_L_javascript && s.HCODE_L_CSS && s.HCODE_L_HTML && (lint = true);
					break;
				case "PHP + JS":
					s.HCODE_L_javascript && (lint = true);
					break;
				case "PHP + CSS":
					s.HCODE_L_CSS && (lint = true);
					break;
				case "PHP + HTML":
					s.HCODE_L_HTML && (lint = true);
					break;
				case "PHP":
					lint = true;
					break;
				}
			break;
		case "html":
			s.HCODE_H_XML && s.HCODE_H_HTML && (mode = "htmlmixed");
			if (s.HCODE_L_HTML)
				switch (s.HCODE_L_HTMLMode) {
				case "HTML + JS + CSS":
					s.HCODE_L_javascript && s.HCODE_L_CSS && s.HCODE_L_HTML && (lint = true);
					break;
				case "HTML + JS":
					s.HCODE_L_javascript && (lint = true);
					break;
				case "HTML + CSS":
					s.HCODE_L_CSS && (lint = true);
					break;
				case "HTML":
					lint = true;
					break;
				}
			break;
		case "xml":
		case "svg":
			s.HCODE_H_XML && (mode = "application/xml");
			break;
		case "scss":
			s.HCODE_H_SASS && (mode = "text/x-sass");
			break;
		case "css":
			s.HCODE_H_CSS && (mode = "text/css");
			s.HCODE_L_CSS && (lint = true);
			break;
		}
		req = {
			theme: s.HCODE_T,
			mode: mode,
			lineNumbers: true,
			dragDrop: true,
			autoCloseBrackets: s.HCODE_A_brackets,
			autoCloseTags: s.HCODE_A_tags,
			gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
			foldGutter: s.HCODE_F,
			lint: lint,
          	indentUnit:4,
        	indentWithTabs:true
		};
		s.HCODE_M_brackets && (req.matchBrackets = {
				afterCursor: true,
				maxScanLines: 10000,
				maxScanLineLength: 100000
			});
		s.HCODE_M_tags && (req.matchTags = {
				bothTags: true
			});
		return req;
	};
})(window);

