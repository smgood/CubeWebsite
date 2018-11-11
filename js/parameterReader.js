// input parameters
// columns - number of cubes columns
// rows - number of cube rows
// animation - type of user scroll animation
// depth - depth size of each cube
// primaryImage - file path of image to be used as texture for cubes
// secondaryImage - file path of image that may be used for some animations
// transition - whether animation occurs on entrance or exit
// start - when animation begins
// end - when animation stops
function ParameterReader (scrollManager, camera, parameters = {}, textures) {

    var columns, rows, animation, depth, primaryImage, secondaryImage, transition, start, end;
    var dimensions;

    return createAnimation ();

    function createAnimation () {
        readParameters();

        if (isSideAnimation()) {
            depth = 1;
        }

        return new Animation(
            dimensions,
            textures[primaryImage],
            textures[secondaryImage],
            animation,
            depth,
            transition,
            scrollManager,
            start,
            end,
            camera
        );
    };

    function readParameters (){
            rows = parameters.rows || 10;
            columns = parameters.columns || 10;
            animation = parameters.animation || "scroll";
            depth = parameters.depth || 1;
            primaryImage = parameters.image || parameters.primaryImage || './images/picasso.jpg';
            secondaryImage = parameters.secondaryImage || './images/picasso.jpg';
            transition = parameters.transition || 'exit';
            start = parameters.start || 0;
            end = parameters.end || 10;

            dimensions = {
                rows: rows,
                columns: columns
            };
    };

    function isSideAnimation() {
        return animation == "slideshow" ||
            animation == "spiral";
    };
}
