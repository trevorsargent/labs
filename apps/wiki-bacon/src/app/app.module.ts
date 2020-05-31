import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { RouterModule } from '@angular/router'
import { ArticleNodeComponent } from './components/article-node/article-node.component'
import { ArticleNexusComponent } from './components/article-nexus/article-nexus.component'
import { routes } from './app.routes'

@NgModule({
  declarations: [AppComponent, ArticleNodeComponent, ArticleNexusComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
