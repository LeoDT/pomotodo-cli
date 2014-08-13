module.exports = function() {
    var _ = require('lodash'),
        readline = require('readline'),
        keypress = require('keypress'),
        chalk = require('chalk'),
        utils = require('./utils'),
        todolist = require('./todolist')(),
        stdin = process.stdin,
        timer = 0.1 * 60, total,
        columns = process.stdout.columns,
        fillZero = function(i) {
            return i.toString().length == 1 ? '0' + i : i;
        },
        toTime = function(t) {
            var m = parseInt(t / 60),
                s = t % 60;
            return fillZero(m) + ':' + fillZero(s);
        },
        toBar = function(t){
            var width = parseInt((total - t) / total * columns),
            bar = '';

            for(var i = 0; i < width; i++){
                bar += '=';
            }

            for(i = 0; i < columns - width; i++){
                bar += chalk.gray('=');
            }

            return bar;
        },
        giveup = function(){
            console.log('you give up!')
            stdin.pause();
            process.exit();
        },
        finish = function() {
            console.log('hooray!')
            stdin.pause();
            process.exit(0);
        };

    total = timer;

    keypress(stdin);

    stdin.setRawMode('true');

    stdin.addListener('keypress', function(ch, key) {
        if (key && key.ctrl && key.name == 'c') {
            giveup();
        }
    });

    utils.print(todolist.format(todolist.list({
        finished: false
    }), _.template('<%= id %>. <%= content %>\n')));
    console.log('');

    console.log(toTime(timer));
    console.log(toBar(timer));
    setInterval(function() {
        readline.moveCursor(stdin, 0, -2);
        readline.clearLine(stdin, 0);

        timer -= 1;

        console.log(toTime(timer));
        console.log(toBar(timer));

        if(timer < 1){
            finish();
        }
    }, 1000);

    stdin.resume();
};
