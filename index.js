const {
	DeviantartSearch, deviantartRegExp,
	PixivSearch, pixivRegExp,
	TwitterSearch, twitterRegExp
} = require("images-grabber");
const { VKSearch, vkRegExp } = require("./vk");
const { RedditSearch, redditRegExp } = require("./reddit");
let defaultWarned = false;

async function fetchImages(url, params = {}) {
	switch (true) {
		case deviantartRegExp.test(url):
			return fetchImages.deviantart(url, params.deviantart);
		case pixivRegExp.test(url):
			return fetchImages.pixiv(url, params.pixiv);
		case twitterRegExp.test(url):
			return fetchImages.twitter(url, params.twitter);
		case vkRegExp.test(url):
			return fetchImages.vk(url, params.vk);
		case redditRegExp.test(url):
			return fetchImages.reddit(url, params.reddit);
	}
}

fetchImages.deviantart = async function fetchDA(url, params = { unsafe: true }) {
	return new DeviantartSearch(params).getImages(url);
}
fetchImages.pixiv = async function fetchPixiv(url, params = {}) {
	if (!params.username && !params.password) {
		defaultWarned = true;
		params.username = "imagegrabberbot_defaultaccount";
		params.password = "IvkC2sTAOa2is0E5";
		if (!defaultWarned) console.warn(
			`Warning: You're using default credentials provided `+
			`by developer and intended for developing purposes, please register `+
			`your app at https://vk.com/editapp?act=create`
		);
	}
	return new PixivSearch(params).getImages(url);
}
fetchImages.twitter = async function fetchTwitter(url, params = { unsafe: true }) {
	return new TwitterSearch(params).getImages(url);
}
fetchImages.reddit = async function fetchReddit(url, params = { unsafe: true }) { 
	return new RedditSearch(params).getImages(url);
}
fetchImages.vk = async function fetchVK(url, params = {}) { 
	if (!params.accessToken) {
		defaultWarned = true;
		params.accessToken = "cafe74bccafe74bccafe74bc4eca91c6ccccafecafe74bc94b866f3a9acc4324c34d32e";
		if (!defaultWarned) console.warn(
			`Warning: You're using default access token provided `+
			`by developer and intended for developing purposes, please register `+
			`your app at https://vk.com/editapp?act=create`
		);
	}
	return new VKSearch(params).getImages(url);
}

module.exports = fetchImages;
