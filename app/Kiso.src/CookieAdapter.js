Kiso.CookieAdapter = Kiso.Class({
	_MS_PER_DAY: 60 * 60 * 24 * 1000,

	setCookie: function(cookieName, cookieValue, daysOrObject) {
		var expireDate = this._buildExpireDate(daysOrObject);
  	this._setDocumentCookie(
      cookieName + '=' + escape(cookieValue) +
  		';expires=' + expireDate +
      ((daysOrObject.path) ? ';path=' + daysOrObject.path : '') +
      ((daysOrObject.domain) ? ';domain=' + daysOrObject.domain : '') +
      ((daysOrObject.secure) ? ';secure' : '')
    );
  },
  
  _buildExpireDate: function(daysOrObject) {
		var msTillExpire = 0;
		var utcExpire = null;
  	if (typeof daysOrObject == 'object') {
			if (daysOrObject.utc) {
				utcExpire = daysOrObject.utc;
			} else {
				msTillExpire = this._getMsTillExpire(daysOrObject);
			}
		} else {
			msTillExpire = daysOrObject * this._MS_PER_DAY;
		}
		var expireDate = new Date();
		expireDate.setTime(utcExpire ? utcExpire : (expireDate.getTime() + msTillExpire));
		expireDate = expireDate.toUTCString();
		return expireDate;
	},
	
	_getMsTillExpire: function(daysOrObject) {
		var seconds = daysOrObject.seconds || 0;
		var minutes = daysOrObject.minutes || 0;
		var hours = daysOrObject.hours || 0;
		var days = daysOrObject.days || 0;
		return ((((((days*24) + hours)*60) + minutes)*60) + seconds)*1000; 
	},
	
  getCookie: function(cookieName) {
  	var documentCookie = this._getDocumentCookie();
		var cookieValue = '';
  	if (documentCookie.length > 0) {
  		var cookieStart = documentCookie.indexOf(cookieName + '=');
  		if (cookieStart != -1) {
				cookieStart = cookieStart + cookieName.length + 1;
	      var cookieStop = documentCookie.indexOf(';', cookieStart);
	      if (cookieStop == -1) cookieStop = documentCookie.length;
	      cookieValue = unescape(documentCookie.substring(cookieStart, cookieStop));
      }
		}
    return cookieValue;
  },
  
  isCookieSet: function(cookieName) {
  	var cookieValue = this.getCookie(cookieName);
  	return (cookieValue != null && cookieValue != '');
	},
	
	clearCookie: function(cookieName) {
  	this.setCookie(cookieName, null, -1);
  },
  
  _setDocumentCookie: function(cookieDef) {
  	document.cookie = cookieDef;
  },
  
  _getDocumentCookie: function() {
  	return document.cookie;
  }
});
