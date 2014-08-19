module.exports = function() {
    var _ = require('lodash'),
        readline = require('readline'),
        keypress = require('keypress'),
        utils = require('./utils'),
        todolist = require('./todolist')(),
        stdin = process.stdin,
        workTimer = 0.1 * 60,
        breakTimer = 0.05 * 60,
        giveup = function(){
            console.log('you give up!')
            stdin.pause();
            process.exit();
        },
        finish = function() {
            var inquirer = require('inquirer');

            console.log('hooray!');

            inquirer.prompt({
                type: 'input',
                message: 'What did you finished',
                name: 'task'
            }, function(answers){
                console.log('Now having a break.');

                utils.timer(breakTimer, function(){
                    console.log('Come back.')
                    stdin.pause();
                    process.exit(0);
                });
            });
        };

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

    utils.timer(workTimer, function(){
        finish();
    });

    stdin.resume();
};
