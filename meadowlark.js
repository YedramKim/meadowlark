var express=require('express');
var fortune=require('./lib/fortune.js');
var path=require('path');

//파비콘
var favicon=require('express-favicon');

var app=express();
app.set('port', process.env.PORT || 80);
app.use(express.static(__dirname + '/public' ));

//파비콘 설정
//app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));

//post요청 설정
app.use(require('body-parser').urlencoded({extended : true}));

//핸들바 뷰 엔진 설정
//defaultLayout은 따로 명시하지 않는다면 모든 뷰에서 이 레이아웃을 쓰겠다는 의미이다.
var handlebars=require('express-handlebars').create({
	defaultLayout : 'main',
	helpers :{
		section : function(name, options){
			if(!this._sections)this._sections={};
			this._sections[name]=options.fn(this);
			return null;
		}
	}
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//페이지 테스트 코드
app.use(function(req, res, next){
	res.locals.showTests=app.get('env') !== 'production' && req.query.test === '1';
	next();
});

//파셜 관련 함수
function getWeatherData(){
	return{
		locations:[
			{
				name : 'Portland',
				forecastUrl : 'http://www.wunderground.com/US/OR/Portland.html',
				iconUrl : 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather : 'Overcast',
				temp : '54.1 F (12.3 C)'
			},
			{
				name : 'Bend',
				forecastUrl : 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl : 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather : 'Partly Cloudy',
				temp : '55.0 F (12.8 C)'
			},
			{
				name : 'Manzanita',
				forecastUrl : 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl : 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather : 'Light Rain',
				temp : '55.0 F (12.8 C)'
			}
		]
	};
}
app.use(function(req, res ,next){
	if(!res.locals.partials) res.locals.partials={};
	res.locals.partials.weatherContext=getWeatherData();
	next();
});

//파일 업로드
var formidable=require('formidable');
app.get('/contest/vacation-photo', function(req, res){
	var now=new Date();
	res.render('contest/vacation-photo', {
		year : now.getFullYear(),
		month : now.getMonth()
	});
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form=new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, '/error');
		console.log('received fields :');
		console.log(fields);
		console.log('received files :');
		console.log(files);
		res.redirect(303, '/thank-you');
	});
});

//라우트
app.get('/', function(req, res){
	res.render('home');
});
app.get('/jquery', function(req, res){
	res.render('jquery-test');
});
app.get('/about', function(req, res){
	res.render('about', {
		fortune : fortune.getFortune(),
		pageTestScript : '/qa/tests-about.js'
	});
});
app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});
app.get('/tours/oregon-coast', function(req, res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});
app.get('/headers', function(req, res){
	res.set('Content-Type', 'text/plain');
	var s='';
	for(var name in req.headers){
		s+=name+': '+req.headers[name]+'\n';
	}
	res.send(s);
});
//클라이언트 핸들바 관련
app.get('/nursery-rhyme', function(req, res){
	res.render('nursery-rhyme');
})
app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal : 'spuirrel',
		bodyPart : 'tail',
		adjective : 'bushy',
		noun : 'heck'
	});
});

app.get('/thank-you', function(req, res){
	res.render('thank-you');
})

app.get('/newsletter', function(req, res){
	res.render('newsletter',{
		csrf : 'CSRF token goes here'
	});
});

//post 폼 처리
app.post('/process', function(req, res){
	//req.xhr: 요청이 ajax요청일 경우 true
	//req.accepts:반환하기 가장 적절한 응답 타입을 결정합니다.
	if(req.xhr || req.accepts('json,html') === 'json'){
		res.send({success:true});
	}else{
		res.redirect(303, '/thank-you');
	}
});

app.get('/error', function(req, res){
	res.render('error');
});

//제이쿼리 파일 업로드
var jqupload=require('jquery-file-upload-middleware');
app.use('/upload', function(req, res, next){
	var now=Date.now();
	jqupload.fileHandler({
		uploadDir:function(){
			return __dirname+'/public/uploads/'+now;
		},
		uploadUrl:function(){
			return '/uploads/'+now;
		}
	})(req, res, next);
});

//커스텀 404 페이지
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
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