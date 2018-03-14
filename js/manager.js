// input parameters
// parent - object that webGL scene will be appended to
// columns - number of cubes columns
// rows - number of cube rows
// transition - type of  user scroll animation
// depth - depth size of each cube
// image - file path of image to be used as texture for cubes
function Manager (parameters = {}) {

    // make image into images, an array of images
    var player, manager, loadedImage;

    var parent, columns, rows, transition, depth, image;
    var dimensions;

    init ();

    function init () {
        manager = new THREE.LoadingManager();

        readParameters();
        loadImages();

        manager.onProgress = function ( item, loaded, total ) {
            console.log(loaded + "\/" + total + " files loaded \(" + item + "\)");
        };

        manager.onError = function ( item ) {
        	console.log( 'There was an error loading ' + item );
        };

        manager.onLoad = function ( ) {
            console.log( 'Loading complete!');
            scene = new Scene(dimensions, loadedImage, transition, depth);
            scene.play();
            parent.append( scene.getDomElement() );
        };
    };

    function readParameters (){
            parent = parameters.parent || document.body;
            rows = parameters.rows || 10;
            columns = parameters.columns || 10;
            transition = parameters.transition || "scroll";
            depth = parameters.depth || 1;
            image = parameters.image || './images/picasso.jpg';

            dimensions = {
                rows: rows,
                columns: columns
            };
    }

    function loadImages () {
        var loader = new THREE.TextureLoader( manager );
        loader.load( image, function ( LoadedImage ) {
            loadedImage = LoadedImage;
        });
    };

    this.play = function () {
        scene.play();
    }

    this.stop = function () {
        scene.stop();
    }
}
