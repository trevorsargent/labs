import { initDb } from '@labs/weekee'
import { startWikiGraphQl } from '@labs/wiki-graphql'

const run = async () => {
  await initDb()
  await startWikiGraphQl()
}

run()
