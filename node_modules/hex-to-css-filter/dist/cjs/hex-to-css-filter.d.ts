export interface HexToCssResult {
    /** How many times the script was called to solve the color */
    called: number;
    /** CSS filter generated based on the Hex color */
    filter: string;
    /** The received color */
    hex: string;
    /** Percentage loss value for the generated filter */
    loss: number;
    /** Hex color in RGB */
    rgb: [number, number, number];
    /** Percentage loss per each color type organized in RGB: red, green, blue, h, s, l. */
    values: [number, number, number, number, number, number];
    /** Boolean that returns true if value was previously computed.
     * So that means the returned value is coming from the in-memory cached */
    cache: boolean;
}
export interface HexToCssConfiguration {
    /**
     * Acceptable color percentage to be lost.
     * @default 5
     */
    acceptanceLossPercentage?: number;
    /**
     * Maximum checks that needs to be done to return the best value.
     * @default 10
     */
    maxChecks?: number;
    /**
     * Boolean value that forces recalculation for CSS filter generation.
     * @default false
     */
    forceFilterRecalculation?: boolean;
}
/**
 * A function that transforms a HEX color into CSS filters
 *
 * @param colorValue string hexadecimal color
 * @param opts HexToCssConfiguration function configuration
 *
 */
export declare const hexToCSSFilter: (colorValue: string, opts?: HexToCssConfiguration) => HexToCssResult;
/**
 * A function that clears cached results
 *
 * @param  {string} key? HEX string value passed previously `#24639C`. If not passed, it clears all cached results
 * @returns void
 */
export declare const clearCache: (key?: string | undefined) => void;
