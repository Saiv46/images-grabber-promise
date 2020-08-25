images-grabber-promise
=======================================

[![Status](https://github.com/Saiv46/images-grabber-promise/workflows/Package/badge.svg)](https://github.com/Saiv46/images-grabber-promise/actions)

Promise wrapper for [images-grabber](https://www.npmjs.com/package/images-grabber) with some features.

## Features

* Download from any supported services!

* Reddit and VKontakte support!

* Try this package in action before registering in Pixiv/VK!

## Installation
`npm i images-grabber images-grabber-promise`

(`images-grabber` is a peer dependency)

## Usage

```js
import fetchImages from "images-grabber-promise";

// Fetch images from any services supported
let [ first, second, ...images ] = await fetchImages(url, {
	// Default options
	throw: false, // Throw error instead of returning undefined
	pixiv: {
		// username: "Nickname",
		// password: "p133w0rd"
	},
	vk: {
		// accessToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
		// Register your app at https://vk.com/editapp?act=create to get token
	},
	twitter: { unsafe: true },
	deviantart: { unsafe: true },
	reddit: { unsafe: true }
});

// Or fetch specific profile (can throw exception)
let images = await fetchImage.twitter(url, { unsafe: false });
```

## Contribution
Feel free to add more services and features!

## License

This project is licensed under the ISC License