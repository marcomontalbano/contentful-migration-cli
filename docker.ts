import yargs from 'yargs'
import { execSync } from 'child_process'
import { resolve } from 'path';

const argv = yargs
  .option('cfmversion', {
    description: 'Contentful Migration library version',
    default: 'latest',
    type: 'string',
  })
  .help().alias('help', 'h')
  .argv;

function installDependency(version: string = 'latest'): void {
  execSync(`yarn add contentful-migration@${version}`, {
    encoding: 'utf-8',
    stdio: 'ignore'
  })

  execSync(`yarn list --pattern contentful-migration --depth=0 --non-interactive --no-progress`, {
    encoding: 'utf-8',
    stdio: 'inherit'
  })
}

function removeDependency(): void {
  try {
    execSync(`yarn remove contentful-migration`, {
      encoding: 'utf-8',
      stdio: 'ignore'
    })
  } catch {
    console.info('  nothing to remove')
  }
}

function runMigration(): void {
  execSync(`ts-node runner.ts run ${ resolve(__dirname, 'migrations') }`, {
    encoding: 'utf-8',
    stdio: 'inherit'
  })
}

((async function () {

  console.info(`- Remove contentful-migration`)
  removeDependency()

  console.info(`- Install contentful-migration@${ argv.cfmversion }`)
  installDependency(argv.cfmversion)

  console.info(`- Run migration`)
  runMigration()

  console.info(`- Cleanup contentful-migration`)
  removeDependency()

})()).catch((error) => {
  console.error(error)
  process.exit(1)
})
