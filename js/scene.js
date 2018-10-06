function Scene (dimensions, imageTexture, animationType, depth, transitionType, imageAspect) {

    var $this = this;
    var camera, scene, light, wall, renderer, dom;
    var windowWidth, windowHeight;
    var animationRequest, touchSlideRequest
    var transition;

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var scrollDist = 0;
    var size = new THREE.Vector3(
        10*imageAspect,
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
        wall = new Wall(imageTexture, size, dimensions);
        scene.add( wall.getObject() );
    };

    function setTransition () {
        switch (animationType) {
            case "scroll":
                transition = new Scroll($this, wall, transitionType, getDropDistance());
                break;
            case "gravity":
                transition = new Gravity($this, wall, transitionType, getDropDistance());
                break
            case "tetris":
                transition = new Tetris($this, wall, transitionType, getDropDistance());
                break
            default:
                transition = new Scroll($this, wall, transitionType, getDropDistance());
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

    function onMouseMove( event ) {
    	mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
    	mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;
    };

    function onDocumentMouseWheel( event ) {
        updateScrollDistance (event.wheelDeltaY * 0.05);
    };

    function onDocumentTouchStart( event ) {
        event.preventDefault();
        cancelAnimationFrame( touchSlideRequest );

        var touchStart = event.touches[0].clientY;
        var touchDistance = 0;

        function touchMove(event) {
            event.preventDefault();

            touchDistance = event.touches[0].clientY - touchStart;
            updateScrollDistance (touchDistance);
            touchStart = event.touches[0].clientY;
        };

        function touchEnd(event) {
            event.preventDefault();
            touchSlideRequest = requestAnimationFrame( slide );

            window.removeEventListener('touchmove', touchMove, false);
            window.removeEventListener('touchend', touchEnd, false);
        };

        function slide () {
            touchDistance *= 0.92;
            updateScrollDistance (touchDistance);

            if (Math.abs(touchDistance) > .1) {
                touchSlideRequest = requestAnimationFrame( slide );
            } else {
                cancelAnimationFrame( touchSlideRequest );
            }
        };

        window.addEventListener('touchmove', touchMove, false);
        window.addEventListener('touchend', touchEnd, false);
    };

    function updateScrollDistance (delta) {
        scrollDist -= delta * size.y / windowHeight;
        if (scrollDist < 0) {
            scrollDist = 0;
        }
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
        window.addEventListener('mousewheel', onDocumentMouseWheel, false);
        window.addEventListener('touchstart', onDocumentTouchStart, false);
    };

    this.stop = function () {
        transition.stop();
        cancelAnimationFrame( animationRequest );

        window.removeEventListener( 'resize', setSizeToWindow);
        window.removeEventListener( 'mousemove', onMouseMove, false );
        window.removeEventListener('mousewheel', onDocumentMouseWheel, false);
        window.removeEventListener('touchstart', onDocumentTouchStart, false);
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
