import parsePositionalOptArgs from './parsePositionalOptArgs';
import parseTruthyOptArgs from './parseTruthyOptArgs';

/**
 * `parseOptArgs(<args>, <flags>, [options]);`
 * @param args Array of strings to parse over
 * @param flags key:value pairs as described in {Opt}
 * @param options Options to configure parsing behavior
 * @return Results from parsing
 */
export default function parseOptArgs<F extends Flags, T extends ParseOptions>(args: Enumerable<string>, flags: F, options: T = {} as T): ParsedArgs<F, T['truthy']>
{
	// parseArgs is a convenience method to merge parsePositionalOptArgs and parseTruthyOptArgs into one function
	if(typeof args === 'string') args = args.split(' '); //this causes strings to be valid inputs which is convenient
	if(options.truthy)
	{
		// @ts-expect-error This return type is safe. I don't know why TS isn't inferring as such, because it has the right type
		return parseTruthyOptArgs(args, flags, options);
	}
	// default is positional
	// @ts-expect-error This return type is safe. I don't know why TS isn't inferring as such, because it has the right type
	return parsePositionalOptArgs(args, flags, options);
}
