import { Article } from '../lib/types'
import * as faker from 'faker'
import uuid from 'uuid'

const article = () => {
  return {
    id: uuid(),
    name: faker.name,
  }
}

export const articles = (num: number) => {
  return new Array(num).map((_) => article())
}

export const links = (articles: Article[]) => {}
