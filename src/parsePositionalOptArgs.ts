const dashflagRegex = /(?<=\s|^)-([a-zA-Z])(?=\s|$)/g;
const dashflagRegexNonGlobal = /(?<=\s|^)-([a-zA-Z])(?=\s|$)/;
const doubleDashMatching = '[a-zA-Z-]+';
const dashMatching = '[a-zA-Z]';
const dashflag = '-';

/**
 * parsePositionalOptArgs(<args>, <flags>, [options]);
 * @param {string[]} args Array of strings to parse over
 * @param {Flags} flags key:value pairs as described in {Opt}
 * @param options {ParseOptions} Options to configure parsing behavior
 * @return {ParsedArgs} Results from parsing
 */
export default function parsePositionalOptArgs<F extends Flags>(args: string[], flags: F, options: ParsePositionalOptions = {}): ParsedPositionalArgs<F>
{
	const flagPrefix = options.flagPrefix || dashflag;
	const flagMatching = options.flagMatching || dashMatching;
	const flagRegex = options.flagRegex || ((options.flagMatching || options.flagPrefix) ? new RegExp(`(?<=\\s|^)${flagPrefix}(${flagMatching})(?=\\s|$)`,`g`) : dashflagRegex);
	const flagRegexNonGlobal = options.flagRegex || ((options.flagMatching || options.flagPrefix) ? new RegExp(`(?<=\\s|^)${flagPrefix}(${flagMatching})(?=\\s|$)`) : dashflagRegexNonGlobal);
	const singlePosition = options.singlePosition || false;
	if(!(flagRegex instanceof RegExp)) throw new TypeError(`flagRegex must be a Regular Expression`);
	const argsCopy = [...args];
	const flagsMap = new Map<string, ROEnumerable<string>>();
	const obj = {} as ParsedPositionalArgs<F>;
	if(!options.disableAutoPrefix)
	{
		for(const [key, flag] of Object.entries(flags))
		{
			if(flag instanceof Array)
			{
				const flagSet: string[] = [];
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
	const parse = (key: string, flag: string) =>
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
