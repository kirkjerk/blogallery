# blogallery
super lightweight, zero-config vanilla javascript image gallery and full screen viewer

## rationale

I wanted a better gallery system for my blog, with 3 modes:

*  small, thumbnail image gallery, clicking opens:
*  browsable (download-friendly) size images embedded in page
*  full-page image gallery (for the raw, un-resized original photo.)

(Also I wanted to minimize the amount of refactoring I had to do on older gallery pages of my blog)

I wanted the full size gallery to support arrow keys and be relative mobile-friendly.

## usage

The system is based around `a href` links to fullsize images, wrapping "inline-size" images
(roughly column width). Those inline-size images are displayed small when in initial thumbnail mode.

Here is some sample usage. Nothing besides including the css file, the script file, and adding the 
"blogallery" class is needed, the rest relies on one of the following structures to designate the currently
displayed and the full size images.

```
<link rel="stylesheet" type="text/css" href="blogallery.css" />
<script src="blogallery.js"></script>

<div class="blogallery">
  <h2 class="blogallery-caption">Open Photo Gallery</h2>
  
  <a href="IMG1-FULLSIZE.jpg">
    <img src="IMG1-INLINE-SIZE.jpg">
  </a>
  
  <img src="IMG2-INLINE-SIZE.jpg">
  
  <figure>
    <a href="IMG3-FULLSIZE.jpg">
      <img src="IMG3-INLINE-SIZE.jpg">
    </a>
    <figcaption>
      Caption information to be duplicated in full size gallery.
    </figcaption>    
  </figure>  

  <figure>
    <img src="IMG4-INLINE-SIZE.jpg">
    <figcaption>
      Caption information to be duplicated in full size gallery.
    </figcaption>    
  </figure>  
  
  <p>
    Additional information that will be hidden in initial gallery mode
    but displayed once the gallery is opened.
  </p>
  
</div>

```

On initial load, the "inline-size" images will be displayed at thumbail scale. (The script uses
document ready to look for instances of `.blogallery`)

Clicking on an image (or the gallery itself) displays all the images without much extraneous formatting
(scrolling to the image if needed)

Click on an inline-size images opens up the full-screen viewer to that image, with left/right arrow and esc-key support.

You can see it in action at [stuff.alienbill.com/blogallery/](https://stuff.alienbill.com/blogallery/)

## improvements

This was mostly meant to "scratch my own itch" on my [personal blog](https://kirk.is/) - so it is simple
css and js files.

If there is literally any expressed interest, I would consider wrapping this as package and/or allowing it 
to be invoked programatically or a standalone mode for the fullscreen viewer.

Other possible features would include swipe support (though honestly I think the current system works 
well for mobile) but again simplicity was favored of feature richness.
