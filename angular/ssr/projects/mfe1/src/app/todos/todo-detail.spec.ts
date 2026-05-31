import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { TodoDetailComponent } from './todo-detail';
import { TodoStore } from '../todo-store';

describe('TodoDetailComponent', () => {
  let store: TodoStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TodoDetailComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    store = TestBed.inject(TodoStore);
  });

  it('populates the form with the resolved todo title', () => {
    const seed = store.todos()[0];
    const fixture = TestBed.createComponent(TodoDetailComponent);
    fixture.componentRef.setInput('id', seed.id);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#todo-title') as HTMLInputElement;
    expect(input.value).toBe(seed.title);
  });

  it('saves an edited title back to the store', () => {
    const seed = store.todos()[0];
    const fixture = TestBed.createComponent(TodoDetailComponent);
    fixture.componentRef.setInput('id', seed.id);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#todo-title') as HTMLInputElement;
    input.value = 'Edited title';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('.detail__form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(store.find(seed.id)?.title).toBe('Edited title');
  });

  it('navigates back to the list after a successful save', () => {
    const seed = store.todos()[0];
    const fixture = TestBed.createComponent(TodoDetailComponent);
    fixture.componentRef.setInput('id', seed.id);
    fixture.detectChanges();

    const route = TestBed.inject(ActivatedRoute);
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockResolvedValue(true);

    const input = fixture.nativeElement.querySelector('#todo-title') as HTMLInputElement;
    input.value = 'Edited title';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.detail__form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );

    expect(navigate).toHaveBeenCalledWith(['..'], { relativeTo: route });
  });

  it('shows a not-found message for an unknown id', () => {
    const fixture = TestBed.createComponent(TodoDetailComponent);
    fixture.componentRef.setInput('id', 'does-not-exist');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.detail__missing')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.detail__form')).toBeNull();
  });
});
