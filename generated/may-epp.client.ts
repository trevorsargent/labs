import ApolloClient, {
  ErrorPolicy,
  FetchPolicy,
  MutationOptions,
  OperationVariables,
  QueryOptions,
  SubscriptionOptions,
  WatchQueryOptions,
} from 'apollo-client'

// gql2 - to ignore apollo extention validation
// for now there is no better way
import gql2 from 'graphql-tag'

// rx library
import { from, observable } from 'rxjs'
import { map } from 'rxjs/operators'

// tslint:disable

// types enum

export enum QueryObjectTypes {
  Article = 'Article',
}

// types
type Int = number
type String = string
type Boolean = boolean

export interface Article {
  type: String
  id: String
  name: String
  numLinks: Int
  linksTo: Article[]
}

// Query props -----------------------------------

// Query apis ------------------------------------
class Query {
  constructor(
    private client: ApolloClient<any>,
    private defaultOptions: GraphqlCallOptions = {}
  ) {}

  numArticles(options?: GraphqlCallOptions & OmittedQueryOptions) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
      ...options,
    }

    // build query
    const query = gql2`
		query numArticles {
			numArticles
		}
		`
    // apollo call
    return this.client
      .query({
        ...mergedOptions,
        query,
      })
      .then((result) => getResultData<Int>(result, 'numArticles'))
  }

  articles(
    fragment: string | any,
    options?: GraphqlCallOptions & FragmentOptions & OmittedQueryOptions
  ) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
      ...options,
    }

    const fragmentName =
      mergedOptions.fragmentName ||
      getFirstFragmentName(fragment) ||
      'ArticleData'

    const finishedFragment = fragment

    // build query
    const query = gql2`
		query articles {
			articles {
				...${fragmentName}
			}
		}

		${finishedFragment}
		`
    // apollo call
    return this.client
      .query({
        ...mergedOptions,
        query,
      })
      .then((result) => getResultData<Article[]>(result, 'articles'))
  }
}

// WatchQuery props -----------------------------------

// WatchQuery apis ------------------------------------
class WatchQuery {
  constructor(
    private client: ApolloClient<any>,
    private defaultOptions: GraphqlCallOptions = {}
  ) {}

  numArticles(options?: GraphqlCallOptions & OmittedWatchQueryOptions) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
      ...options,
    }

    // build query
    const query = gql2`
		query numArticles {
			numArticles
		}
		`
    const zenObs = this.client.watchQuery<Int>({
      ...mergedOptions,
      query,
    })

    return from(fixObservable(zenObs)).pipe(
      map((result) => getResultData<Int>(result, 'numArticles'))
    )
  }

  articles(
    fragment: string | any,
    options?: GraphqlCallOptions & FragmentOptions & OmittedWatchQueryOptions
  ) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
      ...options,
    }

    const fragmentName =
      mergedOptions.fragmentName ||
      getFirstFragmentName(fragment) ||
      'ArticleData'

    const finishedFragment = fragment

    // build query
    const query = gql2`
		query articles {
			articles {
				...${fragmentName}
			}
		}

		${finishedFragment}
		`
    const zenObs = this.client.watchQuery<Article[]>({
      ...mergedOptions,
      query,
    })

    return from(fixObservable(zenObs)).pipe(
      map((result) => getResultData<Article[]>(result, 'articles'))
    )
  }
}

// RefetchQuery props -----------------------------------

// RefetchQuery apis ------------------------------------
class RefetchQuery {
  constructor(
    private client: ApolloClient<any>,
    private defaultOptions: GraphqlCallOptions = {}
  ) {}

  numArticles(options?: GraphqlCallOptions & OmittedQueryOptions) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
      ...options,
    }

    // build query
    const query = gql2`
		query numArticles {
			numArticles
		}
		`
    return {
      query,
    }
  }

  articles(
    fragment: string | any,
    options?: GraphqlCallOptions & FragmentOptions & OmittedQueryOptions
  ) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
      ...options,
    }

    const fragmentName =
      mergedOptions.fragmentName ||
      getFirstFragmentName(fragment) ||
      'ArticleData'

    const finishedFragment = fragment

    // build query
    const query = gql2`
		query articles {
			articles {
				...${fragmentName}
			}
		}

		${finishedFragment}
		`
    return {
      query,
    }
  }
}

// CacheWriteQuery props -----------------------------------

// CacheWriteQuery apis ------------------------------------
class CacheWriteQuery {
  constructor(
    private client: ApolloClient<any>,
    private defaultOptions: GraphqlCallOptions = {}
  ) {}

  numArticles(data: any) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
    }

    // build query
    const query = gql2`
		query numArticles {
			numArticles
		}
		`
    return this.client.writeQuery({
      query,
      data: { numArticles: data },
    })
  }

  articles(data: any, fragment: string | any) {
    const mergedOptions = {
      ...(<any>this.defaultOptions),
    }

    const fragmentName =
      mergedOptions.fragmentName ||
      getFirstFragmentName(fragment) ||
      'ArticleData'

    const finishedFragment = fragment

    // build query
    const query = gql2`
		query articles {
			articles {
				...${fragmentName}
			}
		}

		${finishedFragment}
		`
    return this.client.writeQuery({
      query,
      data: { articles: data },
    })
  }
}

// helper types
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type OmittedQueryOptions = Omit<
  Partial<QueryOptions<OperationVariables>>,
  'query' | 'variables'
>
type OmittedWatchQueryOptions = Omit<
  Partial<WatchQueryOptions<OperationVariables>>,
  'variables' | 'query'
>

interface FragmentOptions {
  fragmentName?: string
}

interface GraphqlCallOptions {
  fetchPolicy?: FetchPolicy
  errorPolicy?: ErrorPolicy
}

interface DefaultOptions {
  query?: GraphqlCallOptions
  watchQuery?: GraphqlCallOptions
}

export interface Client {
  query: Query
  watchQuery: WatchQuery
  refetchQuery: RefetchQuery
  cacheWriteQuery: CacheWriteQuery
}

export default function (
  client: ApolloClient<any>,
  defaultOptions: DefaultOptions = {}
): Client {
  return {
    query: new Query(client, defaultOptions.query || {}),
    watchQuery: new WatchQuery(client, defaultOptions.query || {}),
    refetchQuery: new RefetchQuery(client, defaultOptions.query || {}),
    cacheWriteQuery: new CacheWriteQuery(client, defaultOptions.query || {}),
  }
}

function fixObservable(obs: any) {
  ;(obs as any)[observable] = () => obs
  return obs
}

function getResultData<T>(result, dataFieldName) {
  // if error, throw it
  if (result.errors) {
    throw new Error(<any>result.errors)
  }

  if (!result.data) {
    return <T>(<any>null)
  }

  // cast the result and return (need any for scalar types, to avoid compilation error)
  return <T>(<any>result.data[dataFieldName])
}

function getFirstFragmentName(fragment: string | Object) {
  if (typeof fragment !== 'object') {
    return
  }
  if (
    !fragment['definitions'] ||
    !fragment['definitions'][0] ||
    !fragment['definitions'][0].name ||
    !fragment['definitions'][0].name.value
  ) {
    return
  }

  return fragment['definitions'][0].name.value
}
