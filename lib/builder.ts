import * as esbuild from 'esbuild'
import * as path from 'path'

/**
 * Builder options
 */
export interface BuilderOptions {
  /**
   * buildDir
   */
  readonly buildDir: string

  /**
   * entry path
   */
  readonly entry: string

  /**
   * lambda runtime
   */
  readonly nodeVersion: number

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
      entryPoints: [path.resolve(this.options.entry)],
      external: ['aws-sdk'],
      platform: 'node',
      outfile: this.options.output,
      target: `node${this.options.nodeVersion}`,
      treeShaking: true,
    })
  }
}
