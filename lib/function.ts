import { createHash } from 'crypto'
import { existsSync } from 'fs'
import { basename, dirname, extname, join, resolve } from 'path'
import { Code, Function, FunctionOptions, Runtime, RuntimeFamily, SingletonFunction } from '@aws-cdk/aws-lambda'
import { Construct } from '@aws-cdk/core'
import { EdgeFunction } from '@aws-cdk/aws-cloudfront/lib/experimental'
import { Builder } from './builder'

const nodeVersions: { [key: string]: number } = {
  [Runtime.NODEJS_10_X.toString()]: 10,
  [Runtime.NODEJS_12_X.toString()]: 12,
  [Runtime.NODEJS_14_X.toString()]: 14,
}

/**
 * Properties for a NodejsFunction
 */
export interface EsbuildFunctionProps extends FunctionOptions {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @example - aws/lambda/yourFunction.ts
   */
  readonly entry: string

  /**
   * The name of the exported handler in the entry file.
   *
   * @default handler
   */
  readonly handler?: string

  /**
   * The runtime environment. Only runtimes of the Node.js family are
   * supported.
   *
   * @default - NODEJS_14
   */
  readonly runtime?: Runtime

  /**
   * The build directory
   *
   * @default - `.build` in the entry file directory
   */
  readonly buildDir?: string

  /**
   * Ensure a unique build path
   *
   * @default - true
   */
  readonly ensureUniqueBuildPath?: boolean
}

export interface EsbuildSingletonFunctionProps extends EsbuildFunctionProps {
  readonly uuid: string
  readonly lambdaPurpose?: string
}

export class EsbuildFunction extends Function {
  constructor(scope: Construct, id: string, props: EsbuildFunctionProps) {
    const { runtime, handlerDir, outputBasename, handler } = preProcess(props)

    super(scope, id, {
      ...props,
      runtime,
      code: Code.fromAsset(handlerDir),
      handler: `${outputBasename}.${handler}`,
    })
  }
}

export class EsbuildEdgeFunction extends EdgeFunction {
  constructor(scope: Construct, id: string, props: EsbuildFunctionProps) {
    const { runtime, handlerDir, outputBasename, handler } = preProcess(props)

    super(scope, id, {
      ...props,
      runtime,
      code: Code.fromAsset(handlerDir),
      handler: `${outputBasename}.${handler}`,
    })
  }
}

export class EsbuildSingletonFunction extends SingletonFunction {
  constructor(scope: Construct, id: string, props: EsbuildSingletonFunctionProps) {
    const { runtime, handlerDir, outputBasename, handler } = preProcess(props)

    super(scope, id, {
      ...props,
      runtime,
      code: Code.fromAsset(handlerDir),
      handler: `${outputBasename}.${handler}`,
    })
  }
}

function preProcess(props: EsbuildFunctionProps) {
  if (props.runtime && props.runtime.family !== RuntimeFamily.NODEJS) {
    throw new Error('Only `NODEJS` runtimes are supported.')
  }
  if (!/\.(js|ts)$/.test(props.entry)) {
    throw new Error('Only JavaScript or TypeScript entry files are supported.')
  }
  if (!existsSync(props.entry)) {
    throw new Error(`Cannot find entry file at ${props.entry}`)
  }
  const handler = props.handler || 'handler'
  const runtime = props.runtime || Runtime.NODEJS_14_X
  const buildDir = props.buildDir || join(dirname(props.entry), '.build')
  const ensureUniqueBuildPath = typeof props.ensureUniqueBuildPath === 'boolean' ? props.ensureUniqueBuildPath : true
  const handlerDir = ensureUniqueBuildPath ? createUniquePath(buildDir, props.entry) : buildDir
  const outputBasename = basename(props.entry, extname(props.entry))

  // Build with webpack
  const builder = new Builder({
    buildDir,
    entry: resolve(props.entry),
    nodeVersion: nodeVersions[runtime.toString()],
    output: resolve(join(handlerDir, outputBasename + '.js')),
  })
  builder.build()
  return { runtime, handlerDir, outputBasename, handler }
}

function createUniquePath(buildDir: string, currentPath: string) {
  return join(buildDir, createHash('sha256').update(currentPath).digest('hex'))
}
