import * as Datastore from 'nedb'
import { ID, Article } from './types'
import { mockArticles } from '../mocks/articles.mock'
import { Subject } from 'rxjs'

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

export const articlesFUNC = async (ids?: ID[]): Promise<Article[]> => {
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

var isInText = false
var isRedirect = false
var isInfobox = false
// var articles = []

var currentArticleBeingBuilt = {
  id: null,
  name: null,
  linksTo: [],
  type: null, //standard, redirect, disambiguation(TODO)
}

let numTimesRun = 0
const MAX_TIMES = 10

function processLine(line) {
  line = line.replace(/^\s*/g, '').replace(/cite(.*?)ref&gt;/g, '')
  if (
    line.startsWith('</page>') ||
    line.startsWith(
      '==References==' ||
        line.startsWith('==External links==') ||
        line.startsWith('== References ==') ||
        line.startsWith('=== Citations ===') ||
        line.startsWith('=== Sources ===') ||
        line.startsWith('== Further reading ==') ||
        line.startsWith('== See also ==')
    )
  ) {
    if (currentArticleBeingBuilt.type == null) {
      currentArticleBeingBuilt.type = 'standard'
    }

    console.log(currentArticleBeingBuilt.name)

    // if (numTimesRun > MAX_TIMES) {
    //   stream.destroy()
    // }

    context.articles.update(
      { id: currentArticleBeingBuilt.id },
      { $set: currentArticleBeingBuilt },
      {
        upsert: true,
      }
    )
    numTimesRun += 1

    // articles.push(currentArticleBeingBuilt)
    isInText = false
    isRedirect = false

    currentArticleBeingBuilt = {
      id: null,
      name: null,
      linksTo: [],
      type: null, //standard, redirect, disambiguation(TODO)
    }
  }

  if (line.startsWith('<title>')) {
    currentArticleBeingBuilt.id = line
      .replace('<title>', '')
      .replace('</title>', '')
      .replace(' ', '_')
    currentArticleBeingBuilt.name = line
      .replace('<title>', '')
      .replace('</title>', '')
  }

  if (line.startsWith('<redirect')) {
    isRedirect = true
    currentArticleBeingBuilt.type = 'redirect'
  }

  if (line.startsWith('<text')) {
    isInText = true
  }

  if (isInfobox && line.startsWith('}}')) {
    isInfobox = false
  }

  if (isInText && !isInfobox) {
    if (line.startsWith('{{Infobox')) {
      isInfobox = true
    } else {
      const regex = /\[([^\[\]]+)\]/g
      const found = line.match(regex)
      if (found !== null) {
        found.forEach((l) => {
          if (
            l.indexOf('|') > -1 &&
            currentArticleBeingBuilt.linksTo.indexOf(
              l.slice(1, -1).split('|')[0]
            ) === -1
          ) {
            currentArticleBeingBuilt.linksTo.push(l.slice(1, -1).split('|')[0])
          } else if (
            currentArticleBeingBuilt.linksTo.indexOf(l.slice(1, -1)) === -1
          ) {
            currentArticleBeingBuilt.linksTo.push(l.slice(1, -1))
          }
        })
      }
    }
  }

  if (line.includes('</text>')) {
    isInText = false
  }
}

import * as fs from 'fs'

const file = '/Users/trev/Downloads/6.1.2020 - 12pm/completeWorldKnowledge.xml'

const stream = fs.createReadStream(file, { encoding: 'utf8' })

const lines$ = new Subject()

// lines$.subscribe((line) => processLine(line))

let lineFragment = null

stream.on('data', (data) => {
  // dont worry ? don't worry : do worry
  // destroyed ? true : true

  data = lineFragment + data
  const lines = data.split('\n') as []

  // To deal with chunks splitting in the middle of lines
  const completesWithLineEnding = data[data.length - 1] === '\n'

  lineFragment = !completesWithLineEnding ? lines[lines.length - 1] : null

  const linesToShave = completesWithLineEnding ? 0 : 1

  const linesToProcess = lines.slice(0, lines.length - (1 + linesToShave))

  linesToProcess.forEach((line) => lines$.next(line))
})

stream.on('close', () => {
  console.log('its done')
})
