# parse-opt-args
Library for parsing options out of strings

This package uses ES Modules, but provides a CommonJS build as well


[npm](https://www.npmjs.com/package/parse-opt-args)  
Usage: `import parseOptArgs = from 'parse-opt-args';`
```ts
import parseOptArgs = from 'parse-opt-args';
const myInput = `some input -o this is the 'o' option -m this is the 'm' option -q this is the 'q' option`;
const argsParsed = parseOptArgs(myInput, {'optionO':'o', 'optionQ':['q', '-optionQ'], 'optionZ':'-optionZ'});
console.log(argsParsed.optionO); // prints: this is the 'o' option
console.log(argsParsed.optionM); // prints: undefined
console.log(argsParsed.optionQ); // prints: this is the 'q' option
console.log(argsParsed.optionZ); // prints: undefined
console.log(argsParsed.args);    // prints: ['some', 'input', '-m', 'this', 'is', 'the', "'m'", 'option']
```

#### Credits
Hybrid build strategy derived from https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html
