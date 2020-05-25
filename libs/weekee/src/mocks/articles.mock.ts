import { Article } from '../lib/types'
import * as faker from 'faker'
import uuid from 'uuid'

type ArticleStub = Pick<Article, 'id' | 'name'>

const article = (): ArticleStub => {
  return {
    //"Name" of article, as seen in url
    id: uuid(),
    //Human readable name of article
    name: faker.name.title(),
  }
}

function terribleRandomArticleSelector(articles: ArticleStub[]) {
  const numberOfLinks = Math.floor(Math.random() * articles.length - 1)
  const links = []
  for (let i = 0; i < numberOfLinks; i++) {
    const dupPreventer = articles[Math.random() * articles.length - 1].id
    if (links.indexOf(dupPreventer) !== -1) {
      links.push(dupPreventer)
    }
  }
  return links
}

export const mockArticles = (num: number): Article[] => {
  const articlesNoLinks = new Array(num).map((_) => article())
  const articlesWithLinks: Article[] = articlesNoLinks.map((a) => ({
    ...a,
    type: 'standard',
    linksTo: terribleRandomArticleSelector(articlesNoLinks),
    linksFrom: terribleRandomArticleSelector(articlesNoLinks),
  }))
  return articlesWithLinks
}
