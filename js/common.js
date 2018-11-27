window.UID = {
		get: function () {
			return "_" + ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, function (c) {
				return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
			});
		},
		eUid: function (e, agr, u) {
			return (
				u === undefined && (u = this.get()),
				u = agr ? u : (e.getAttribute("f-uid") || u),
				e.setAttribute("f-uid", u),
				u);
		}
	}