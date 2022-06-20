import { App, Construct, Stack, StackProps } from '@aws-cdk/core'
import { EsbuildFunction, EsbuildSingletonFunction } from '../lib/index'

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // test1
    new EsbuildFunction(this, 'WebpackFunction', {
      entry: 'test/lambda/testFunction.ts',
      loader: { '.xml': 'text' },
    })

    // test2
    new EsbuildSingletonFunction(this, 'WebpackSingletonFunction', {
      uuid: 'be82c13f-a959-4837-91d7-1a3aabb2626a',
      entry: 'test/lambda/testFunction.ts',
    })
  }
}

const app = new App()
new TestStack(app, 'TestStack')
app.synth()
