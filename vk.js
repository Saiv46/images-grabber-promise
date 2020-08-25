"use strict";
const stream = require("stream");
const { extname } = require("path");
const { promisify } = require("util");
const fs = require("fs");
const got = require("got");

const pipeline = promisify(stream.pipeline);
const vkRegExp = /(?:http[s]?:\/\/)?(?:m\.|www\.)?(?:vk\.com\/).*?(wall|photo|album|doc)([\-_0-9]+)/i

class VKSearch {
	constructor({ accessToken } = {}) {
		this.accessToken = accessToken;
		this.isLoggedIn = false;
	}

	async login() {
		try {
			await this._callMethod("utils.getServerTime");
		} catch {
			throw new Error(`Invalid VK access token`);
		}
		this.isLoggedIn = true;
	}

	getSourceID(url) {
		const [ m, ...v ] = vkRegExp.exec(url) || [];
		if (!m) throw new Error(`Invalid VK link`);
		return v;
	}

	async _callMethod(method, params) {
		if (!this.isLoggedIn && method !== "utils.getServerTime") {
			await this.login();
		}
		try {
			const { response } = await got(`https://api.vk.com/method/${method}?` +
				new URLSearchParams({
					...params,
					access_token: this.accessToken,
					test_mode: process.env.NODE_ENV === "development",
					v: 5.122
				})
			).json();
			return Array.isArray(response) ? response[0] : response;
		} catch (err) {
			if (err.response) {
				const { error_code, error_msg } = err.response;
				throw new Error(`#${error_code}: ${error_msg}`);
			}
			throw err;
		}
	}

	_selectPhoto(sizes) {
		return sizes.sort((a, b) => (b.width - a.width))[0].url;
	}

	async getImages(url) {
		const [ type, id ] = this.getSourceID(url);
		switch (type) {
			case "wall":
				const { attachments } = await this._callMethod("wall.getById", { posts: id })
				if (!attachments) return [];
				return attachments
					.filter(({ type }) => type === "photo")
					.map(v => this._selectPhoto(v.photo.sizes));
			case "photo":
				const { sizes } = await this._callMethod("photos.getById", {
					photos: id, photo_sizes: true
				});
				return [ this._selectPhoto(sizes) ];
			case "album":
				let [ owner_id, album_id ] = id.split("_");
				if (+album_id === 0) {
					album_id = ["profile", "wall", "saved"][album_id.length - 1];
				}
				const { items } = await this._callMethod("photos.get", {
					owner_id, album_id, photo_sizes: true, count: 1000
				});
				return items.map(({ sizes }) => this._selectPhoto(sizes));
			case "doc":
				const { url } = await this._callMethod("docs.getById", { docs: id });
				return [ url.slice(0, url.indexOf("?")) ];
		}
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

module.exports = { VKSearch, vkRegExp, default: VKSearch };
