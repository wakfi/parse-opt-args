const dashflagRegex = /(?<=\s|^)-([a-zA-Z]+)(?=\s|$)/g;
const doubleDashMatching = '[a-zA-Z-]+';
const dashMatching = '[a-zA-Z]+';
const dashflag = '-';

/** @typedef ParseOptions
		flagPrefix {string} Prefix for identifying opt flags. Default is '-'
		flagMatching {string} Pattern for valid flags to match. Default is '[a-zA-Z]+'
		flagRegex {RegExp} Regular expression to use when identifying flags. If flagRegex is
						   provided, flagPrefix & flagMatching are ignored. Default is undefined;
						   if neither flagPrefix nor flagMatching are provided, a predefined RegExp
						   equivalent to the result of the default flagPrefix and flagMatching is
						   used
		disableAutoPrefix {boolean} Enable if the flags are specified with the expected prefix
									included inline
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
		found {Array} Specific flagValues found in the input
		count {Number} Number of flags found
	
	For any flags that are found, its key is used as as a proprty name for the result
	<flag property> {boolean} Whether a flag corresponding to the property name was found
*/

/**
 Option is a decription of a given key:value pair in an Object being used as the flags parameter
 @typedef Opt
	key {string} Used as property name if any of the associated flags are found in args
	flagValues {Array|string} Flags to search for representing a particular option. If only
							  one flag will be used, it can be provided as a string instead
*/

/** parseTruthyArgOpts(<args>, <flags>, [options]);
 @param args {Array} Array of strings to parse over
 @param flags {Object} key:value pairs as described in {Opt}
 @param options {ParseOptions} Options to configure parsing behavior
 @return {ParsedArgs} Results from parsing
*/
function parseTruthyArgOpts(args, flags, options)
{
	if(typeof options === 'undefined') options = {};
	const flagPrefix = options.flagPrefix || dashflag;
	const flagMatching = options.flagMatching || dashMatching;
	const flagRegex = options.flagRegex || ((options.flagMatching || options.flagPrefix) ? new RegExp(`(?<=\\s|^)${flagPrefix}(${flagMatching})(?=\\s|$)`,`g`) : dashflagRegex);
	if(!(flagRegex instanceof RegExp)) throw new TypeError(`flagRegex must be a Regular Expression`);
	const argsCopy = [...args];
	const flagsMap = new Map();
	const obj = {};
	if(!options.disableAutoPrefix)
	{
		for(const [key, flag] of Object.entries(flags))
		{
			if(flag instanceof Array)
			{
				const flagSet = [];
				flag.forEach(subflag => flagSet.push(flagPrefix + subflag));
				flagsMap.set(key, flagSet);
			} else {
				flagsMap.set(key, flagPrefix + flag);
			}
		}
	} else {
		for(const [key, flag] of Object.entries(flags))
		{
			flagsMap.set(key, flag);
		}
	}
	const doublePrefix = options.doublePrefix || [flagPrefix,flagPrefix].join('');
	const doubleMatching = options.doubleMatching || doubleDashMatching;
	const doubleRegex = options.doubleRegex || new RegExp(`(?<=\\s|^)${doublePrefix}${doubleMatching}(?=\\s|$)`,`g`);
	const doubleFound = options.disableDoublePrefix ? [] : [...argsCopy.join(' ').matchAll(doubleRegex)];
	
	/* line by line version of initialzation for variable 'found' (below this comment)
	const argstring = argsCopy.join(' ');
	const allMatchesIterator = argstring.matchAll(flagRegex);
	const foundAllAsList = [...allMatchesIterator];
	const prefixesRemoved = foundAllAsList.map(tuple => tuple.slice(1));
	const singleMatches = prefixesRemoved.flat(Infinity);
	const joinedMatches = singleMatches.join('');
	const noPrefixes = joinedMatches.split(flagPrefix);
	const joinedMatchesNoPrefixes = noPrefixes.join('');
	const splitMatchesNoPrefixes = joinedMatchesNoPrefixes.split('');
	const prefixed = splitMatchesNoPrefixes.map(foundItem => [flagPrefix, foundItem].join(''));
	const found = [...doubleFound, ...prefixed];
	*/
	const found = [...doubleFound, ...[...argsCopy.join(' ').matchAll(flagRegex)].map(tuple => tuple.slice(1)).flat(Infinity).join('').split(flagPrefix).join('').split('').map(foundItem => [flagPrefix, foundItem].join(''))];
	let count = 0;
	const parse = (key, flag) =>
	{
		if(found.includes(flag))
		{
			const indexKey = found.indexOf(flag);
			found.splice(indexKey,1);
			argsCopy.splice(argsCopy.indexOf(key),1);
			count++;
			return true;
		}
		return false;
	};
	for(const [key, value] of flagsMap)
	{
		if(value instanceof Array)
		{
			let matchMade = false;
			for(const flag of value)
			{
				if(parse(key, flag))
				{
					matchMade = true;
					break;
				}
			}
			Object.defineProperty(obj, key, {value: matchMade, writable: false, enumerable: true, configurable: true});
		} else {
			Object.defineProperty(obj, key, {value: parse(key, value), writable: false, enumerable: true, configurable: true});
		}
	}
	Object.defineProperty(obj, 'args', {value: argsCopy, writable: false, enumerable: true, configurable: true});
	Object.defineProperty(obj, 'found', {value: found, writable: false, enumerable: true, configurable: true});
	Object.defineProperty(obj, 'count', {value: count, writable: false, enumerable: true, configurable: true});
	return obj;
}

module.exports = parseTruthyArgOpts;
