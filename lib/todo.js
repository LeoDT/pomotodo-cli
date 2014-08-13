module.exports = function(){
    var yargs = require('yargs')
                .usage('simple todo list')
                .boolean(['help', 'list', 'all'])
                .alias('c', 'create').describe('c', 'create a todo')
                .alias('f', 'finish').describe('f', 'finish a todo')
                .alias('l', 'list').describe('l', 'list todos, unfinished by default')
                .alias('a', 'all').describe('a', 'list all todos').default('a', false)
                .alias('h', 'help').describe('h', 'show help message'),
        argv = yargs
               .argv,
        todolist = require('./todolist')();

    if(argv.add){
        todolist.add(argv.add);
    }
    else if(argv.finish){
        todolist.finish(argv.finish, argv._);
    }
    else if(argv.list){
        todolist.list(argv.all);
    }

    if(argv.help){
        yargs.showHelp();
    }
};
