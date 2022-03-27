import type { Flags, ParseTruthyOptions, ParsedTruthyArgs, ROEnumerable } from "./types";

const dashflagRegex = /(?<=\s|^)-([a-zA-Z]+)(?=\s|$)/g;
const doubleDashMatching = '[a-zA-Z-]+';
const dashMatching = '[a-zA-Z]+';
const dashflag = '-';

/**
 * `parseTruthyOptArgs(<args>, <flags>, [options]);`
 * @param args Array of strings to parse over
 * @param flags key:value pairs
 * @param options Options to configure parsing behavior
 * @return Results from parsing
 */
export default function parseTruthyOptArgs<F extends Flags>(args: string[], flags: Flags, options: ParseTruthyOptions = {} as ParseTruthyOptions): ParsedTruthyArgs<F>
{
	const flagPrefix = options.flagPrefix || dashflag;
	const flagMatching = options.flagMatching || dashMatching;
	const flagRegex = options.flagRegex || ((options.flagMatching || options.flagPrefix) ? new RegExp(`(?<=\\s|^)${flagPrefix}(${flagMatching})(?=\\s|$)`,`g`) : dashflagRegex);
	if(!(flagRegex instanceof RegExp)) throw new TypeError(`flagRegex must be a Regular Expression`);
	const argsCopy = [...args];
	const flagsMap = new Map<string, ROEnumerable<string>>();
	const obj = {} as ParsedTruthyArgs<F>;
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
	const parse = (key: string, flag: string) =>
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
