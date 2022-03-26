const dashflagRegex = /(?<=\s|^)-([a-zA-Z])(?=\s|$)/g;
const dashflagRegexNonGlobal = /(?<=\s|^)-([a-zA-Z])(?=\s|$)/;
const doubleDashMatching = '[a-zA-Z-]+';
const dashMatching = '[a-zA-Z]';
const dashflag = '-';

/** @typedef ParseOptions
		flagPrefix {string} Prefix for identifying opt flags. Default is '-'
		flagMatching {string} Pattern for valid flags to match. Default is '[a-zA-Z]'
		flagRegex {RegExp} Regular expression to use when identifying flags. If flagRegex is
						   provided, flagPrefix & flagMatching are ignored. Default is undefined;
						   if neither flagPrefix nor flagMatching are provided, a predefined RegExp
						   equivalent to the result of the default flagPrefix and flagMatching is
						   used
		disableAutoPrefix {boolean} Enable if the flags are specified with the expected prefix
									included inline
		singlePosition {boolean} Enable if arguments for a flag should
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

/** parsePositionalOptArgs(<args>, <flags>, [options]);
 @param args {Array} Array of strings to parse over
 @param flags {Object} key:value pairs as described in {Opt}
 @param options {ParseOptions} Options to configure parsing behavior
 @return {ParsedArgs} Results from parsing
*/
export default function parsePositionalOptArgs(args,flags,options)
{
	if(typeof options === 'undefined') options = {};
	const flagPrefix = options.flagPrefix || dashflag;
	const flagMatching = options.flagMatching || dashMatching;
	const flagRegex = options.flagRegex || ((options.flagMatching || options.flagPrefix) ? new RegExp(`(?<=\\s|^)${flagPrefix}(${flagMatching})(?=\\s|$)`,`g`) : dashflagRegex);
	const flagRegexNonGlobal = options.flagRegex || ((options.flagMatching || options.flagPrefix) ? new RegExp(`(?<=\\s|^)${flagPrefix}(${flagMatching})(?=\\s|$)`) : dashflagRegexNonGlobal);
	const singlePosition = options.singlePosition || false;
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
	const doublePrefix = options.doublePrefix || [flagPrefix, flagPrefix].join('');
	const doubleMatching = options.doubleMatching || doubleDashMatching;
	//const doubleRegex = options.doubleRegex || new RegExp(`(?<=\\s|^)${doublePrefix}${doubleMatching}(?=\\s|$)`,`g`);
	const doubleRegexNonGlobal = options.doubleRegex || new RegExp(`(?<=\\s|^)${doublePrefix}${doubleMatching}(?=\\s|$)`);
	//const doubleFound = options.disableDoublePrefix ? [] : [...argsCopy.join(' ').matchAll(doubleRegex)].map(match => match[0]);
	//console.log(options.disableDoublePrefix);
	//console.log(options);
	//const found = [...doubleFound, ...[...argsCopy.join(' ').matchAll(flagRegex)].map(tuple => tuple.slice(1)).flat(Infinity).join('').split(flagPrefix).join('').split('').map(foundItem => [flagPrefix, foundItem].join(''))];
	//console.log(doubleFound);
	//console.log(found);
	const parse = (key, flag) =>
	{
		if(argsCopy.includes(flag))
		{
			const indexKey = argsCopy.indexOf(flag);
			//console.log(argsCopy);
			//console.log(argsCopy.slice(indexKey+1).map(arg => arg + ' ' + flagRegexNonGlobal.test(arg) || (!options.disableDoublePrefix && doubleRegexNonGlobal.test(arg))));
			const nextFlagIndex = singlePosition ? 1 : argsCopy.slice(indexKey+1).findIndex(arg => flagRegexNonGlobal.test(arg) || (!options.disableDoublePrefix && doubleRegexNonGlobal.test(arg)));
			//console.log(nextFlagIndex);
			const val = argsCopy.splice(indexKey+1, nextFlagIndex==-1 ? argsCopy.length : nextFlagIndex).join(' ');
			Object.defineProperty(obj, key, {value: val, writable: false, enumerable: true, configurable: true});
			argsCopy.splice(indexKey, 1);
			return true;
		}
		Object.defineProperty(obj, key, {value: undefined, writable: false, enumerable: true, configurable: true});
		return false;
	};
	for(const [key, value] of flagsMap)
	{
		if(value instanceof Array)
		{
			for(const flag of value)
			{
				if(options.disableDoublePrefix && doubleRegexNonGlobal.test(flag)) continue;
				if(parse(key, flag)) break;
			}
		} else {
			if(options.disableDoublePrefix && doubleRegexNonGlobal.test(value)) continue;
			parse(key, value);
		}
	}
	Object.defineProperty(obj, 'args', {value: argsCopy, writable: false, enumerable: true, configurable: true});
	return obj;
}
