// parent - object that webGL scene will be appended to
function Manager (parent) {

    // make image into images, an array of images
    var player, manager, image;

    init ();

    function init () {
        manager = new THREE.LoadingManager();
        loadImages();

        manager.onProgress = function ( item, loaded, total ) {
            console.log(loaded + "\/" + total + " files loaded \(" + item + "\)");
        };

        manager.onError = function ( item ) {
        	console.log( 'There was an error loading ' + item );
        };

        manager.onLoad = function ( ) {
            console.log( 'Loading complete!');
            scene = new Scene(image);
            scene.play();
            parent.append( scene.dom );
        };
    }

    function loadImages () {
        var loader = new THREE.TextureLoader( manager );
        loader.load( './images/picasso.jpg', function ( Image ) {
            image = Image;
        });
    }
}
