export declare class VKSearch {
    constructor(options: { accessToken: String } = {});
    /**
     * Gets links of images from wall/album/photo/docs
     * @returns links of images
     */
    getImages(source: String): Promise<String[]>;
    /**
     * Downloads image from VKontakte url
     * @param url VKontakte image url
     * @param path Path to images folder
     * @param index Index of image
     */
    downloadImage(url: String, path: String, index: Number): Promise<void>;
    /**
     * Check access token
     */
    login(): Promise<Boolean>;
    protected getSourceID(source: String): String[];
	private _callMethod(method: String, params: Object): Object;
    private _selectPhoto(sizes: Object[]): String;
}
export default VKSearch;
export declare const vkRegExp: RegExp;
