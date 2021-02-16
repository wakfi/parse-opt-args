# parse-opt-args
Library for parsing options out of strings

npm: `coming soon`  
Usage: `const parseArgs = require('parse-opt-args');`  
```js
const parseArgs = require('parse-opt-args');
const myInput = `some input -o this is the 'o' option -m this is the 'm' option -q this is the 'q' option`;
const argsParsed = parseArgs(myInput, {'optionO':'o', 'optionQ':['q', '-optionQ'], 'optionZ':'-optionZ'});
console.log(argsParsed.optionO); // prints: this is the 'o' option
console.log(argsParsed.optionM); // prints: undefined
console.log(argsParsed.optionQ); // prints: this is the 'q' option
console.log(argsParsed.optionZ); // prints: undefined
console.log(argsParsed.args);    // prints: ['some', 'input', '-m', 'this', 'is', 'the', "'m'", 'option']
```

