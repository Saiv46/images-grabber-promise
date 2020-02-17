# images-grabber-promise

Simplified wrapper for [images-grabber](https://www.npmjs.com/package/images-grabber) which also supports VK and Reddit links.

Install with `npm i images-grabber images-grabber-promise`

## Usage

```js
const fetchImage = require("images-grabber-promise");
let [ first, ...images ] = await fetchImage(url, {
	// Provide options for services
	pixiv: {
		// Credentials of default account will be used
	},
	twitter: {
		unsafe: false // true by default in Twitter/DeviantArt/Reddit
	}
});
// OR
let [ first, ...images ] = await fetchImage.twitter(url, { unsafe: false });
```
