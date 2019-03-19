A.include("js","static/PRCON3_dj/langs.js");
A.include("js text",'\
	window.CUR_LANG=window.CUR_LANG||localStorage.getItem(PRCON_LANGUAGE_SAVE_NAME)||LANG_LIST["@default@"];\
	A.include("js","static/PRCON3_dj/js/lang/"+CUR_LANG);\
');