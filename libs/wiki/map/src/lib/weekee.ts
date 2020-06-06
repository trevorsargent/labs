import * as Datastore from 'nedb'
import { ID, Article } from './types'
import { mockArticles } from '../mocks/articles.mock'

interface Context {
  articles: Datastore<Article> | null
}

const context: Context = {
  articles: null,
}

export const initDb = async (mocks?: number) => {
  console.log(`Filling Database with Wikipedia's dirty dirty garbage...`)

  context.articles = new Datastore<Article>({
    filename: './db/test/articles.wikidb',
    autoload: true,
  })

  if (mocks) {
    console.log('Mocking the backend... haha! stupid backend...')
  }

  if (mocks) {
    context.articles.remove({}, { multi: true }, function (err, numRemoved) {
      console.log(`Removed ${numRemoved} nodes`)
    })
    const arts = mockArticles(mocks)
    console.log(`adding ${arts.length} articles`)
    context.articles.insert(arts)
  }

  console.log('... and Done')

  return true
}

export const article = async (id: ID): Promise<Article> => {
  if (!context.articles) {
    throw new Error('Database Not Initialized')
  }

  return new Promise<Article>((resolve, reject) => {
    context.articles.findOne({ id: id }, (err, art) => {
      resolve(art)
    })
  })
}

export const articles = async (ids?: ID[]): Promise<Article[]> => {
  if (!context.articles) {
    throw new Error('Database Not Initialized')
  }

  if (!ids) {
    return new Promise<Article[]>((resolve, reject) => {
      context.articles.find({}, (err, arts) => {
        if (err) {
          throw err
        }
        resolve(arts)
      })
    })
  }

  return new Promise<Article[]>((resolve, reject) => {
    context.articles.find<Article>({ id: { $in: ids } }, (err, arts) => {
      if (err) {
        reject(err)
      }
      resolve(arts)
    })
  })
}
