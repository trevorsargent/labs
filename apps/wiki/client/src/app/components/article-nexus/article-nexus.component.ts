import { Component, OnInit, OnDestroy } from '@angular/core'
import { GraphService } from '../../services/graph.service'
import { ComponentBase } from '../component'
import { Observable } from 'rxjs'
import { Article } from 'generated/may-epp.client'
import { NEXUS_ARTICLE_FRAGMENT } from './article-nexus.graphql'
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph'
import { map, tap } from 'rxjs/operators'

@Component({
  selector: 'wiki-article-nexus',
  templateUrl: './article-nexus.component.html',
  styleUrls: ['./article-nexus.component.scss'],
})
export class ArticleNexusComponent extends ComponentBase
  implements OnInit, OnDestroy {
  constructor(private graph: GraphService) {
    super()
  }

  articles$: Observable<Article[]>

  nodes$: Observable<Node[]>

  edges$: Observable<Edge[]>

  cluster$: Observable<ClusterNode[]>

  ngOnInit(): void {
    super.ngOnInit()

    // SET UP (RX)
    this.articles$ = this.graph.watchQuery.articles(NEXUS_ARTICLE_FRAGMENT)

    this.nodes$ = this.articles$.pipe(
      map((articles) =>
        articles.map(
          (article) =>
            <Node>{
              id: article.id,
              label: article.name,
            }
        )
      ),
      tap((x) => console.log('nodes', x))
    )
    this.edges$ = this.articles$.pipe(
      map((articles) =>
        articles.reduce((edges: Edge[], article: Article) => {
          const newEdges: Edge[] = article.linksTo.map(
            (link) => <Edge>{ source: article.id, target: link.id }
          )
          return [...edges, ...newEdges]
        }, [])
      )
      // tap((x) => console.log('edges', x))
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
