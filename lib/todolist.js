module.exports = function(){
    var todoFile;

    return {
        add: function(todo){
            console.log('add %s', todo);
        },
        list: function(){
            console.log('list todos');
        }
    };
};
