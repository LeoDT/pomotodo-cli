module.exports = function(){
    var path = require('path'),
        fs = require('fs');

    var mainPath = path.resolve(process.env['HOME'], '.pomotodo'),
        todos = {},
        load = function(){
            if(!fs.existsSync(mainPath)){
                fs.mkdirSync(mainPath)
            }
        },
        save = function(){
            var s = '';
            todos.forEach(function(v, k){
                s += k + ' ' + v.status + ' ' + v.content;
            });
        };

    return {
        add: function(todo){
            console.log('add %s', todo);
        },
        list: function(){
            console.log('list todos');
        }
    };
};
