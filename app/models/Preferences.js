Preferences = new Meteor.Collection("preferences");

if(Meteor.isServer){
    Meteor.publish("preferences", function () {
        return Preferences.find(); // everything
    });
}
if (Meteor.isClient) {
    Meteor.subscribe("preferences");
}