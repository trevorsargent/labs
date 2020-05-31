import { Component, OnInit, Input } from '@angular/core'
import { Article } from 'generated/may-epp.client'

@Component({
  selector: 'wiki-article-node',
  templateUrl: './article-node.component.html',
  styleUrls: ['./article-node.component.scss'],
})
export class ArticleNodeComponent implements OnInit {
  constructor() {}

  @Input()
  article: Article

  ngOnInit(): void {}
}
