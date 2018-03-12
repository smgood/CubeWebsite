// input parameters
// parent - object that webGL scene will be appended to
// columns - number of cubes columns
// rows - number of cube rows
// transition - type of  user scroll animation
function Manager (parameters = {}) {

    // make image into images, an array of images
    // pass image as optional parameter
    var player, manager, image;

    var parent, columns, rows, transition;
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
            scene = new Scene(dimensions, image, transition);
            scene.play();
            parent.append( scene.dom );
        };
    };

    function readParameters (){
            parent = parameters.parent || document.body;
            rows = parameters.rows || 10;
            columns = parameters.columns || 10;
            transition = parameters.transition || "scroll";

            dimensions = {
                rows: rows,
                columns: columns
            };
    }

    function loadImages () {
        var loader = new THREE.TextureLoader( manager );
        loader.load( './images/picasso.jpg', function ( Image ) {
            image = Image;
        });
    };

    this.play = function () {
        scene.play();
    }

    this.stop = function () {
        scene.stop();
    }
}
