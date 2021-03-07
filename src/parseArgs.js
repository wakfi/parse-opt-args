const parsePositionalArgOpts= require(`./parsePositionalArgOpts.js`);
const parseTruthyArgOpts = require(`./parseTruthyArgOpts.js`);

/** @typedef ParseOptions
		truthy {boolean} Parse for truthy args instead of positional args. Default (truthy=false) is to parse positional args
		flagPrefix {string}
		flagMatching {string}
		flagRegex {RegExp}
		disableAutoPrefix {boolean}
		singlePosition {boolean} - Positional parsing only
		disableDoublePrefix {boolean}
		doublePrefix {string}
		doubleMatching {string}
		doubleRegex {RegExp}
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
