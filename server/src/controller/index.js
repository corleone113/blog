require('@babel/register', {
    // only: [
    //     // File paths that **don't** match this regex are not compiled
    //     // /my_es6_folder/,

    //     // File paths that **do not** return true are not compiled
    //     function(filepath) {
    //       return filepath === "/path/to/es6-file.js";
    //     }
    //   ],

    // Setting this will remove the currently hooked extensions of `.es6`, `.es`, `.jsx`, `.mjs`
    // and .js so you'll have to add them back if you want them to be used again.
    extensions: [".js"],

    // Setting this to false will disable the cache.
    cache: true,
});
require('./server');