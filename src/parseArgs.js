const parsePositionalArgs = require(`./parsePositionalArgs.js`);
const parseTruthyArgs = require(`./parseTruthyArgs.js`);

/**
typedef parseOptions
	options.truthy {boolean} Parse for truty args instead of positional args. Default (truthy=false) is to parse positional args
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

//convenience method to merge parsePositionalArgs and parseTruthyArgs into one function
function parseArgs(args,flags,options)
{
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
