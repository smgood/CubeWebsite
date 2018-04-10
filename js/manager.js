// input parameters
// parent - object that webGL scene will be appended to
// columns - number of cubes columns
// rows - number of cube rows
// animation - type of user scroll animation
// depth - depth size of each cube
// image - file path of image to be used as texture for cubes
// transition - whether animation occurs on entrance or exit
function Manager (parameters = {}) {

    // make image into images, an array of images
    var player, loadedImage;

    var parent, columns, rows, animation, depth, image, transition;
    var dimensions;

    init ();

    function init () {
        readParameters();
        loadImages();
    };

    function readParameters (){
            parent = parameters.parent || document.body;
            rows = parameters.rows || 10;
            columns = parameters.columns || 10;
            animation = parameters.animation || "scroll";
            depth = parameters.depth || 10;
            image = parameters.image || './images/picasso.jpg';
            transition = parameters.transition || 'exit';
            
            dimensions = {
                rows: rows,
                columns: columns
            };
    };

    function loadImages () {
        var loaded = 0;
        var total = 1;

        var loader = new THREE.TextureLoader();
        loader.load( image,

            // onLoad callback
            function ( LoadedImage ) {
                loaded ++;
                console.log(loaded + "\/" + total + " files loaded \(" + LoadedImage.image.src + "\)");
                loadedImage = LoadedImage;

                console.log( 'Loading complete!');
                scene = new Scene(dimensions, loadedImage, animation, depth, transition);
                scene.play();
                parent.append( scene.getDomElement() );
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function ( item ) {
                console.log( 'There was an error loading ' + item );
            },
        );
    };

    this.play = function () {
        scene.play();
    };

    this.stop = function () {
        scene.stop();
    };

    this.dispose = function () {
        scene.dispose();
    };
}
