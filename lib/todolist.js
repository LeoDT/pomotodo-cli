module.exports = function(){
    var path = require('path'),
        fs = require('fs'),
        _ = require('lodash');

    var mainPath = path.resolve(process.env['HOME'], '.pomotodo'),
        todosPath = path.resolve(mainPath, 'todos.json'),
        todoTpl = _.template('<%= id %>. [<%= finished ? "x" : " "%>] <%= content %>\n'),
        todos = [],
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
        exists: function(id){
            return this.get(todos, {
                id: id
            }) ? true : false;
        },
        create: function(todo){
            var id = _.size(todos) + 1;

            todos.push({
                id: id,
                finished: false,
                content: todo,
                createAt: new Date()
            });

            save();

            return todos[id];
        },
        get: function(id){
            return _.find(todos, {
                id: id
            });
        },
        delete: function(id){
            if(this.exists(id)){
                todos = _.reject(todos, {
                    id: id
                });
                save();

                return id;
            }

            return null;
        },
        finish: function(id){
            var t;

            if(this.exists(id)){
                t = this.get(id);
                console.log(t)
                t['finished'] = true;
                console.log(t, todos)
                save();

                return t;
            }

            return null;
        },
        list: function(q){
            return _.sortBy(q ? todos : _.filter(todos, q), function(t){
                return t.createAt;
            });
        },
        format: function(t, tpl){
            if(!_.isArray(t)){
                t = [t];
            }

            return _.map(t, function(v){
                return tpl(v);
            }).join('');
        }
    };
};
