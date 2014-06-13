Posts = new Meteor.Collection("posts");

if(Meteor.isServer){
    Meteor.publish("posts", function () {
        return Posts.find(); // everything
    });
}
if (Meteor.isClient) {
    Meteor.subscribe("posts");
}