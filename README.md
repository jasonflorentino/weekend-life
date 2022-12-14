# 🪸 Life

I was reading something today that mentioned [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). I remember making a rudimentary version for my terminal with Python when I was first learning to program. So, instead of finishing what I was reading, I made this one that runs in my browser. That was fun! I guess it's time to go back to whatever it was I was reading. Even though I now just want to optimize and add features to this new rudimentary version. xD

— Jason (Sat, Oct 1, 2022)

## Notes

### Usage

- To use, download this repo and open up `index.html` in your browser.
- You'll need an internet connection as this pulls in [lodash](https://lodash.com/docs/4.17.15) from a CDN
  - Removing it and making a shallow copy might be fine...I think i've done well not to mutate the objects or rely on nonmutated values.
- Reload the browser tab to start again.
- Some mildly intesting logs will show up in the browser console.
- Edit some of 'config' and 'initial state' vars in `script.js` to change things up.

### Details

- Currently we set up by making a bunch of divs and colouring them.
- Painting is done by computing the next state (a 2D array of 0s or 1s), running through each value, and setting the corresponding colour into the DOM node. We skip when there's no change to avoid unecessary writes to the DOM...
- This is called in a `setInterval` with a limit that we set just to be really really nice to our computer. But I guess it wouldn't be the worst thing to just run it forever.
- We also do a simple diff of the current and next state to tell if the image is still and end the loop early.
