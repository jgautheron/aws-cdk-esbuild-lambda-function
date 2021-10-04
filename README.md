# aws-cdk-esbuild-lambda-function

forked from [@aws-cdk/aws-lambda-nodejs](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda-nodejs)

This library provides constructs for Node.js Lambda function bundled using esbuild.

## Quick Start

1. install using yarn:

   ```sh
   yarn add -D aws-cdk-esbuild-lambda-function @aws-cdk/core @aws-cdk/aws-lambda esbuild
   # npm i -D aws-cdk-esbuild-lambda-function @aws-cdk/core @aws-cdk/aws-lambda esbuild
   ```

1. (Optional) add tsconfig.json for lambda

   ```json
   {
     "extends": "../ ... /tsconfig.json",
     "compilerOptions": {
       "importHelpers": false,
       "target": "ES2018",
       "noEmit": false
     }
   }
   ```

1. your cdk source code:

   ```typescript
   import {
     EsbuildEdgeFunction,
     EsbuildFunction,
     EsbuildSingletonFunction,
   } from "aws-cdk-esbuild-lambda-function";

   new EsbuildEdgeFunction(this, "YourFunction", {
     entry: "your/path/to/function.ts",
   });

   new EsbuildFunction(this, "YourFunction", {
     entry: "your/path/to/function.ts",
   });

   new EsbuildSingletonFunction(this, "YourFunction", {
     entry: "your/path/to/function.ts",
     uuid: "39d0657d-165d-4853-83a7-80723c9b8721",
   });
   ```

## Options

### entry: string (required)

Path to the entry file (JavaScript or TypeScript).

### handler: string

The name of the exported handler in the entry file.

default: "handler"

### runtime: lambda.Runtime

The runtime environment. Only runtimes of the Node.js family are supported.

default: NODEJS_14

### buildDir: string

The build directory.

default: `.build` in the entry file directory

### ensureUniqueBuildPath: boolean

Control whether the build output is placed in a unique directory (sha256 hash) or not. This can be disabled to simplify development and debugging.

default: true

### ...other options

All other properties of lambda.Function are supported, see also the [AWS Lambda construct library](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-lambda).

## Run tests

```sh
yarn build
yarn test
```
