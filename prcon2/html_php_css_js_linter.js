// CodeMirror, copyright (c) by Marijn Haverbeke and others,
// Initial htmlmixed-lint.js from István Király, https://github.com/LaKing
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Depends on htmlhint jshint and csshint

// Mod by MiloLug
// Added PHP linting
// Mod depends on php-parser

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"), require("htmlhint"), require('php-parser'));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror", "htmlhint", "php-parser"], mod);
    else // Plain browser env
        mod(CodeMirror, window.HTMLHint, PhpParser);
})(function(CodeMirror, HTMLHint, phpParser) {
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
        if (HTMLHint && !HTMLHint.verify) HTMLHint = HTMLHint.HTMLHint;
        if (!HTMLHint) HTMLHint = window.HTMLHint;
        if (!HTMLHint) {
            if (window.console) {
                window.console.error("Error: window.HTMLHint not found, CodeMirror HTML mixed linting cannot run.");
            }
            return found;
        }
        //  csslint
        if (!window.CSSLint) {
            if (window.console) {
                window.console.error("Error: window.CSSLint not defined, CodeMirror HTML mixed linting cannot run.");
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
		
      	var _noPhp=function(text){
          	var tmpOffset=0,
                tmp=text.split(/<\?|\?>/gi),
                tmpPhp,
                offsets={};
          	text="";
          	for(var j=0, len=tmp.length, nl, nnl;j<len;j+=2){
              	tmpPhp=tmp[j-1];
              	tmpOffset+=tmpPhp!==undefined?newlines(tmpPhp):0;
              	nl=text.indexOf('\n')<0?0:newlines(text);
              	nnl= newlines(tmp[j]);
              	text+=tmp[j];
              	for(var nI=0, newnnl=nnl+1;nI<newnnl;nI++){
                  	offsets[nl+nI]=tmpOffset>0?tmpOffset-j/2*1:0;
                }
            }
          	return {
				t:text,
              	o:offsets
			};
        };
      
        function newlines(str) {
            return str.split('\n').length;
        }

        function processHTML(nophp, options, found) {
          	var text=nophp.t;
          	var messages = HTMLHint.verify(text, options && options.rules || defaultRules),
                curOffset=0;
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
              	curOffset=nophp.o[message.line]||curOffset;
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

        function processCSS(nophp, options, found) {
          	var text=nophp.t;
            var blocks = text.split(/<style[\s\S]*?>|<\/style>/gi),
                curOffset=0;
            for (var j = 1; j < blocks.length; j += 2) {
                var offset = newlines(blocks.slice(0, j).join());
                var results = CSSLint.verify(blocks[j], options);
                var messages = results.messages;
                var message = null;
              	curOffset=nophp.o[offset]||curOffset;
                for (var i = 0; i < messages.length; i++) {
                    message = messages[i];
                  	var startLine = curOffset + offset - 1 + message.line - 1,
                        endLine = curOffset + offset - 1 + message.line - 1,
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
        }
		
      	function phpError(offset, msg, position, type, found){
          	var start, end;
    		if (position.lineNumber && position.columnNumber) {
    		  start = CodeMirror.Pos(offset- 1 + position.lineNumber - 1, position.columnNumber - 1);
    		  end = CodeMirror.Pos(offset- 1 + position.lineNumber - 1, position.columnNumber);
    		} else if (position.start && position.end) {
    		  if (position.end.offset < position.start.offset) {
    		    end = CodeMirror.Pos(offset- 1 + position.start.line - 1, position.start.column);
    		    start = CodeMirror.Pos(offset- 1 + position.end.line - 1, position.end.column);
    		  } else {
    		    start = CodeMirror.Pos(offset- 1 + position.start.line - 1, position.start.column);
    		    end = CodeMirror.Pos(offset- 1 + position.end.line - 1, position.end.column);
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
  		  for(var k in node) {
  		    if (node.hasOwnProperty(k)) {
  		      var child = node[k];
  		      if (!child) continue;
  		      if (child.hasOwnProperty('kind')) {
  		        phpVisit(offset, child, opt, found);
  		      } else if (Array.isArray(child)) {
  		        child.forEach(function(item) {
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
          if(phpParser){
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
                pos, message;
           if (results.errors && results.errors.length > 0) {
         	for(var i = 0; i < results.errors.length; i++) {
                  	message=results.errors[i];
                  	pos=message.loc;
                  	phpError(offset, message.message,pos,"error",found);
                }  	
        	}
           		phpVisit(offset, results, options, found);
            
          }else if(window.console){
          	window.console.error("Error: php-parser not defined, CodeMirror PHP linting cannot run."); 	
          }
  		}
      
        function processJS(nophp, options, found) {
          	var text=nophp.t;
            var blocks = text.split(/<script[\s\S]*?>|<\/script>/gi);
            for (var j = 1; j < blocks.length; j += 2) {
                if (blocks[j].length>1) {
                    JSHINT(blocks[j], options, options.globals);
                    var errors = JSHINT.data().errors;
                  	var offset = newlines(blocks.slice(0, j).join());
                    if (errors) parseErrors(errors, found, offset + nophp.o[offset]);
                }
            }
        }
  
    CodeMirror.registerHelper("lint", "html", function(text, options) {
      	var found=[],
            noPhp=_noPhp(text);
      	
      	if (!options.indent)
        	options.indent = 1;

        var CSSoptions = options.css || JSON.parse(JSON.stringify(options));
        var JSoptions = options.js || JSON.parse(JSON.stringify(options));
        var HTMLoptions = options.html || JSON.parse(JSON.stringify(options));
		var PHPoptions = options.php || JSON.parse(JSON.stringify(options));
      
      	processHTML(noPhp, HTMLoptions, found);	
      
      	processCSS(noPhp, CSSoptions, found);
      
      	processPhp(text, PHPoptions, found);	
      	
      	processJS(noPhp, JSoptions, found);
      
        return found;
    });
});