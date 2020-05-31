import { Component, OnInit, OnDestroy } from '@angular/core'
import { GraphService } from '../../services/graph.service'
import { ComponentBase } from '../component'
import { Observable } from 'rxjs'
import { Article } from 'generated/may-epp.client'
import { NEXUS_ARTICLE_FRAGMENT } from './article-nexus.graphql'

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

  ngOnInit(): void {
    super.ngOnInit()

    // SET UP (RX)

    this.articles$ = this.graph.watchQuery.articles(NEXUS_ARTICLE_FRAGMENT)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
