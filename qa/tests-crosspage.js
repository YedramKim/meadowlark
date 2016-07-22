var Browser=require('zombie'),
assert=require('chai').assert;

var browser;

suite('Cross-Page Tests', function(){
	//각 테스트 전에 테스트 프레임워크에서 실행할 함수 입니다.
	setup(function(){
		browser=new Browser();
	});

	test('requesting a group rate from the hood river tour page should populate the referrer field', function(done){
		var referrer='http://localhost:80/tours/hood-river';
		//browser.visit : 페이지를 불러옴
		browser.visit(referrer, function(){
			//browser.clickLink : .requestGroupRate가 있는 링크를 찾아따라감.
			browser.clickLink('.requestGroupRate', function(){
				//browser.field :value 프로퍼티가 있는 DOM 객체를 반환
				//assert(browser.field('referrer').value===referrer);
				browser.assert.text('h1', 'Request Group');
				done();
			});
		});
	});

	test('requesting a group rate from the oregon coast tour page should populate the referrer field', function(done){
		var referrer='http://localhost:80/tours/oregon-coast';
		browser.visit(referrer, function(){
			browser.clickLink('.requestGroupRate', function(){
				//assert(browser.field('referrer').value===referrer);
				browser.assert.text('h1', 'Request Group');
				done();
			});
		});
	});

	//그룹 평가페이지를 방문했을 때 리퍼러가 비어 있는지 확인.
	test('visiting in the "request group rate" page directly should result in an empty referrer field', function(done){
		var referrer='http://localhost:80/tours/request-group-rate';
		browser.visit(referrer, function(){
			assert(browser.field('referrer').value==='');
			done();
		});
	});
});