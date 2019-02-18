(function (mod) {
	if (typeof exports == "object" && typeof module == "object")
		mod(require("../../lib/codemirror"), require('php-parser'));
	else if (typeof define == "function" && define.amd)
		define(["../../lib/codemirror", "php-parser"], mod);
	else
		mod(CodeMirror, PhpParser);
})(function (CodeMirror, phpParser) {
	"use strict";

	function phpError(offset, msg, position, type, found) {
		var start,
		end;
		if (position.lineNumber && position.columnNumber) {
			start = CodeMirror.Pos(offset - 1 + position.lineNumber - 1, position.columnNumber - 1);
			end = CodeMirror.Pos(offset - 1 + position.lineNumber - 1, position.columnNumber);
		} else if (position.start && position.end) {
			if (position.end.offset < position.start.offset) {
				end = CodeMirror.Pos(offset - 1 + position.start.line - 1, position.start.column);
				start = CodeMirror.Pos(offset - 1 + position.end.line - 1, position.end.column);
			} else {
				start = CodeMirror.Pos(offset - 1 + position.start.line - 1, position.start.column);
				end = CodeMirror.Pos(offset - 1 + position.end.line - 1, position.end.column);
			}
		}
		found.push({
			message: msg,
			severity: type,
			from: start,
			to: end
		});
	}

	/**
	 * Recursive ndoe visitor
	 */
	function phpVisit(offset, node, opt, found) {
		if (node.hasOwnProperty('kind')) {
			phpValidate(offset, node, opt, found);
		}
		for (var k in node) {
			if (node.hasOwnProperty(k)) {
				var child = node[k];
				if (!child)
					continue;
				if (child.hasOwnProperty('kind')) {
					phpVisit(offset, child, opt, found);
				} else if (Array.isArray(child)) {
					child.forEach(function (item) {
						phpVisit(offset, item, opt, found);
					});
				} else if (typeof child === 'object') {
					phpVisit(offset, child, opt, found);
				}
			}
		}
	}

	/**
	 * Validation function
	 */
	function phpValidate(offset, node, opt, found) {
		if (opt.disableEval) {
			if (node.kind === 'eval') {
				return phpError(offset, 'Eval is evil', node.loc, "warning", found);
			}
			if (node.kind === 'call' && node.what.name === 'create_function') {
				return phpError(offset, 'Eval is evil', node.loc, "warning", found);
			}
		}
		if (node.kind === 'exit' && opt.disableExit) {
			return phpError(offset, 'You should not use exit or die', node.loc, "warning", found);
		}
		if (opt.disablePHP7) {
			if (node.kind === 'array' && node.shortForm) {
				return phpError(offset, 'PHP 7 feature disabled', node.loc, "warning", found);
			}
			// ... todo
		}
		if (opt.disabledFunctions) {
			if (node.kind === 'call' && opt.disabledFunctions.indexOf(node.what.name) > -1) {
				return phpError(offset, 'Function "' + node.what.name + '" is not available', node.what.loc, "error", found);
			}
		}
		if (opt.deprecatedFunctions) {
			if (node.kind === 'call' && opt.deprecatedFunctions.indexOf(node.what.name) > -1) {
				return phpError(offset, 'Function "' + node.what.name + '" is deprecated', node.what.loc, "warning", found);
			}
		}
	}

	function processPhp(text, options, found) {
		if (phpParser) {
			var offset = 1;
			var results = phpParser.parseCode(text, {
					parser: {
						suppressErrors: true
					},
					ast: {
						withPositions: true
					}
				});
			var messages = results.messages,
			pos,
			message;
			if (results.errors && results.errors.length > 0) {
				for (var i = 0; i < results.errors.length; i++) {
					message = results.errors[i];
					pos = message.loc;
					phpError(offset, message.message, pos, "error", found);
				}
			}
			phpVisit(offset, results, options, found);

		} else if (window.console) {
			window.console.error("Error: php-parser not defined, CodeMirror PHP linting cannot run.");
		}
	}

	CodeMirror.registerHelper("lint", "php", function (text, options) {
		var found = [];
		if (!options.indent)
			options.indent = 1;

		var PHPoptions = options.php || JSON.parse(JSON.stringify(options));

		processPhp(text, PHPoptions, found);

		return found;
	});
});
