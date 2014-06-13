if(Meteor.isClient) {

    Template.preferences.events({
        'submit #blog-preferences': function(e){
            e.preventDefault();

            var $el = $(e.currentTarget);

            $el.find('input, select').each(function(i, item){

                console.log(i, item);
                var $item = $(item);

                console.log($item.val());
                var id = $item.attr('id');
                Preferences.upsert(id, {$set:{value: $item.val()}}, {}, function(){
                    console.log('updated '+id +' with value '+$item.val());
                });
            });

        },
        'click .toggle': function(e){
            $('.meta-box').toggleClass('open');
            $(e.currentTarget).toggleClass('glyphicon-plus glyphicon-remove');
        }

    });



}

