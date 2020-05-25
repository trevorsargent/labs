export type ID = string

export type ArticleType = 'standard' | 'redirect' | 'disambiguation'
export interface Article {
  type: ArticleType
  id: ID
  name: string
  linksTo: ID[]
  // category: Category
}

// export interface Category {
//   id: ID
//   name: string
// }
