A.include("js","redactors.js");
A.include("js text",'\
	window.CUR_REDACTOR=window.CUR_REDACTOR||localStorage.getItem(PRCON_REDACTOR_CURRENT_NAME)||REDACTORS_LIST["@default@"];\
	window.CUR_REDACTOR_PATH=REDACTORS_PATH+CUR_REDACTOR+"/";\
	A.include("js",CUR_REDACTOR_PATH+"index.js");\
');