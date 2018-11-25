function Animation (dimensions, primaryImage, secondaryImage, animationType, depth, transitionType, start, end, color, scrollManager, camera) {

    var wall;
    var transition;

    var size = new THREE.Vector3(
        10*getAspectRatio(primaryImage),
        10,
        10*getAspectRatio(primaryImage)*depth / dimensions.columns
    );

    init ();

    function init () {
        setWall();
        setTransition();
    };

    function setWall () {
        wall = new Wall(primaryImage, size, dimensions, color);
        wall.getObject().visible = false;
    };

    function setTransition () {
        switch (animationType) {
            case "gravity":
                transition = new Gravity(scrollManager, wall, transitionType, getDropDistance() + accountForCubeDiagonal(), start, end);
                break;
            case "scroll":
                transition = new Scroll(scrollManager, wall, transitionType, getDropDistance(), start, end);
                break;
            case "tetris":
                transition = new Tetris(scrollManager, wall, transitionType, getDropDistance(), start, end);
                break;
            case "swap":
                transition = new Swap(scrollManager, wall, secondaryImage, getAspectRatioDiff(), start, end);
                break;
            case "slideshow":
                transition = new Slideshow(scrollManager, wall, secondaryImage, getAspectRatioDiff(), start, end);
                break;
            case "spiral":
                transition = new Spiral(scrollManager, wall, secondaryImage, getAspectRatioDiff(), start, end);
                break;
            default:
                transition = new Scroll(scrollManager, wall, transitionType, getDropDistance(), start, end);
        };
    };

    function getVerticalFovFront() {
        return size.y;
    };

    function getVerticalFovBack() {
        var fov = THREE.Math.degToRad( camera.fov );
        workingDistance = Math.abs(camera.position.z) + size.z;
        return (2 * workingDistance * Math.tan (fov/2));
    };

    // Diagonal is longest line across cube
    function accountForCubeDiagonal(){
        var cubeSize = wall.getCubeSize();
        var cubeDiagonal = Math.sqrt(
            Math.pow(cubeSize.x, 2) +
            Math.pow(cubeSize.y, 2) +
            Math.pow(cubeSize.z, 2)
        );
        return (cubeDiagonal - cubeSize.y)/2
    };

    function getDropDistance() {
        return (size.y + getVerticalFovBack()) / 2;
    };

    function getAspectRatio (texture) {
        return getVideoAspectRatio(texture) || getImageAspectRatio(texture);
    }

    function getVideoAspectRatio (videoTexture) {
        return videoTexture.image.videoWidth / videoTexture.image.videoHeight;
    }

    function getImageAspectRatio (imageTexture) {
        return imageTexture.image.width / imageTexture.image.height;
    }

    function getAspectRatioDiff () {
        return getAspectRatio(secondaryImage) / getAspectRatio(primaryImage);
    }

    function play () {
        transition.play();
    };

    function stop () {
        transition.stop();
    };

    this.play = function () {
        play();
    }

    this.stop = function () {
        stop();
    }

    this.dispose = function () {
        stop();
        wall.dispose();
    };

    this.getStart = function () {
        return start;
    }

    this.getEnd = function () {
        return end;
    }

    this.showWall = function () {
        wall.getObject().visible = true;
        play();
    }

    this.hideWall = function () {
        wall.getObject().visible = false;
        stop();
    }

    this.isVisible = function () {
        return wall.getObject().visible;
    }

    this.getWall = function () {
        return wall.getObject();
    }
}
