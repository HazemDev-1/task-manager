import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { memoryStorageProvider } from '../../testing';
import { TaskService } from '../../services/task.service';
import { TaskForm } from './task-form';

describe('TaskForm page', () => {
  function setup(id?: string) {
    TestBed.configureTestingModule({
      imports: [TaskForm],
      providers: [provideRouter([]), memoryStorageProvider],
    });
    const service = TestBed.inject(TaskService);
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    return { service, router, create: () => {
      const fixture = TestBed.createComponent(TaskForm);
      if (id) fixture.componentRef.setInput('id', id);
      fixture.detectChanges();
      return fixture;
    } };
  }

  const type = (el: HTMLElement, selector: string, value: string) => {
    const input = el.querySelector(selector) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
  };

  it('shows a validation error and saves nothing when the title is empty', () => {
    const { service, create } = setup();
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;

    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Title is required');
    expect(service.tasks()).toHaveLength(0);
  });

  it('creates a task and goes back to the list', () => {
    const { service, router, create } = setup();
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;

    type(el, 'input[formControlName="title"]', 'Record demo video');
    type(el, 'select[formControlName="priority"]', 'high');
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    expect(service.tasks()[0]).toMatchObject({ title: 'Record demo video', priority: 'high', dueDate: null });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('loads an existing task for editing and saves changes', () => {
    const { service, create } = setup('1');
    service.add({ title: 'Original', description: 'text', priority: 'low', dueDate: '2030-01-01' });
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;

    expect((el.querySelector('input[formControlName="title"]') as HTMLInputElement).value).toBe('Original');
    expect(el.querySelector('h2')?.textContent).toBe('Edit task');

    type(el, 'input[formControlName="title"]', 'Edited');
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    expect(service.getById(1)).toMatchObject({ title: 'Edited', dueDate: '2030-01-01' });
  });

  it('shows "not found" for an unknown id', () => {
    const { create } = setup('99');
    expect((create().nativeElement as HTMLElement).textContent).toContain("That task doesn't exist");
  });
});
