// input parameters
// parent - object that webGL scene will be appended to
// columns - number of cubes columns
// rows - number of cube rows
// animation - type of user scroll animation
// depth - depth size of each cube
// image - file path of image to be used as texture for cubes
// transition - whether animation occurs on entrance or exit
function Manager (parameters = {}) {

    var parent, columns, rows, animation, depth, image, transition;
    var scene, dimensions, getAspectRatio;

    var textures = [];
    var loaded = 0;
    var total = 1;
    var video;

    init ();

    function init () {
        readParameters();

        var extension = image.split('.').pop();
        if (extensions.image.includes(extension)){
            getAspectRatio = getImageAspectRatio;
            loadImage();
        } else if (extensions.video.includes(extension)) {
            getAspectRatio = getVideoAspectRatio;
            loadVideo();
        } else {
            console.log ('file extension not supported');
        }
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

    function loadImage () {
        var loader = new THREE.TextureLoader();
        loader.load( image,

            // onLoad callback
            function ( imageTexture ) {
                loaded ++;
                console.log(loaded + "\/" + total + " files loaded \(" + imageTexture.image.src + "\)");

                textures.push(imageTexture);
                createScene (imageTexture);
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function ( item ) {
                console.log( 'There was an error loading ' + item );
            },
        );
    };

    function loadVideo () {
        var video = document.createElement('video');

        video.onloadeddata = loadingManager;
        video.onerror = errorManager;
        video.oncanplaythrough = playVideo;

        video.autoplay=true;
        video.preload = 'auto';
        video.loop=true;
        video.muted=true;

        video.setAttribute('crossorigin', 'anonymous');
        video.setAttribute('playsinline','');

        var source = document.createElement('source');
        source.src = image;
        video.appendChild(source);
        //source.type = "video/mp4";

        function playVideo () {
            video.play();
        };

        function loadingManager () {
            loaded ++;
            console.log(loaded + "\/" + total + " files loaded \(" + source.src + "\)");

            var videoTexture = new THREE.VideoTexture( video );
            textures.push(videoTexture);
            createScene (videoTexture);
        };

        function errorManager () {
            console.log( 'There was an error loading ' + source.src );
        };
    };

    function createScene (texture) {
        console.log( 'Loading complete!');
        var aspectRatio = getAspectRatio (texture)

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        scene = new Scene(dimensions, texture, animation, depth, transition, aspectRatio);
        scene.play();
        parent.append( scene.getDomElement() );
    }

    function getVideoAspectRatio (videoTexture) {
        return videoTexture.image.videoWidth / videoTexture.image.videoHeight;
    }

    function getImageAspectRatio (imageTexture) {
        return imageTexture.image.width / imageTexture.image.height;
    }

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
