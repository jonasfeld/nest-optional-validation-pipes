# Nest Optional Validation Pipes

## What is this?

This package provides the same validation & transformation pipes as [@nestjs/common](https://www.npmjs.com/package/@nestjs/common) does, but with optionality.

This means, for example, a `ParseBoolOptionalPipe` will validate & transform string parameters of the form `"true"` and `"false"` into proper booleans `true` and `false` but return `undefined`, if `null` or `undefined` is passed as input.

## When would I use this?

This is especially useful in the case of optional `@Query` parameters: Let's say you wanted to add some kind of optional filtering for a resource in your api, so you add a flag as a `@Query` parameter - using the default `ParseBoolPipe` will throw an error if the flag is not provided on every request.

This package addresses this exact shortcoming: using a `ParseBoolOptionalPipe` instead of a `ParseBoolPipe` will mean the validation will not fail on "no flag provided" - it will return `undefined` instead, building a bridge.

## How do I use this?

Exactly the same way you would use the [@nestjs/common](https://www.npmjs.com/package/@nestjs/common) Built-in Pipes. See the official [nestjs docs](https://docs.nestjs.com/pipes#built-in-pipes) for further info.

## Credits

Approximately 90% of the code is taken directly from [@nestjs/common](https://www.npmjs.com/package/@nestjs/common), I only put my own spin on their already awesome built-in pipes.

So go check them out! (If you don't know them, how did you end up here?)
