import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular'
import ApolloClient from 'apollo-client'

import createMayEppGraph, { Client } from 'generated/may-epp.client'

let proxy: Client | null = null

export const getProxy = () => proxy

@Injectable()
export class GraphService {
  public client: ApolloClient<any>
  private proxy: Client

  constructor(public apollo: Apollo) {
    this.client = apollo.getClient()

    this.proxy = createMayEppGraph(this.client, {
      watchQuery: { fetchPolicy: 'cache-and-network' as any },
    })

    proxy = this.proxy
  }

  get query() {
    return this.proxy.query
  }

  get refetchQuery() {
    return this.proxy.refetchQuery
  }

  // get mutation() {
  //   return this.proxy.mutation
  // }

  get watchQuery() {
    return this.proxy.watchQuery
  }

  deleteNode(id: any) {
    this.client.cache['data'].delete(id)
  }
}
