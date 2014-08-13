module.exports = function(){
    var path = require('path'),
        fs = require('fs'),
        _ = require('lodash');

    var mainPath = path.resolve(process.env['HOME'], '.pomotodo'),
        todosPath = path.resolve(mainPath, 'todos.json'),
        todoTpl = _.template('<%= id %>. [<%= finished ? "x" : " "%>] <%= content %>\n'),
        todos = {},
        load = function(){
            if(!fs.existsSync(todosPath)){
                return false;
            }

            todos = require(todosPath);

            return true;
        },
        save = function(){
            if(!fs.existsSync(mainPath)){
                fs.mkdirSync(mainPath)
            }

            fs.writeFileSync(todosPath, JSON.stringify(todos));
        };

    load();

    return {
        create: function(todo){
            var id = _.size(todos) + 1;

            todos[id] = {
                finished: false,
                content: todo,
                createAt: new Date()
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
        format: function(t, tpl){
            if(!_.isArray(t)){
                t = [t];
            }

            return _.map(t, function(v, k){
                return tpl(_.extend({
                    id: k
                }, v));
            }).join('')
        }
    };
};
