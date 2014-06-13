if(Meteor.isClient){
    Template.post.rendered = function(){
        console.log('post rendered');
    };

}
