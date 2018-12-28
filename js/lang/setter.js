A.include("js","langs.js");
A.include("js text",'\
	window.CUR_LANG=window.CUR_LANG||localStorage.getItem(PRCON_LANGUAGE_SAVE_NAME)||LANG_LIST["@default@"];\
	A.include("js","js/lang/"+CUR_LANG);\
');