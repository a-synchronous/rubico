import assert from 'assert'
import walk from './walk.mjs'

const distTest = async function main() {
  const filepaths = []
  for await (const filepath of walk(`${import.meta.dirname}/dist`)) {
    filepaths.push(filepath)
  }
  filepaths.push(`${import.meta.dirname}/index.js`)
  filepaths.push(`${import.meta.dirname}/es.js`)

  for (const path of filepaths) {
    if (
      path.includes('.es')
      || path.endsWith('.mjs')
      || path.includes('es.js')
    ) {
      const module = await import(path)
      console.log('Successfully imported', path)
    }
  }
}

distTest()
