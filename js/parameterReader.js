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
// colorType - type of mat color
// colorValue - value if solid color (string, rgb, hex, etc)
// opacity - opacity between 0 and 1
function ParameterReader (parametersList) {

    return getAnimationInfo ();

    function getAnimationInfo () {
        var animationsInfo = [];
        for (var i = 0; i < parametersList.length; i++) {
            animationsInfo.push (readParameters(parametersList[i]));
        }
        return animationsInfo;
    };

    function readParameters (parameters = {}){
            var columns, rows, animation, depth, primaryImage, secondaryImage, transition, start, end, colorType, colorValue, opacity;
            var dimensions, color;

            rows = parameters.rows || 10;
            columns = parameters.columns || 10;
            animation = parameters.animation || "scroll";
            depth = parameters.depth || 1;
            primaryImage = parameters.image || parameters.primaryImage || './images/picasso.jpg';
            secondaryImage = parameters.secondaryImage || './images/picasso.jpg';
            transition = parameters.transition || 'exit';
            start = parameters.start || 0;
            end = parameters.end || 10;
            colorType = parameters.colorType || "rainbow";
            colorValue = parameters.colorValue || "blue";
            opacity = parameters.opacity || 1;

            dimensions = {
                rows: rows,
                columns: columns
            };

            color = {
                type: colorType,
                value: colorValue,
                opacity: opacity
            };

            if (isSideAnimation(animation)) {
                depth = 1;
            }

            return {
                dimensions,
                primaryImage,
                secondaryImage,
                animation,
                depth,
                transition,
                start,
                end,
                color,
            };
    };

    function isSideAnimation(animation) {
        return animation == "slideshow" ||
            animation == "spiral";
    };
}
