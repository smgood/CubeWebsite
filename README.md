# Cubism
- Cubism is an easy to use, open source javascript library. Use it to create full-screen, 3D scrolling websites, composed entirely of cubes!
- Demo: http://smgoodrich.com/cubes

# To Do
## Must have features:
1. clean up code
2. dispose function
3. create animations: none, swap, explode, pinpression, slideshow
4. set animation speed
    - make function that takes in animation start and stop, page offset, and scroll speed and returns corresponding scroll distance
5. support multiple pages/animations
    - Set scroll distance offset for animation
    - Dispose scene when scroll before or after (to minimize memory usage)
6. option to set cube opacity, texture (shininess, metallic), and color (hex, random, or match image)
7. Support full screen
    - Figure out optimal amount of rows and columns based on window size, dimensions parameters, & image aspect ratio
    - dispose and recreate scene on resize (in manager)
8. support all browsers and mobile

## Would like features:
1. scroll bar and navigation dots
2. support having cubes of different sizes in wall
3. Allow one big image or each cube a separate image/video
4. raycasting cube plays video / supports link
