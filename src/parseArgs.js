const parsePositionalArgs = require(`./parsePositionalArgs.js`);
const parseTruthyArgs = require(`./parseTruthyArgs.js`);

/** @typedef ParseOptions
	options.truthy {boolean} Parse for truthy args instead of positional args. Default (truthy=false) is to parse positional args
	options.flagPrefix {string}
	options.flagMatching {string}
	options.flagRegex {RegExp}
	options.disableAutoPrefix {boolean}
	options.singlePosition {boolean} - parsePositionalArgs only
	options.disableDoublePrefix {boolean}
	options.doublePrefix {string}
	options.doubleMatching {string}
	options.doubleRegex {RegExp}
*/

/** @typedef ParsedArgs
	args {Array} Remaining input after parsing opts
	found {Array} Specific flagValues found in the input
	count {Number} Number of flags found 
	
	for any flags that are found, it's key is used as as a proprty name for the result
	<flag property> {boolean} whether a flag corresponding to the property name was found
*/

/**
 Option is a decription of a given key:value pair in an Object being used as the flags parameter
 @typedef Opt
	key {string} used as property name if any of the associated flags are found in args
	flagValues {Array|string} flags to search for representing a particular option. If only 
							  one flag will be used, it can be provided as a string instead
*/

/** parseArgOpts(<args>, <flags>, [options]);
 @param args {Array} Array of strings to parse over
 @param flags {Object} key:value pairs as described in {Opt}
 @param options {ParseOptions} Options to configure parsing behavior
 @return {ParsedArgs} Results from parsing
*/
function parseArgOpts(args,flags,options)
{
	// parseArgs is a convenience method to merge parsePositionalArgs and parseTruthyArgs into one function
	if(typeof options === 'undefined') options = {};
	if(typeof args === 'string') args = args.split(' '); //this causes strings to be valid inputs which is convenient
	if(options.truthy)
	{
		return parseTruthyArgs(args,flags,options);
	}
	//default is positional, the check for both of them is just to avoid the appearance of unexpected behavior
	return parsePositionalArgs(args,flags,options);
}

module.exports = parseArgs;
