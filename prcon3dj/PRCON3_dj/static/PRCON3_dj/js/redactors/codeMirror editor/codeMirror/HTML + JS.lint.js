// CodeMirror, copyright (c) by Marijn Haverbeke and others,
// Initial htmlmixed-lint.js from István Király, https://github.com/LaKing
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Depends on htmlhint jshint and csshint

// Mod by MiloLug

(function (mod) {
	if (typeof exports == "object" && typeof module == "object") // CommonJS
		mod(require("../../lib/codemirror"), require("htmlhint"));
	else if (typeof define == "function" && define.amd) // AMD
		define(["../../lib/codemirror", "htmlhint"], mod);
	else // Plain browser env
		mod(CodeMirror, window.HTMLHint);
})(function (CodeMirror, HTMLHint) {
	"use strict";

	var defaultRules = {
		"tagname-lowercase": true,
		"attr-lowercase": true,
		"attr-value-double-quotes": true,
		"doctype-first": false,
		"tag-pair": true,
		"spec-char-escape": true,
		"id-unique": true,
		"src-not-empty": true,
		"attr-no-duplication": true
	};

	// dependency verification
	// htmllint
	var found = [];
	if (HTMLHint && !HTMLHint.verify)
		HTMLHint = HTMLHint.HTMLHint;
	if (!HTMLHint)
		HTMLHint = window.HTMLHint;
	if (!HTMLHint) {
		if (window.console) {
			window.console.error("Error: window.HTMLHint not found, CodeMirror HTML mixed linting cannot run.");
		}
		return found;
	}
	// jshint
	if (!window.JSHINT) {
		if (window.console) {
			window.console.error("Error: window.JSHINT not defined, CodeMirror HTML mixed linting cannot run.");
		}
		return [];
	}

	// our JS error parser is extended with the offset argument
	function parseErrors(errors, output, offset) {
		for (var i = 0; i < errors.length; i++) {
			var error = errors[i];
			if (error) {
				if (error.line <= 0) {
					if (window.console) {
						window.console.warn("Cannot display JSHint error (invalid line " + error.line + ")", error);
					}
					continue;
				}

				var start = error.character - 1,
				end = start + 1;
				if (error.evidence) {
					var index = error.evidence.substring(start).search(/.\b/);
					if (index > -1) {
						end += index;
					}
				}

				var line = error.line - 1 + offset - 1;
				// Convert to format expected by validation service
				var hint = {
					message: error.reason,
					severity: error.code ? (error.code.startsWith('W') ? "warning" : "error") : "error",
					from: CodeMirror.Pos(line, start),
					to: CodeMirror.Pos(line, end)
				};

				output.push(hint);
			}
		}
	}

	function newlines(str) {
		return str.split('\n').length;
	}

	function processHTML(nophp, options, found) {
		var text = nophp.t;
		var messages = HTMLHint.verify(text, options && options.rules || defaultRules),
		curOffset = 0;
		for (var i = 0; i < messages.length; i++) {
			var message = messages[i];
			curOffset = nophp.o[message.line] || curOffset;
			var startLine = curOffset + message.line - 1,
			endLine = curOffset + message.line - 1,
			startCol = message.col - 1,
			endCol = message.col;
			found.push({
				from: CodeMirror.Pos(startLine, startCol),
				to: CodeMirror.Pos(endLine, endCol),
				message: message.message,
				severity: message.type
			});
		}
	}

	function processJS(nophp, options, found) {
		var text = nophp.t;
		var blocks = text.split(/<script[\s\S]*?>|<\/script>/gi);
		for (var j = 1; j < blocks.length; j += 2) {
			if (blocks[j].length > 1) {
				JSHINT(blocks[j], options, options.globals);
				var errors = JSHINT.data().errors;
				var offset = newlines(blocks.slice(0, j).join());
				if (errors)
					parseErrors(errors, found, offset + nophp.o[offset]);
			}
		}
	}

	CodeMirror.registerHelper("lint", "html", function (text, options) {
		var found = [],
		noPhp = {
			t: text,
			o: 0
		};

		if (!options.indent)
			options.indent = 1;

		var JSoptions = options.js || JSON.parse(JSON.stringify(options));
		var HTMLoptions = options.html || JSON.parse(JSON.stringify(options));

		JSoptions.esversion=6;
		
		processHTML(noPhp, HTMLoptions, found);

		processJS(noPhp, JSoptions, found);

		return found;
	});
});
