import { Color } from './color';
import { HexToCssConfiguration } from './hex-to-css-filter';
interface SPSAPayload {
    /** How many times the script was called to solve the color */
    called?: number;
    /** Percentage loss value for the generated filter */
    loss: number;
    /** Percentage loss per each color type organized in RGB: red, green, blue, h, s, l. */
    values: [number, number, number, number, number, number];
}
declare class Solver {
    private target;
    private targetHSL;
    private reusedColor;
    private options;
    constructor(target: Color, options: HexToCssConfiguration);
    /**
     * Returns the solved values for the
     *
     * @returns {(SPSAPayload & { filter: string; })}
     * @memberof Solver
     */
    solve(): SPSAPayload & {
        /** CSS filter generated based on the Hex color */
        filter: string;
    };
    /**
     * Solve wide values based on the wide values for RGB and HSL values
     *
     * @private
     * @returns {SPSAPayload}
     * @memberof Solver
     */
    private solveWide;
    /**
     * Solve narrow values based on the wide values for the filter
     *
     * @private
     * @param {SPSAPayload} wide
     * @returns {SPSAPayload}
     * @memberof Solver
     */
    private solveNarrow;
    /**
     * Returns final value based on the current filter order
     * to get the order, please check the returned value
     * in `css()` method
     *
     * @private
     * @param {number} value
     * @param {number} idx
     * @returns {number}
     * @memberof Solver
     */
    private fixValueByFilterIDX;
    private spsa;
    /**
     * Checks how much is the loss for the filter in RGB and HSL colors
     *
     * @private
     * @param {SPSAPayload['values']} filters
     * @returns {number}
     * @memberof Solver
     */
    private loss;
    /**
     * Returns the CSS filter list for the received HEX color
     *
     * @private
     * @param {number[]} filters
     * @returns {string}
     * @memberof Solver
     */
    private css;
}
export { Solver };
