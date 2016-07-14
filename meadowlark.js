var express=require('express');
var fortune=require('./lib/fortune.js');

var app=express();
app.set('port', process.env.PORT || 80);
app.use(express.static(__dirname + '/public' ));

//핸들바 뷰 엔진 설정
//defaultLayout은 따로 명시하지 않는다면 모든 뷰에서 이 레이아웃을 쓰겠다는 의미이다.
var handlebars=require('express-handlebars').create({defaultLayout : 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
	res.render('home');
});
app.get('/about', function(req, res){
	res.render('about', {fortune : fortune.getFortune()});
});

//커스텀 404 페이지
app.use(function(req, res, next){
	res.status(404);
	res.render('404')
});

//커스텀 500 페이지
app.use(function(err, req, res ,next){
	console.log(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express Started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate');
});