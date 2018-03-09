function Scene (image) {

    var $this = this;
    var camera, scene, light, wall, renderer;
    var width, height;
    var animationRequest, touchSlideRequest
    var transition;

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var scrollDist = 0;

    // pass variables into class
    var rows = 12;
    var columns = 12;
    var depth = 0.5;
    var transitionType = "gravity";

    // make dom private
    this.dom = document.createElement( 'div' );
    this.dom.className = "container";

    init ();

    function init () {
		renderer = new THREE.WebGLRenderer( { antialias: true,  alpha: true  } );
		renderer.setClearColor( 0xffffff, 0);
		renderer.setPixelRatio( window.devicePixelRatio );

		$this.dom.appendChild( renderer.domElement );

		setScene();
		setLight();
		setCamera();
        setWall();
        setTransition(transitionType)
	};

    function setScene () {
        scene = new THREE.Scene();
    };

	function setCamera () {
		camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000 );
		camera.position.z = 10;
	};

	function setLight () {
		light = new THREE.HemisphereLight();
		scene.add( light );
	};

    function setWall () {
        wall = new Wall(0, getHorizontalFov(0, depth), getVerticalFov(0, depth), depth, columns, rows, image);
        scene.add( wall.group );
    };

    // make function start on play / pause
    // make gravity not have to pass in dimensions
    function setTransition (transitionType) {
        switch (transitionType) {
            case "scroll":
                transition = new Scroll($this, wall);
                break;
            case "gravity":
                transition = new Gravity($this, wall, rows, columns);
                break
            default:
                transition = new Scroll($this, wall);
        }
    }

    function getVerticalFov(objectPos, objectDepth) {
        var fov = THREE.Math.degToRad( camera.fov );
        workingDistance = Math.abs(objectPos - camera.position.z) - objectDepth/2;
        return (2 * workingDistance * Math.tan (fov/2));
    };

    function getHorizontalFov(objectPos, objectDepth) {
        return getVerticalFov(objectPos, objectDepth) * camera.aspect;
    };

	function setSizeToWindow () {
		width = window.innerWidth;
		height = window.innerHeight;

        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );

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
    	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    };

    function onDocumentMouseWheel( event ) {
        updateScrollDistance (event.wheelDeltaY * 0.05);
    }

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
        }

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
        scrollDist -= delta;
        if (scrollDist < 0) {
            scrollDist = 0;
        }
    };

    this.getScrollDistance = function () {
        return scrollDist;
    }

    this.getRelativeScrollDistance = function () {
        return scrollDist * getVerticalFov(0, 1) / height;
    }

	function animate() {
        raycast();
		renderer.render( scene, camera );
		requestAnimationFrame( animate );
	};

    function raycast() {
        var seconds = new Date().getTime() / 2000;

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
        transition.pause();
		cancelAnimationFrame( animationRequest );

		window.removeEventListener( 'resize', setSizeToWindow);
        window.removeEventListener( 'mousemove', onMouseMove, false );
        window.removeEventListener('mousewheel', onDocumentMouseWheel, false);
        window.removeEventListener('touchstart', onDocumentTouchStart, false);
	};
}
