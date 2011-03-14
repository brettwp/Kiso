unittest.ui.testCookieAdapter = function() {
	var mockDocumentCookie;
	var MockCookieAdapter = new kiso.Class(
		kiso.ui.CookieAdapter,
		{
			_setDocumentCookie: function(cookieDef) {
		  	mockDocumentCookie = cookieDef;
			},
			_getDocumentCookie: function() {
		  	return mockDocumentCookie;
			}
		}
	);

	module('kiso.ui.CookieAdapter Tests with Mock Date and Cookie', {
		setup: function() {
			this.testMockCookieAdapter = new MockCookieAdapter();
		  this.origDateGetTime = Date.prototype.getTime;
		  Date.prototype.getTime = function() {
		  	return 0;
		  };
		},
		teardown: function() {
			this.testMockCookieAdapter = null;
			Date.prototype.getTime = this.origDateGetTime;
		}
	});

  test('Set (Mock) Cookie', function() {
    this.testMockCookieAdapter.setCookie('CookieSet', 'Monster', {
      path: 'path', domain: 'domain', secure: false
    });
    var expRegEx = new RegExp('CookieSet=Monster;expires=Thu, 0*1 Jan 1970 00:00:00[ A-z]*;path=path;domain=domain');
    expect(1);
    ok(expRegEx.test(mockDocumentCookie));
  });

  test('Set (Mock) Cookie Secure', function() {
    this.testMockCookieAdapter.setCookie('CookieSetSecure', 'Monster', {
      path: 'path', domain: 'domain', secure: true
    });
    var expRegEx = new RegExp('CookieSetSecure=Monster;expires=Thu, 0*1 Jan 1970 00:00:00[ A-z]*;path=path;domain=domain;secure');
    expect(1);
    ok(expRegEx.test(mockDocumentCookie));
  });

	test('Get (Mock) Cookie', function() {
		mockDocumentCookie = 'CookieGet=Monster;';
		expect(1);
		equal(this.testMockCookieAdapter.getCookie('CookieGet'), 'Monster');
	});
	
	test('Is (Mock) Cookie Set', function() {
		mockDocumentCookie = 'Cookie=Monster;';
		expect(1);
		ok(this.testMockCookieAdapter.isCookieSet('Cookie'));
	});
	
	test('Set Cookie by Days Till Expire', function() {
		this.testMockCookieAdapter.setCookie('Test', 'Monster', 15);
		var expStr = 'Test=Monster;expires=Fri, 16 Jan 1970 00:00:00';
		expect(1);
		equal(mockDocumentCookie.substr(0,expStr.length), expStr);
	});
	
	test('Set Cookie by UTC', function() {
		this.testMockCookieAdapter.setCookie('Test', 'Monster', { utc: 9*24*60*60*1000 + 1000 });
		var expStr = 'Test=Monster;expires=Sat, 10 Jan 1970 00:00:01';
		expect(1);
		equal(mockDocumentCookie.substr(0,expStr.length), expStr);
	});
	
	test('Set Cookie by Time Units', function() {
		this.testMockCookieAdapter.setCookie('Test', 'Monster', {
			days: 11,
			hours: 1,
			minutes: 1,
			seconds: 1
		});
		var expStr = 'Test=Monster;expires=Mon, 12 Jan 1970 01:01:01';
		expect(1);
		equal(mockDocumentCookie.substr(0,expStr.length), expStr);
	});
	
	module('kiso.ui.CookieAdapter Browser Tests');

	test('Set and Clear', function() {
		var cookieAdapter = new kiso.ui.CookieAdapter();
		cookieAdapter.setCookie('Temp', 'Short', 1);
		cookieAdapter.clearCookie('Temp');
		expect(1);
		ok(!cookieAdapter.isCookieSet('Temp'));
	});
};
