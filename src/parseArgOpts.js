const parsePositionalArgOpts= require(`./parsePositionalArgOpts.js`);
const parseTruthyArgOpts = require(`./parseTruthyArgOpts.js`);

/** @typedef ParseOptions
		truthy {boolean} Parse for truthy args instead of positional args. Default behavior
						 (i.e. truthy==false) is to parse positional args
		flagPrefix {string} Prefix for identifying opt flags. Default is '-'
		flagMatching {string} Pattern for valid flags to match. Default is '[a-zA-Z]+'
		flagRegex {RegExp} Regular expression to use when identifying flags. If flagRegex is
						   provided, flagPrefix & flagMatching are ignored. Default is undefined;
						   if neither flagPrefix nor flagMatching are provided, a predefined RegExp
						   equivalent to the result of the default flagPrefix and flagMatching is
						   used
		disableAutoPrefix {boolean} Enable if the flags are specified with the expected prefix
									included inline
		singlePosition {boolean} Positional parsing only. Enable if arguments for a flag should
								 only be the next whitespace delimited string after the flag
		disableDoublePrefix {boolean} Disables parsing for flags with double-width prefix. This
									  improves efficiency when there aren't any double flags
		doublePrefix {string} Prefix to use for double flags. Since this can be anything, it can
							  also be used to specify a secondary pattern. Default is flagPrefix
							  twice (e.g. '--' for flagPrefix '-')
		doubleMatching {string} Same usage as flagMatching, but for the double flag pattern instead.
								Default is '[a-zA-Z-]+'
		doubleRegex {RegExp} Same usage and behavior as flagPrefix, but for the double flag pattern.
							 The primary difference between double flag and single flag is in the
							 expected format of the pattern to match. 'Single flag' options are
							 expected to be single characters, while 'double flag' options are
							 expected to be (potentially) more than one character. Using defaults
							 this means that 'single flag' options can be a single letter, and
							 'double flag' options can be one or more words, with a dash available
							 to use as spacing between words. Since all these definitions are
							 configurable, this can be changed to fit need
*/

/** @typedef ParsedArgs
		args {Array} Remaining input after parsing opts
		found {Array?} Specific flagValues found in the input. Truthy parsing only
		count {Number?} Number of flags found. Truthy parsing only
	
	For any flags that are found, its key is used as as a proprty name for the result
	<flag property> {boolean} whether a flag corresponding to the property name was found
*/

/**
 Option is a decription of a given key:value pair in an Object being used as the flags parameter
 @typedef Opt
	key {string} Used as property name if any of the associated flags are found in args
	flagValues {Array|string} Flags to search for representing a particular option. If only
							  one flag will be used, it can be provided as a string instead
*/

/** parseArgOpts(<args>, <flags>, [options]);
 @param args {Array} Array of strings to parse over
 @param flags {Object} key:value pairs as described in {Opt}
 @param options {ParseOptions} Options to configure parsing behavior
 @return {ParsedArgs} Results from parsing
*/
function parseArgOpts(args, flags, options)
{
	// parseArgs is a convenience method to merge parsePositionalArgOpts and parseTruthyArgOpts into one function
	if(typeof options === 'undefined') options = {};
	if(typeof args === 'string') args = args.split(' '); //this causes strings to be valid inputs which is convenient
	if(options.truthy)
	{
		return parseTruthyArgOpts(args, flags, options);
	}
	// default is positional
	return parsePositionalArgOpts(args, flags, options);
}

module.exports = parseArgOpts;
