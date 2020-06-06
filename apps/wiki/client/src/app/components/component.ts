import { OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'
import { GraphService } from '../services/graph.service'

export abstract class ComponentBase implements OnDestroy {
  unsubscribe$ = new Subject<void>()

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
