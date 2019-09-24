# inline-style-2-json

[![Greenkeeper badge](https://badges.greenkeeper.io/RichardLitt/inline-style-2-json.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/RichardLitt/inline-style-2-json.svg?branch=master)](https://travis-ci.org/RichardLitt/inline-style-2-json)

> Convert CSS inline styles to JSON

This is a small function that takes the content of a `style` tag (as a string) and outputs an object or a JSON string. This is useful if you are piping HTML through [xml-objects](https://github.com/timhudson/xml-objects) or something similar and you want finer granularity.

## Install

```
$ npm install --save inline-style-2-json
```


## Usage

```js
var inlineStyle2Json = require('inline-style-2-json');

inlineStyle2Json('position:absolute;h-index:9001;');
//=> "{ position: 'absolute', 'h-index': '9001'}"

inlineStyle2Json('position:absolute;h-index:9001;', {stringify: true});
//=> '{"position":"absolute","h-index":"9001"}'
```


## API

### inlineStyle2Json(input, [options])

#### input

Type: `string`

This should be your inline style string.

#### options

##### stringify

Type: `boolean`  
Default: `false`

Return stringified object.

## Contribute

Sure! Open an issue, open a PR.

## License

[MIT](license) © 2018 [Richard Littauer](http://burntfen.com)
