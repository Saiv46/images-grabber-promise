export declare class RedditSearch {
    constructor(options: { unsafe: Boolean });
    /**
     * Gets links of images from post
     * @returns links of images
     */
    getImages(source: String): Promise<String[]>;
    /**
     * Downloads image from reddit url
     * @param url Reddit image url
     * @param path Path to images folder
     * @param index Index of image
     */
    downloadImage(url: String, path: String, index: Number): Promise<void>;
    login(): Promise<true>;
    protected getSourceID(source: String): String[];
	private _fetchPost(id: String): Object;
}
export default RedditSearch;
export declare const redditRegExp: RegExp;
