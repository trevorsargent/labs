type ID = string

export interface Article {
  id: ID
  name: string
  // category: Category
}

// export interface Category {
//   id: ID
//   name: string
// }

export interface Link {
  from: Article
  to: Article
}
