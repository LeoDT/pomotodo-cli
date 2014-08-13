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

    //TODO: make this more like a M in MVC
    return {
        add: function(todo){
            var id = _.size(todos) + 1;

            todos[id] = {
                finished: false,
                content: todo
            };

            save();

            return todos[id];
        },
        delete: function(id){
            if(todos[id]){
                delete todos[id];
                save();

                return id;
            }

            return null;
        },
        finish: function(id){
            if(todos[id]){
                todos[id]['finished'] = true;
                save();

                return todos[id];
            }

            return null;
        },
        list: function(q){
            return _.filter(todos, q);
        },
        tpl: todoTpl
    };
};
