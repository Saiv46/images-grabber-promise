"use strict";
const stream = require("stream");
const { extname } = require("path");
const { promisify } = require("util");
const fs = require("fs");
const got = require("got");

const pipeline = promisify(stream.pipeline);
const redditRegExp = /(?:http[s]?:\/\/)?(?:\w+\.)?redd(?:it\.com|\.it)\/(?:r\/\w+\/comments\/(\w+)\/\w+|(\w+))\/?/i

class RedditSearch {
	constructor({ unsafe } = {}) {
		this.allowUnsafe = unsafe;
	}

	async login() { return true }
	getSourceID(url) {
		let [ m, fullId, shortId ] = redditRegExp.exec(url) || [];
		if (!m) throw new Error(`Invalid reddit link`);
		return fullId || shortId || 0;
	}

	_simplifyListing({ data }) {
		if (!data.children) return data;
		return data.children.map(this._simplifyListing, this);
	}

	async _fetchPost(id) {
		try {
			const res = await got(`http://reddit.com/${id}.json`).json();
			return this._simplifyListing(response[0]);
		} catch (err) {
			if (err.response) {
				const { message, error } = err.response;
				throw new Error(`#${error}: ${message}`);
			}
			throw err;
		}
		
	}

	async getImages(url) {
		const posts = await this._fetchPost(this.getSourceID(url));
		return posts
			.filter(({ over_18 }) => !this.allowUnsafe || !over_18, this)
			.map(v => v.url);
	}
	async downloadImage(url, path, index) {
		const pathname = new URL(url).pathname;
		try {
			await pipeline(
				got.stream(url),
				fs.createWriteStream(`${path}/${index}${extname(pathname)}`)
			);
		} catch (e) {
			throw new Error(`Image (${url}) downloading error: ${e}`)
		}
	}
}

module.exports = { RedditSearch, redditRegExp, default: RedditSearch };
