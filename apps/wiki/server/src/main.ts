import { initDb } from '@labs/wiki/map'
import { startWikiGraphQl } from '@labs/wiki/graphql'

const MOCK_NUM = 10

const run = async () => {
  await initDb()
  await startWikiGraphQl()
}

run()
