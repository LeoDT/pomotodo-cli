module.exports = function() {
    var yargs = require('yargs')
                .usage('tomato')
                .boolean(['debug'])
                .describe('debug', 'debug mode').default('debug', false),
        _ = require('lodash'),
        readline = require('readline'),
        keypress = require('keypress'),
        utils = require('./utils'),
        todolist = require('./todolist')(),
        stdin = process.stdin,
        workTimer = !yargs.argv.debug ? 25 * 60 : 0.05 * 60,
        breakTimer = !yargs.argv.debug ? 5 * 60 : 0.05 * 60,
        giveup = function(){
            console.log('you give up!');
            stdin.pause();
            process.exit();
        },
        finish = function() {
            var inquirer = require('inquirer'),
            notifier = require('node-notifier');

            notifier.notify({
                title: 'Pomotodo cli',
                message: 'one tomato got! Come and finish some todos.'
            });

            console.log('hooray!');

            inquirer.prompt({
                type: 'checkbox',
                message: 'What did you finished',
                name: 'tasks',
                choices: _.map(todolist.list({
                    finished: false
                }), function(e){
                    return {
                        name: e.content,
                        value: e.id
                    };
                })
            }, function(answers){
                console.log('Now having a break.');

                _.each(answers.tasks, function(a){
                    todolist.finish(a);
                });

                utils.timer(breakTimer, function(){
                    notifier.notify({
                        title: 'Pomotodo cli',
                        message: 'It\'s time to work.'
                    });

                    console.log('Come back to work.');
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
