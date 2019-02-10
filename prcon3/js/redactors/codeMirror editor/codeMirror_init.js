(function(W){
  	var s = BUFFER.localData.settings,
	CMP = CUR_REDACTOR_PATH + "codeMirror/";
	A.include("css", [
			CMP + "def/codemirror.min.css",
			s.HCODE_T === "bespin" ? CMP + "def/bespin.min.css" : "",
			s.HCODE_T === "isotope" ? CMP + "def/isotope.min.css" : "",
			s.HCODE_F ? CMP + "def/foldgutter.min.css" : "",
			CMP + "def/dialog.min.css",
			CMP + "def/show-hint.min.css",
			CMP + "def/lint.min.css"
		]);
	A.include("js", CMP + "def/codemirror.min.js");

	s.HCODE_F && A.include("js", [
			CMP + "def/foldcode.min.js",
			CMP + "def/foldgutter.min.js",
			CMP + "def/brace-fold.min.js",
			CMP + "def/xml-fold.min.js",
			CMP + "def/indent-fold.min.js",
			CMP + "def/markdown-fold.min.js",
			CMP + "def/comment-fold.min.js"
		]);
	A.include("js", [
			s.HCODE_H_XML ? CMP + "def/xml.min.js" : "",
			s.HCODE_H_XML && s.HCODE_H_HTML ? CMP + "def/htmlmixed.min.js" : "",
			s.HCODE_H_javascript ? CMP + "def/javascript.min.js" : "",
			s.HCODE_H_CSS ? CMP + "def/css.min.js" : "",
			s.HCODE_H_Clike ? CMP + "def/clike.min.js" : "",
			s.HCODE_H_python ? CMP + "def/python.min.js" : "",
			s.HCODE_H_markdown ? CMP + "def/markdown.min.js" : "",
			s.HCODE_H_XML && s.HCODE_H_HTML && s.HCODE_H_javascript && s.HCODE_H_CSS && s.HCODE_H_PHP ? CMP + "def/php.min.js" : "",
			s.HCODE_H_coffeescript ? CMP + "def/coffeescript.min.js" : "",
			s.HCODE_H_SASS ? CMP + "def/sass.min.js" : "",

			s.HCODE_A_brackets ? CMP + "def/closebrackets.min.js" : "",
			s.HCODE_M_brackets ? CMP + "def/matchbrackets.min.js" : "",
			s.HCODE_A_tags ? CMP + "def/closetag.min.js" : "",
			s.HCODE_M_tags ? CMP + "def/matchtags.min.js" : "",

			CMP + "def/dialog.min.js",
			CMP + "def/search.min.js",
			CMP + "def/searchcursor.min.js",
			CMP + "def/lint.min.js",

			s.HCODE_L_javascript ? CMP + "def/jshint.min.js" : "",
			s.HCODE_L_CSS ? CMP + "def/csslint.js" : "",
			s.HCODE_L_PHP ? CMP + "PHP.hint.js" : "",
			s.HCODE_L_HTML ? CMP + "HTML.hint.js" : "",
			s.HCODE_L_JSON ? CMP + "def/jsonlint.js" : "",
			s.HCODE_L_coffeescript ? CMP + "CoffeeScript.js" : "",
			s.HCODE_L_coffeescript ? CMP + "coffeescript.hint.js" : "",

			s.HCODE_L_JSON ? CMP + "def/json-lint.min.js" : "",
			s.HCODE_L_javascript ? CMP + "def/javascript-lint.min.js" : "",
			s.HCODE_L_coffeescript ? CMP + "def/coffeescript-lint.min.js" : "",
			s.HCODE_L_CSS ? CMP + "def/css-lint.min.js" : "",
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
			esversion:6,
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

