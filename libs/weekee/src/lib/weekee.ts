import * as Datastore from 'nedb'
import { ID, Article } from './types'

interface Context {
  articles: Datastore<Article> | null
}

const context: Context = {
  articles: null,
}

export const initDb = () => {
  console.log(`Filling Database with Wikipedia's dirty dirty garbage...`)

  context.articles = new Datastore<Article>({
    filename: './db/test/articles.wikidb',
    autoload: true,
  })

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
      resolve(context.articles.getAllData())
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
