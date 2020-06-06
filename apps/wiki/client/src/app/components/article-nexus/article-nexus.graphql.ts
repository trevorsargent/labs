import gql from 'graphql-tag'

export const NEXUS_ARTICLE_FRAGMENT = gql`
  fragment NexusArticleFragment on Article {
    id
    name
    linksTo {
      id
    }
  }
`
