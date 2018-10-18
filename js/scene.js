function Scene (dimensions, primaryImage, secondaryImage, animationType, depth, transitionType, scrollManager, start, end) {
    var $this = this;
    var camera, scene, light, wall, renderer, dom;
    var windowWidth, windowHeight;
    var animationRequest, touchSlideRequest
    var transition;

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var scrollDist = 0;
    var size = new THREE.Vector3(
        10*getAspectRatio(primaryImage),
        10,
        depth/10,
    );

    init ();

    function init () {
        renderer = new THREE.WebGLRenderer( { antialias: true,  alpha: true  } );
        renderer.setClearColor( 0xffffff, 0);
        renderer.setPixelRatio( window.devicePixelRatio );

        dom = document.createElement( 'div' );
        dom.className = "container";
        dom.appendChild( renderer.domElement );

        setScene();
        setLight();
        setCamera();
        setWall();
        setTransition()
    };

    function setScene () {
        scene = new THREE.Scene();
    };

    function setCamera () {
        camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000 );
        setCameraPosition();
    };

    function setLight () {
        light = new THREE.HemisphereLight();
        scene.add( light );
    };

    function setWall () {
        wall = new Wall(primaryImage, size, dimensions);
        scene.add( wall.getObject() );
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
                var aspectRatioDiff  = getAspectRatio(secondaryImage) / getAspectRatio(primaryImage);
                transition = new Swap(scrollManager, wall, secondaryImage, aspectRatioDiff, start, end);
                break;
            default:
                transition = new Scroll(scrollManager, wall, transitionType, getDropDistance());
        };
    };

    function setCameraPosition() {
        var fov = THREE.Math.degToRad( camera.fov );
        camera.position.z = (size.y / ( 2 * Math.tan (fov/2))) + size.z/2;
    };

    function getVerticalFovFront() {
        return size.y;
    };

    function getVerticalFovBack() {
        var fov = THREE.Math.degToRad( camera.fov );
        workingDistance = Math.abs(camera.position.z) + size.z/2;
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

    function setSizeToWindow () {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        camera.aspect = windowWidth/windowHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( windowWidth, windowHeight );

        // resize scene by finding optimal rows and columns
        // do resize in manager
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

    function onMouseMove( event ) {
    	mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
    	mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;
    };

    function animate() {
        raycast();
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
    };

    function raycast() {
        // make raycaster get position of intersection closest to camera
    	// raycaster.setFromCamera( mouse, camera );
    	// var intersects = raycaster.intersectObjects( wall.group.children );
    	// for ( var i = 0; i < intersects.length; i++ ) {
    	// 	intersects[ i ].object.position.z += 1;
    	// }
    };

    this.play = function () {
        setSizeToWindow ();

        transition.play();
        animationRequest = requestAnimationFrame( animate );

        window.addEventListener( 'resize', setSizeToWindow);
        window.addEventListener( 'mousemove', onMouseMove, false );
    };

    this.stop = function () {
        transition.stop();
        cancelAnimationFrame( animationRequest );

        window.removeEventListener( 'resize', setSizeToWindow);
        window.removeEventListener( 'mousemove', onMouseMove, false );
    };

    this.dispose = function () {
        $this.stop();
        $(dom).remove();

        wall.dispose();
        scene.remove(wall.getObject());
        scene.remove(light);
    };

    this.getScrollDistance = function () {
        return scrollDist;
    };

    this.getDomElement = function () {
        return dom;
    };
}
