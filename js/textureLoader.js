// parameters
// animation - type of user scroll animation
// primaryImage - file path of image to be used as texture for cubes
// secondaryImage - file path of image that may be used for some animations
function TextureLoader (animationReady, animationInfoList) {

    var textures, loaded, total;

    init ();

    function init () {
        textures = {};
        loaded = 0;
        total = animationInfoList.length * 2;

        for (var i = 0; i < animationInfoList.length; i++) {
            loadAnimationTexture (animationInfoList[i]);
        }
    }

    function loadAnimationTexture (animationInfo) {
        var {animation, primaryImage, secondaryImage} = animationInfo;

        createTexture(primaryImage);

        if (hasSecondaryImage(animation)){
            createTexture(secondaryImage);
        } else {
            textureLoaded ();
        }
    };

    function createTexture(imageSrc) {
        if (textures[imageSrc]) {
            textureLoaded ();
        } else {
            textures[imageSrc] = "loading";
            var extension = imageSrc.split('.').pop();
            if (extensions.image.includes(extension)){
                loadImage(imageSrc);
            } else if (extensions.video.includes(extension)) {
                loadVideo(imageSrc);
            } else {
                console.log ('file extension not supported');
            }
        }
    };

    function hasSecondaryImage(animation) {
        return animation == "swap" ||
            animation == "slideshow" ||
            animation == "spiral";
    }

    function loadImage (imageSrc) {
        var loader = new THREE.TextureLoader();
        loader.load( imageSrc,

            // onLoad callback
            function ( imageTexture ) {
                setTexture (imageSrc, imageTexture);
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

        video.onloadeddata = loadingManager;
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
            var videoTexture = new THREE.VideoTexture( video );
            setTexture (videoSrc, videoTexture);
        };

        function errorManager () {
            console.log( 'There was an error loading ' + source.src );
        };
    };

    function setTexture (source, texture) {
        console.log("loaded " + source);

        setTextureFormat(texture);
        textures[source] = texture;
        textureLoaded ();
    }

    function setTextureFormat (texture) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
    }

    function textureLoaded () {
        loaded ++;
        if (loaded == total) {
            animationReady(textures);
        }
    }
}
