import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component'
import { RouterModule } from '@angular/router'
import { ArticleNodeComponent } from './components/article-node/article-node.component'
import { ArticleNexusComponent } from './components/article-nexus/article-nexus.component'
import { routes } from './app.routes'
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { GraphService } from './services/graph.service'

@NgModule({
  declarations: [AppComponent, ArticleNodeComponent, ArticleNexusComponent],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
  ],
  providers: [
    GraphService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:4101',
          }),
        }
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
