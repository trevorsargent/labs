import { initDb } from '@labs/weekee'
import { startWikiGraphQl } from '@labs/wiki-graphql'

const MOCK_NUM = 50

const run = async () => {
  await initDb(MOCK_NUM)
  await startWikiGraphQl()
}

run()
