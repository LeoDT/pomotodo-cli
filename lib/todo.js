module.exports = function(){
    var yargs = require('yargs')
                .usage('simple todo list')
                .boolean(['help', 'list'])
                .alias('a', 'add').describe('a', 'add a todo')
                .alias('l', 'list').describe('l', 'list all todos')
                .alias('h', 'help').describe('h', 'show help message'),
        argv = yargs
               .argv,
        todolist = require('./todolist')();

    if(argv.add){
        todolist.add(argv.add);
    }
    else if(argv.list){
        todolist.list();
    }

    if(argv.help){
        yargs.showHelp();
    }
};
