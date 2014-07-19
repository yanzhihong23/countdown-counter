require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'jquery-2.1.1.min'
    }
});

require(['jquery', 'digit', 'color'], function($, DIGIT, COLOR) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var options = {
        x: 0,
        y: 0,
        digit: 0,
        radius: 7,
        space: 1,
        color: COLOR.BEWITCHED_TREE
    };

    renderTime();

    var countdown = 1314;

    startTicker(countdown);

    function startTicker(countdown) {
        var ticker = setInterval(function() {
            if(countdown<10) {
                options.color = COLOR.MERRY_CRANES_BILL;
            }
            var h = Math.floor(countdown/3600),
                m = Math.floor((countdown-3600*h)/60),
                s = Math.floor(countdown%60);
            ctx.clearRect(0, 0, 1024, 768);
            renderTime({h:h,m:m,s:s});
            if(countdown) {
                countdown--;
            } else {
                clearInterval(ticker);
            }
        }, 1000);
    }

    function renderTime(time) {
        if(typeof time !== 'object') time = {h:0, m:0, s:0};

        var h1 = Math.floor(time.h/10),
            h2 = time.h%10,
            m1 = Math.floor(time.m/10),
            m2 = time.m%10,
            s1 = Math.floor(time.s/10),
            s2 = time.s%10;
        var x = 50, y = 50;
        var block = 2*(options.radius + options.space);
        var digArr = [h1, h2, 10, m1, m2, 10, s1, s2];
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
        for(var i= 0, len=digArr.length; i<len; i++) {
            renderDigit({x:xArr[i], y:y, digit:digArr[i]});
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
});
