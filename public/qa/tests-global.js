//페이지에 유효한 타이틀이 있는지 확인
suite('Global Tests',function(){
	test('page has a valid title', function(){
		assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
	});
});