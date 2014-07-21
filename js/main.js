require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'jquery-2.1.1.min'
    }
});

require(['jquery', 'digit', 'color'], function($, DIGIT, COLOR) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var colors = [],
        balls = [],
        lastCountdown,
        countdown,
        lastSecond,
        ticker,
        options = { // digit options
            x: 0, // offset left
            y: 0, // offset top
            digit: 0, // digit value
            radius: 7, // digit ball radius
            space: 1, // space between two balls is 2*space
            color: COLOR.BEWITCHED_TREE //digit ball color
        };

    // init
    (function(){
        initColors();
        renderCounter();
        renderDesc();
        bindEvent();
    })();

    function bindEvent() {
        $('#start').click(function() {
            balls = [];
            countdown = getInput();

            if(typeof ticker !== 'undefined') clearInterval(ticker);
            initTicker();
        });

        $('#reset').click(function() {
            $('input[type=text]').val('').trigger('input');

            clearInterval(ticker);
            countdown = 0;
            balls = [];
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            renderCounter();
            renderDesc();
        });

        $('input[type=text]').on('input', function() {
            $('#start').prop('disabled', getInput() ? false : true);
        });
    }

    function getInput() {
        var hours = parseInt($('#hours').val())  || 0,
            minutes = parseInt($('#minutes').val())  || 0,
            seconds = parseInt($('#seconds').val())  || 0;

        return hours*3600 + minutes*60 + seconds;
    }

    function initColors() {
        for(var i in COLOR) {
            if(COLOR.hasOwnProperty(i)) {
                colors.push(COLOR[i]);
            }
        }
    }

    function initTicker() {
        ticker = setInterval(function() {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            renderCounter();
            updateBalls();
            rendBalls();
            if(!countdown && !balls.length) {
                clearInterval(ticker);
            }
        }, 50);
    }

    function renderCounter() {
        if(!countdown) countdown = 0;

        var second = (new Date).getSeconds();
        if(second !== lastSecond && lastCountdown) countdown--;

        var time = parseTime(countdown),
            lastTime = parseTime(lastCountdown);

        var x = 50, y = 50;
        var block = 2*(options.radius + options.space);
        var digArr = [time.h1, time.h2, 10, time.m1, time.m2, 10, time.s1, time.s2];
        var xArr = [
                x,
                x+8*block,
                x+16*block,
                x+21*block,
                x+29*block,
                x+37*block,
                x+42*block,
                x+50*block
        ];

        var digPos = {
            h1: xArr[0],
            h2: xArr[1],
            m1: xArr[3],
            m2: xArr[4],
            s1: xArr[6],
            s2: xArr[7]
        };

        for(var i= 0, len=digArr.length; i<len; i++) {
            renderDigit({x:xArr[i], y:y, digit:digArr[i]});
        }

        if(lastCountdown) {
            for(var a in time) {
                if(lastTime[a] !== time[a]) {
                    addBall({x: digPos[a], y: y, digit: time[a]});
                }
            }
        }

        lastCountdown = countdown;
        lastSecond = second;
    }

    function addBall(param) {
        var digArr = DIGIT[param.digit];
        for(var i= 0, len=digArr.length; i<len; i++) {
            for (var j = 0, _len = digArr[i].length; j < _len; j++) {
                if (digArr[i][j]) {
                    var ball = {
                        cx: param.x + (2*j + 1)*(options.radius + options.space),
                        cy: param.y + (2*i + 1)*(options.radius + options.space),
                        g: 1.5+Math.random(),
                        vx: Math.pow(-1, Math.ceil(Math.random()*1000))*4,
                        vy: -10,
                        color: colors[Math.floor(Math.random()*colors.length)]
                    };

                    balls.push(ball);
                }
            }
        }
    }

    function rendBalls() {
        for(var i= 0, len=balls.length; i<len; i++) {
            var ball = balls[i];
            ctx.beginPath();
            ctx.fillStyle = ball.color;
            ctx.arc(ball.cx, ball.cy, options.radius, 0, 2*Math.PI);
            ctx.fill();
        }
    }

    function updateBalls() {
        var i = 0, ball, len = balls.length, count = 0;
        for(; i<len; i++) {
            ball = balls[i];
            ball.cx += ball.vx;
            ball.cy += ball.vy;
            ball.vy += ball.g;

            if(ball.cy >= ctx.canvas.height - options.radius) {
                ball.cy = ctx.canvas.height - options.radius;
                ball.vy = -ball.vy*.75;
            }

            // balls in the view
            if(ball.cx+options.radius>0 && ball.cx-options.radius<ctx.canvas.width) {
                balls[count++] = ball;
            }
        }

        // delete balls out the view
        balls.splice(count, balls.length-count);
    }

    function parseTime(countdown) {
        if(countdown < 0) countdown = 0;
        var h = Math.floor(countdown/3600),
            m = Math.floor((countdown-3600*h)/60),
            s = Math.floor(countdown%60);

        return {
            h1: Math.floor(h/10),
            h2: h%10,
            m1: Math.floor(m/10),
            m2: m%10,
            s1: Math.floor(s/10),
            s2: s%10
        }
    }

    function renderDigit(_options) {
        _options = $.extend(options, _options);

        var digArr = DIGIT[_options.digit];

        for(var i= 0, len=digArr.length; i<len; i++) {
            for(var j= 0, _len=digArr[i].length; j<_len; j++) {
                if(digArr[i][j]) {
                    var cx = _options.x + (2*j + 1)*(_options.radius + _options.space),
                        cy = _options.y + (2*i + 1)*(_options.radius + _options.space);
                    ctx.beginPath();
                    ctx.fillStyle = _options.color;
                    ctx.arc(cx , cy, _options.radius, 0, 2*Math.PI);
                    ctx.fill();
                }
            }
        }
    }

    function renderDesc() {
        ctx.beginPath();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = '50px cursive';
        ctx.fillStyle = COLOR.BEWITCHED_TREE;
        ctx.fillText('Can\'t wait to see the falling balls...', ctx.canvas.width/2, ctx.canvas.height/2+50);
        ctx.fillStyle = COLOR.MERRY_CRANES_BILL;
        ctx.fillText('Start Now !!!', ctx.canvas.width/2, ctx.canvas.height/2+140);
        ctx.closePath();
    }
});
