# Cubism
- Cubism is an easy to use, open source javascript library. Use it to create full-screen, 3D scrolling websites, composed entirely of cubes!
- Demo: http://smgoodrich.com/cubes

# To Do
## Must have features:
1. animations ideas: none, explode, pinpression (moves in z axis, rotates to mouse, mouse is repulsive magnet), slideshow, zipper
2. support multiple pages/animations
    - Set scroll distance offset for animation
    - Stop scene (or dispose) when scroll before or after
3. option to set cube opacity, texture (shininess, metallic), and color (hex, random, or match image)
4. Support full screen
    - Figure out optimal amount of rows and columns based on window size, dimensions parameters, & image aspect ratio
    - dispose and recreate scene on resize (in manager)
5. support all browsers and mobile (make play button for videos)
6. improve dispose functionality to remove all memory leaks
7. Keep code clean & readable
8. make depth relative to cube size instead of wall
9. Make all scenes into 1 scene and use layers

## Would like features:
1. scroll bar and navigation dots
2. support having cubes of different sizes in wall
3. Allow one big image or each cube a separate image/video
4. raycasting cube plays video / supports link
