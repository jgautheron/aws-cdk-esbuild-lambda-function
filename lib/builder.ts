import * as esbuild from 'esbuild'
import { resolve } from 'path'

/**
 * Builder options
 */
export interface BuilderOptions {
  /**
   * entry path
   */
  readonly entry: string

  /**
   * output path
   */
  readonly output: string
}

/**
 * Builder
 */
export class Builder {
  constructor(private readonly options: BuilderOptions) {}

  public build(): void {
    esbuild.buildSync({
      bundle: true,
      charset: 'utf8',
      entryPoints: [resolve(this.options.entry)],
      external: ['aws-sdk'],
      platform: 'node',
      outfile: this.options.output,
      target: 'es2020',
      treeShaking: true,
    })
  }
}
