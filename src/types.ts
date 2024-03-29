export type Enumerable<T> = T | T[];
export type ROEnumerable<T> = T | readonly T[];
export type Optional<T> = T | undefined;

/**
 * Option is a decription of a given key:value pair in an Object being used as the flags parameter.
 * Not a real object/type.
 *
 * @property {string} key  Used as property name if any of the associated flags are found in args
 * @property {string|string[]} flagValues  Flags to search for representing a particular option. If only
 *                                         one flag will be used, it can be provided as a string instead
 */
// @ts-expect-error Intentionally unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Opt = never;

/**
 * flag:value pairs used to define what options to look for and what keys to return their corresponding results as
 * @see {Opt}
 */
export type Flags = {
	[K in string as K & string]: string | readonly string[];
}

// Return types
type RawParsedArgs<F extends Optional<Flags> = undefined, T extends boolean = false> = F extends undefined
 ? { readonly [K in string]?: T extends true ? boolean : string; }
 : { readonly [K in keyof F as K & string]?: T extends true ? boolean : string; };

type BaseParsedArgs<F extends Optional<Flags>, T extends boolean> = RawParsedArgs<F, T> & {
    /**
     * Remaining input `args` after parsing & removing matches
     */
    args: string[],
}

export type ParsedPositionalArgs<F extends Optional<Flags>> = BaseParsedArgs<F, false>

export type ParsedTruthyArgs<F extends Optional<Flags>> = BaseParsedArgs<F, true> & {
    /**
     * List of which specific flagValues were found
     */
    found: readonly string[]
    /**
     * Number of flags found
     */
	count: number
}

export type ParsedArgs<F extends Optional<Flags>, T extends Optional<boolean> = undefined> = T extends true ? ParsedTruthyArgs<F> : ParsedPositionalArgs<F>

// Option interfaces
interface BaseOptions {
    /**
      * Indicates whether parsing should be truthy instead of positional, which is the default
      */
    truthy?: boolean
    /**
	 * Prefix for identifying opt flags. Default is '-'
	 */
	flagPrefix?: string
	/**
	 * Pattern for valid flags to match. Default is '[a-zA-Z]'
	 */
	flagMatching?: string
	/**
	 * Regular expression to use when identifying flags. If flagRegex is
	 * provided, flagPrefix & flagMatching are ignored. Default is undefined;
	 * if neither flagPrefix nor flagMatching are provided, a predefined RegExp
	 * equivalent to the result of the default flagPrefix and flagMatching is
	 * used
	 */
	flagRegex?: RegExp
	/**
	 * Enable if the flags are specified with the expected prefix
	 * included inline
	 */
	disableAutoPrefix?: boolean
	/**
	 * Disables parsing for flags with double-width prefix. This
	 * improves efficiency when there aren't any double flags
	 */
	disableDoublePrefix?: boolean
	/**
	 * Prefix to use for double flags. Since this can be anything, it can
	 * also be used to specify a secondary pattern. Default is flagPrefix
	 * twice (e.g. '--' for flagPrefix '-')
	 */
	doublePrefix?: string
	/**
	 * Same usage as flagMatching, but for the double flag pattern instead.
	 * Default is '[a-zA-Z-]+'
	 */
	doubleMatching?: string
	/**
	 * Same usage and behavior as flagPrefix, but for the double flag pattern.
	 * The primary difference between double flag and single flag is in the
	 * expected format of the pattern to match. 'Single flag' options are
	 * expected to be single characters, while 'double flag' options are
	 * expected to be (potentially) more than one character. Using defaults
	 * this means that 'single flag' options can be a single letter, and
	 * 'double flag' options can be one or more words, with a dash available
	 * to use as spacing between words. Since all these definitions are
	 * configurable, this can be changed to fit need
	 */
	doubleRegex?: RegExp
}

export interface ParsePositionalOptions extends BaseOptions {
    /** You can leave this undefined for positional parsing */
    truthy?: false,
	/**
	 * Enable if arguments for a flag should only be the
	 * next whitespace delimited string after the flag.
	 * Has no affect when parsing as truthy rather than
	 * positional
	 */
     singlePosition?: boolean,
}

export interface ParseTruthyOptions extends BaseOptions {
    /** You must specify this for truthy parsing */
    truthy: true,
	/**
	 * Enable if arguments for a flag should only be the
	 * next whitespace delimited string after the flag.
	 * Has no affect when parsing as truthy rather than
	 * positional
	 */
     singlePosition?: boolean,
}

export type ParseOptions = ParsePositionalOptions | ParseTruthyOptions
