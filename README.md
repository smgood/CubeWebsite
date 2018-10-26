# Cubism
- Cubism is an easy to use, open source javascript library. Use it to create full-screen, 3D scrolling websites, composed entirely of cubes!
- Demo: http://smgoodrich.com/cubes

# To Do
## Features:
1. animation ideas: none, explode, pinpression (moves in z axis, rotates to mouse, mouse is repulsive magnet), zipper, spiral!
2. option to set cube opacity, texture (shininess, metallic), and color (hex, random, or match image)
3. Support full screen
    - Figure out optimal amount of rows and columns based on window size, dimensions parameters, & image aspect ratio
    - dispose and recreate scene on resize (in manager)
4. support all browsers and mobile (make play button for videos)
5. improve dispose functionality to remove all memory leaks
6. Keep code clean & readable
7. Add layers to support multiple animations at once
8. store + reuse same video/image if already loaded (to sync videos & improve speed)

## Would like:
1. scroll bar and navigation dots
2. support having cubes of different sizes in wall
3. Allow one big image or each cube a separate image/video
4. raycasting cube plays video / supports link

## Bugs
1. Video doesn't load sometimes
2. Buffer when animation first displayed
