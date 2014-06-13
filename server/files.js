fs = Npm.require( 'fs' ) ;
path = Npm.require( 'path' ) ;

Meteor.methods( {
    saveFile : function( file , name) {
        var webPath = '/uploads~/';
        var publicPath = process.env.PWD+'/public'+webPath;
        console.log(publicPath);
        if (!fs.existsSync(publicPath)) {
            fs.mkdirSync(publicPath, 0777);
            if (!fs.existsSync(publicPath)) {
                throw new Error(publicPath + " does not exists");
            }
        }
        if(fs.existsSync(publicPath + name)) {
            name = 'dup_'+name;
        }

        var r = fs.writeFileSync(publicPath+name, file, 'binary');

        return webPath+name;


    }
} );