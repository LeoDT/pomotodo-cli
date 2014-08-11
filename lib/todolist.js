module.exports = function(){
    var path = require('path'),
        fs = require('fs'),
        _ = require('lodash');

    var mainPath = path.resolve(process.env['HOME'], '.pomotodo'),
        todosPath = path.resolve(mainPath, 'todos'),
        todoTpl = _.template('<%= id %>. [<%= finished ? "x" : " "%>] <%= content %>\n'),
        todos = {},
        load = function(){
            if(!fs.existsSync(todosPath)){
                return false;
            }

            var buffer = fs.readFileSync(todosPath).toString().split('\n'),
            match;

            _.each(buffer, function(b){
                match = /^(\d)\.\s\[(x|\s)\]\s(.*)$/ig.exec(b);

                if(match){
                    todos[match[1]] = {
                        finished: match[2] === 'x' ? true : false,
                        content: match[3]
                    }
                }
            });

            return true;
        },
        save = function(){
            var s = '';

            _.each(todos, function(v, k){
                s += todoTpl({
                    id: k,
                    finished: v.finished,
                    content: v.content
                });
            });

            if(!fs.existsSync(mainPath)){
                fs.mkdirSync(mainPath)
            }
            fs.writeFileSync(todosPath, s);
        };

    load();

    return {
        add: function(todo){
            console.log('add %s', todo);
            var id = _.size(todos) + 1;

            todos[id] = {
                finished: false,
                content: todo
            };

            save();
        },
        list: function(){
            console.log('list todos');
            console.log(todos);
        }
    };
};
