export declare function fetchAny(url: String, params?: {
	deviantart?: Object,
	pixiv?: Object,
	twitter?: Object,
	vk?: Object,
	reddit?: Object
}): Promise<String[]> | undefined;
export declare function fetchDeviantart(
	url: String,
	params?: { unsafe: Boolean }
): Promise<String[]>;
export declare function fetchPixiv(
	url: String,
	params?: { username: String, password: String }
): Promise<String[]>;
export declare function fetchTwitter(
	url: String,
	params?: { unsafe: Boolean }
): Promise<String[]>;
export declare function fetchVK(
	url: String,
	params?: { accessToken: String }
): Promise<String[]>;
export declare function fetchReddit(
	url: String,
	params?: { unsafe: Boolean }
): Promise<String[]>;
export default fetchAny;
