module.exports = function(){
    var yargs = require('yargs')
                .usage('simple todo list')
                .boolean(['help', 'list', 'all'])
                .alias('c', 'create').describe('c', 'create a todo')
                .alias('f', 'finish').describe('f', 'finish a todo')
                .alias('l', 'list').describe('l', 'list todos, unfinished by default')
                .alias('a', 'all').describe('a', 'list all todos').default('a', false)
                .alias('h', 'help').describe('h', 'show help message'),
        _ = require('lodash'),
        argv = yargs
               .argv,
        todolist = require('./todolist')(),
        todoTpl = _.template('<%= id %>. [<%= finished ? "x" : " "%>] <%= content %>\n'),

        print = function(s){
            process.stdout.write(s);
        },
        list = function(){
            var query = {},
                list;

            if(!argv.all){
                query = {
                    finished: false
                };
            }
            list = todolist.list(query);

            print(_.map(list, function(v, k){
                return todoTpl(_.extend({
                    id: k
                }, v));
            }).join(''));
        };

    if(argv.create){
        todolist.create(argv.create);
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
