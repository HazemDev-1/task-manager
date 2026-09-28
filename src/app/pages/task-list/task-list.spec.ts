import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { memoryStorageProvider } from '../../testing';
import { TaskService } from '../../services/task.service';
import { TaskList } from './task-list';

describe('TaskList page', () => {
  function setup() {
    TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [provideRouter([]), memoryStorageProvider],
    });
    const service = TestBed.inject(TaskService);
    const fixture = TestBed.createComponent(TaskList);
    const el = fixture.nativeElement as HTMLElement;
    const render = () => {
      fixture.detectChanges();
      return el;
    };
    return { service, render };
  }

  it('shows an empty state with a link when there are no tasks', () => {
    const { render } = setup();
    expect(render().textContent).toContain('No tasks yet');
  });

  it('renders tasks and advances status when the status button is clicked', () => {
    const { service, render } = setup();
    service.add({ title: 'Deploy app', description: 'to Vercel', priority: 'high', dueDate: null });

    const el = render();
    expect(el.querySelectorAll('[data-testid="task"]')).toHaveLength(1);

    (el.querySelector('button.status') as HTMLButtonElement).click();
    expect(render().querySelector('button.status')?.textContent?.trim()).toBe('In progress');
  });

  it('filters the list when a status filter is clicked', () => {
    const { service, render } = setup();
    service.add({ title: 'A', description: '', priority: 'low', dueDate: null });
    const b = service.add({ title: 'B', description: '', priority: 'low', dueDate: null });
    service.advanceStatus(b.id);
    service.advanceStatus(b.id);

    const doneButton = [...render().querySelectorAll('.filters button')].find((x) => x.textContent?.trim() === 'Done');
    (doneButton as HTMLButtonElement).click();

    const titles = [...render().querySelectorAll('[data-testid="task"] h3')].map((h) => h.textContent);
    expect(titles).toEqual(['B']);
  });

  it('marks overdue tasks', () => {
    const { service, render } = setup();
    service.add({ title: 'Late', description: '', priority: 'medium', dueDate: '2000-01-01' });

    expect(render().querySelector('.task.overdue .overdue-tag')?.textContent).toBe('Overdue');
  });
});
