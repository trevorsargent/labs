import 'reflect-metadata'
import {
  Resolver,
  Query,
  Arg,
  ObjectType,
  Field,
  buildSchema,
  ResolverInterface,
  FieldResolver,
  Root,
} from 'type-graphql'
import { articles, article, Article as A, ID, ArticleType } from '@labs/weekee'
import { ApolloServer } from 'apollo-server'

@ObjectType()
export class Article implements A {
  @Field((type) => String)
  type: ArticleType

  @Field()
  id: string

  @Field()
  name: string

  linksTo: ID[]
}

@Resolver((of) => Article)
export class ArticleResolver {
  @Query((returns) => [Article])
  async articles() {
    return await articles()
  }

  @FieldResolver((returns) => Article)
  async linksTo(@Root('article') a: Article) {
    return
  }
}

const PORT = process.env.PORT || 4000

export async function startWikiGraphQl() {
  // ... Building schema here

  try {
    const schema = await buildSchema({
      resolvers: [ArticleResolver],
    })

    // Create the GraphQL server
    const server = new ApolloServer({
      schema,
      playground: true,
    })

    // Start the server
    const { url } = await server.listen(PORT)
    console.log(`Server is running, GraphQL Playground available at ${url}`)
  } catch (e) {
    console.error(e)
  }
}

startWikiGraphQl()
