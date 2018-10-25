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
function Loader (animationReady, scrollManager, camera, parameters = {}) {

    var columns, rows, animation, depth, primaryImage, secondaryImage, transition, start, end;
    var animation, dimensions;
    var primaryTexture, secondaryTexture;

    var loaded = 0;
    var total = 1;

    init ();

    function init () {
        readParameters();

        createTexture(primaryImage);
        if (requiresSecondaryImage(animation)){
            total++;
            createTexture(secondaryImage);
        }
    };

    function readParameters (){
            rows = parameters.rows || 10;
            columns = parameters.columns || 10;
            animation = parameters.animation || "scroll";
            depth = parameters.depth || 10;
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

    function createTexture(imageSrc) {
        var extension = imageSrc.split('.').pop();
        if (extensions.image.includes(extension)){
            loadImage(imageSrc);
        } else if (extensions.video.includes(extension)) {
            loadVideo(imageSrc);
        } else {
            console.log ('file extension not supported');
        }
    };

    function requiresSecondaryImage(animation) {
        return animation == "swap" || animation == "slideshow";
    }

    function loadImage (imageSrc) {
        var loader = new THREE.TextureLoader();
        loader.load( imageSrc,

            // onLoad callback
            function ( imageTexture ) {
                loaded ++;
                console.log(loaded + "\/" + total + " files loaded \(" + imageTexture.image.src + "\)");

                if (primaryImage == imageSrc) {
                    primaryTexture = imageTexture;
                }
                if (secondaryImage == imageSrc) {
                    secondaryTexture = imageTexture;
                }

                if (loaded == total) {
                    createWall ();
                }
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function ( item ) {
                console.log( 'There was an error loading ' + item );
            },
        );
    };

    function loadVideo (videoSrc) {
        var video = document.createElement('video');

        video.onloadedmetadata = loadingManager;
        video.onerror = errorManager;
        video.oncanplay = playVideo;

        video.autoplay=true;
        video.preload = 'auto';
        video.loop=true;
        video.muted=true;

        video.setAttribute('crossorigin', 'anonymous');
        video.setAttribute('playsinline','');

        var source = document.createElement('source');
        source.src = videoSrc;
        video.appendChild(source);
        //source.type = "video/mp4";

        function playVideo () {
            video.play();
        };

        function loadingManager () {
            loaded ++;
            console.log(loaded + "\/" + total + " files loaded \(" + source.src + "\)");
            var videoTexture = new THREE.VideoTexture( video );

            if (primaryImage == videoSrc){
                primaryTexture = videoTexture;
            }
            if (secondaryImage == videoSrc){
                secondaryTexture = videoTexture;
            }

            if (loaded == total) {
                createWall ();
            }
        };

        function errorManager () {
            console.log( 'There was an error loading ' + source.src );
        };
    };

    function createWall () {
        setTextureFormat(primaryTexture);
        if (secondaryTexture) {
            setTextureFormat(secondaryTexture);
        }

        animationReady(
            new Animation(dimensions, primaryTexture, secondaryTexture, animation, depth, transition, scrollManager, start, end, camera)
        );
    };

    function setTextureFormat (texture) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
    }
}
