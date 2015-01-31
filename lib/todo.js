module.exports = function(){
    var yargs = require('yargs')
                .usage('simple todo list')
                .boolean(['help', 'list', 'all'])
                .alias('c', 'create').describe('c', 'create a todo')
                .alias('f', 'finish').describe('f', 'finish a todo')
                .alias('l', 'list').describe('l', 'list todos, unfinished by default').default('l', true)
                .alias('a', 'all').describe('a', 'list all todos').default('a', false)
                .alias('h', 'help').describe('h', 'show help message'),

        _ = require('lodash'),
        argv = yargs
               .argv,
        utils = require('./utils'),
        todolist = require('./todolist')(),
        todoTpl = _.template('<%= id %>. [<%= finished ? "x" : " "%>] <%= content %>\n'),

        list = function(){
            var query,
                list;

            if(!argv.all){
                query = {
                    finished: false
                };
            }
            list = todolist.list(query);

            utils.print(todolist.format(list, todoTpl));
        };

    if(argv.create){
        todolist.create(argv.create);
        console.log('created.');
    }
    else if(argv.finish){
        todolist.finish(argv.finish);
    }
    else if(argv.list){
        list();
    }

    if(argv.help){
        yargs.showHelp();
    }
};
