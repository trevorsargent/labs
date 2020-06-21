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
  Int,
} from 'type-graphql'
import {
  articlesFUNC as articles,
  article,
  Article as A,
  ID,
  ArticleType,
} from '@labs/wiki/map'
import { ApolloServer } from 'apollo-server'

@ObjectType()
export class Article implements A {
  @Field((type) => String)
  type: ArticleType

  @Field((type) => String)
  id: string

  @Field()
  name: string

  linksTo: ID[]
}

@Resolver((of) => Article)
export class ArticleResolver {
  @Query((type) => Int)
  async numArticles(): Promise<number> {
    return (await articles()).length
  }

  @Query((returns) => [Article])
  async articles() {
    return await articles()
  }

  @FieldResolver((returns) => Int)
  async numLinks(@Root() a: Article) {
    return a.linksTo.length
  }

  @FieldResolver((returns) => [Article])
  async linksTo(@Root() a: Article) {
    const links = await articles(a.linksTo)
    return links
  }
}

const PORT = process.env.PORT || 4101
console.log(PORT)

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
