module.exports = function(){
    var path = require('path'),
        fs = require('fs'),
        _ = require('lodash');

    var mainPath = path.resolve(process.env['HOME'], '.pomotodo'),
        todosPath = path.resolve(mainPath, 'todos.json'),
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
        }
    };
};
