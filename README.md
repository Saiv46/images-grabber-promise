# Images-Grabber-Promise

Simplified wrapper for [images-grabber](https://www.npmjs.com/package/images-grabber)

## Usage

Install: `npm i images-grabber images-grabber-promise`

Import: 
```js
const fetchImage = require("images-grabber-promise");
```

Fetch image from Pixiv/Twitter/DeviantArt/VK/Reddit:
```js
let [ first, ...images ] = await fetchImage(url, {
	// Provide options for services
	pixiv: {
		// Credentials of default account will be used
	},
	twitter: {
		unsafe: false // true by default in Twitter/DeviantArt/Reddit
	}
});
```
