module.exports = {
    print: function(s) {
        process.stdout.write(s);
    },
    timer: function(total, finish) {
        var chalk = require('chalk'),
            readline = require('readline'),
            stdin = process.stdin,
            timer = total,
            columns = process.stdout.columns,
            interval,
            fillZero = function(i) {
                return i.toString().length == 1 ? '0' + i : i;
            },
            toTime = function(t) {
                var m = parseInt(t / 60),
                    s = t % 60;
                return fillZero(m) + ':' + fillZero(s);
            },
            toBar = function(t) {
                var width = parseInt((total - t) / total * columns),
                    bar = '';

                for (var i = 0; i < width; i++) {
                    bar += '=';
                }

                for (i = 0; i < columns - width; i++) {
                    bar += chalk.gray('=');
                }

                return bar;
            };

        console.log(toTime(timer));
        console.log(toBar(timer));
        interval = setInterval(function() {
            readline.moveCursor(stdin, 0, -2);
            readline.clearLine(stdin, 0);

            timer -= 1;

            console.log(toTime(timer));
            console.log(toBar(timer));

            if (timer < 1) {
                clearInterval(interval);
                finish();
            }
        }, 1000);
    }
};
