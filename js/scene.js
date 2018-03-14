function Scene (dimensions, image, transitionType, depth) {

    var $this = this;
    var camera, scene, light, wall, renderer, dom;
    var windowWidth, windowHeight;
    var animationRequest, touchSlideRequest
    var transition;

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var scrollDist = 0;
    var size = {
        width: 10,
        //make into image aspect ratio
        height: 10,
        depth: depth,
    };

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
        wall = new Wall(image, size, dimensions);
        scene.add( wall.getObject() );
    };

    function setTransition () {
        switch (transitionType) {
            case "scroll":
                transition = new Scroll($this, wall);
                break;
            case "gravity":
                transition = new Gravity($this, wall);
                break
            default:
                transition = new Scroll($this, wall);
        };
    };

    function setCameraPosition() {
        var fov = THREE.Math.degToRad( camera.fov );
        camera.position.z = (size.height / ( 2 * Math.tan (fov/2))) + size.depth/2
    };

    function setSizeToWindow () {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        camera.aspect = windowWidth/windowHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( windowWidth, windowHeight );

        // resize image when width is greater than height
        // problem arrizes when raycasting because camera doesn't match mouse

        // camera.aspect = 1;
        // camera.updateProjectionMatrix();
        //
        // if (height > width) {
        //     renderer.setSize( height, height );
        //     var overflow = (height - width) / 2;
        //     renderer.domElement.style.left = -overflow + "px";
        //     renderer.domElement.style.top = "0px";
        // } else {
        //     renderer.setSize( width, width );
        //     var overflow = (width - height) / 2;
        //     renderer.domElement.style.top = -overflow + "px";
        //     renderer.domElement.style.left = "0px";
        // }
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
        scrollDist -= delta * size.height / windowHeight;
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
        // var seconds = new Date().getTime() / 2000;

        // make crazy into new animation class
        // for ( var i = 0; i < rows; i++ ) {
        //     for ( var j = 0; j < columns; j++ ) {
        //         var cube = wall.getCubes()[i][j].getObject();
        //         cube.position.z = Math.tan(seconds + cube.position.y + cube.position.x) / (Math.cos(seconds + cube.position.x));
        //     }
        // }

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

    this.getScrollDistance = function () {
        return scrollDist;
    };

    this.getDomElement = function () {
        return dom;
    };
}
