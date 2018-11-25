function Cubism (parameters = []) {

    var scene, camera, light, textures, animations, animationInfo, renderer, dom;
    var windowWidth, windowHeight;
    var animationRequest, scrollManager;

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var height = 10;

    init ();

    function init () {
        renderer = new THREE.WebGLRenderer( { antialias: true,  alpha: true  } );
        renderer.setClearColor( 0xffffff, 0);
        renderer.setPixelRatio( window.devicePixelRatio );

        dom = document.createElement( 'div' );
        dom.className = "container";
        dom.appendChild( renderer.domElement );
        document.body.append( dom );

        scrollManager = new Mousewheel();

        setScene();
        setCamera();
        setLight();
        setAnimations();
    };

    function setScene () {
        scene = new THREE.Scene();
    };

    function setCamera () {
        camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
        setCameraPosition();
    };

    function setCameraPosition () {
        var fov = THREE.Math.degToRad( camera.fov );
        camera.position.z = (height / ( 2 * Math.tan (fov/2)));
    };

    function setLight () {
        light = new THREE.HemisphereLight();
        scene.add( light );
    };

    function setAnimations () {
        animations = [];
        animationInfo = ParameterReader(parameters);
        TextureLoader(animationReady, animationInfo);
    }

    function animationReady (Textures) {
        textures = Textures;
        console.log ("Loading complete!");

        for (var i = 0; i < parameters.length; i++) {
            var a = animationInfo[i];
            var animation = new Animation(
                a.dimensions,
                textures[a.primaryImage],
                textures[a.secondaryImage],
                a.animation,
                a.depth,
                a.transition,
                a.start,
                a.end,
                a.color,
                scrollManager,
                camera
            );

            animations.push(animation);
            scrollManager.addAnimation(animation);
            scene.add(animation.getWall());
        }

        play();
    }

    function setSizeToWindow () {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;

        camera.aspect = windowWidth/windowHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( windowWidth, windowHeight );
    };

    function onMouseMove (event) {
    	mouse.x = ( event.clientX / windowWidth ) * 2 - 1;
    	mouse.y = - ( event.clientY / windowHeight ) * 2 + 1;
    };

    function animate () {
        raycast();
        renderer.render( scene, camera );
        requestAnimationFrame( animate );
    };

    function raycast () {
        // make raycaster get position of intersection closest to camera
    	// raycaster.setFromCamera( mouse, camera );
    	// var intersects = raycaster.intersectObjects( wall.group.children );
    	// for ( var i = 0; i < intersects.length; i++ ) {
    	// 	intersects[ i ].object.position.z += 1;
    	// }
    };

    function play () {
        setSizeToWindow ();

        scrollManager.play();
        animationRequest = requestAnimationFrame( animate );

        window.addEventListener( 'resize', setSizeToWindow);
        window.addEventListener( 'mousemove', onMouseMove, false );
    };

    function stop () {
        scrollManager.stop();
        cancelAnimationFrame( animationRequest );

        window.removeEventListener( 'resize', setSizeToWindow);
        window.removeEventListener( 'mousemove', onMouseMove, false );
    };

    this.play = function () {
        play();
    }

    this.stop = function () {
        stop();
    }

    this.dispose = function () {
        stop();
        $(dom).remove();
        scene.remove(light);

        for (var i = 0; i < animations.length; i++) {
            animations[i].dispose();
            scene.remove(animations[i].getWall());
        }
    };

    this.getDomElement = function () {
        return dom;
    };
}
