import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNexusComponent } from './article-nexus.component';

describe('ArticleNexusComponent', () => {
  let component: ArticleNexusComponent;
  let fixture: ComponentFixture<ArticleNexusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleNexusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNexusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
