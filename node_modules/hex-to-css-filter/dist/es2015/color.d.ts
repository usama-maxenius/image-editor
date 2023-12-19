interface HSLData {
    h: number;
    s: number;
    l: number;
}
declare class Color {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number);
    set(r: number, g: number, b: number): void;
    /**
     * Applying cals to get CSS filter for hue-rotate
     *
     * @param {number} [angle=0]
     * @memberof Color
     */
    hueRotate(angle?: number): void;
    /**
     * Applying cals to get CSS filter for grayscale
     *
     * @param {number} [value=1]
     * @memberof Color
     */
    grayscale(value?: number): void;
    /**
     * Applying cals to get CSS filter for sepia
     *
     * @param {number} [value=1]
     * @memberof Color
     */
    sepia(value?: number): void;
    /**
     * Applying cals to get CSS filter for saturate
     *
     * @param {number} [value=1]
     * @memberof Color
     */
    saturate(value?: number): void;
    private multiply;
    /**
     * Applying cals to get CSS filter for brightness
     *
     * @param {number} [value=1]
     * @memberof Color
     */
    brightness(value?: number): void;
    /**
     * Applying cals to get CSS filter for contrast
     *
     * @param {number} [value=1]
     * @memberof Color
     */
    contrast(value?: number): void;
    private linear;
    /**
     * Applying cals to get CSS filter for invert
     *
     * @param {number} [value=1]
     * @memberof Color
     */
    invert(value?: number): void;
    /**
     * transform RGB into HSL values
     *
     * @returns {HSLData}
     * @memberof Color
     */
    hsl(): HSLData;
    /**
     * Normalize the value to follow the min and max for RGB colors
     * min: 0
     * max: 255
     *
     * @private
     * @param {number} value
     * @returns {number}
     * @memberof Color
     */
    private clamp;
}
export { Color };
