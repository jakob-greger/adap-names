export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        if (delimiter == undefined) {
            this.delimiter = DEFAULT_DELIMITER;
        } else {
            this.delimiter = delimiter;
        }
        this.components = other.slice();
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     * @methodtype conversion-method
     */
    public asString(delimiter: string = this.delimiter): string {
        const unescape = (s: string) => {
            let res: string = '';
            for (let i = 0; i < s.length; i++) {
                const c = s[i];
                if (c === ESCAPE_CHARACTER && i + 1 < s.length) {
                    i++;
                    res += s[i];
                } else {
                    res += c;
                }
            }
            return res;
        };

        return this.components.map(str => unescape(str)).join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     * @methodtype conversion-method
     */
    public asDataString(): string {
        const escapeComp = (s: string) => {
            let res: string = '';
            for (let i = 0; i < s.length; i++) {
                const c = s[i];
                if (c === ESCAPE_CHARACTER) {
                    res += ESCAPE_CHARACTER + ESCAPE_CHARACTER;
                } else if (c === DEFAULT_DELIMITER) {
                    res += ESCAPE_CHARACTER + DEFAULT_DELIMITER;
                } else {
                    res += c;
                }
            }
            return res;
        };

        return this.components.map(str => escapeComp(str)).join(DEFAULT_DELIMITER);
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`index out of bounds: ${i}`);
        }
        return this.components[i];
    }

    /** 
     * Expects that new Name component c is properly masked
     * @methodtype set-method
    */
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`index out of bounds: ${i}`);
        }
        this.components[i] = c;
    }

     /**
      * Returns number of components in Name instance
      * @methodtype get-method
     */
     public getNoComponents(): number {
          return this.components.length;
    }

    /**
     * Expects that new Name component c is properly masked 
     * @methodtype command-method
    */
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`index out of bounds: ${i}`);
        }
        this.components.splice(i, 0, c);
    }

    /**
     * Expects that new Name component c is properly masked
     * @methodtype command-methodExpects that new Name component c is properly masked
     */
    public append(c: string): void {
        this.components.push(c);
    }

    /**
     * @methodtype command-method
     */
    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`index out of bounds: ${i}`);
        }
        this.components.splice(i, 1);
    }

}