import { TestBed } from '@angular/core/testing';
import { MemoryStorage, memoryStorageProvider } from '../testing';
import { StorageService } from './storage.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  const input = (title: string, extra: Partial<{ priority: 'low' | 'medium' | 'high'; dueDate: string | null }> = {}) => ({
    title,
    description: '',
    priority: extra.priority ?? 'medium',
    dueDate: extra.dueDate ?? null,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [memoryStorageProvider] });
    service = TestBed.inject(TaskService);
  });

  it('adds tasks with increasing ids and status "todo"', () => {
    const a = service.add(input('Write README'));
    const b = service.add(input('Push to GitHub'));

    expect([a.id, b.id]).toEqual([1, 2]);
    expect(a.status).toBe('todo');
  });

  it('trims the title and rejects an empty one', () => {
    expect(service.add(input('  Study  ')).title).toBe('Study');
    expect(() => service.add(input('   '))).toThrowError('Title is required');
  });

  it('cycles status todo -> in-progress -> done -> todo', () => {
    const { id } = service.add(input('Task'));
    const statuses: string[] = [];
    for (let i = 0; i < 3; i++) {
      service.advanceStatus(id);
      statuses.push(service.getById(id)!.status);
    }
    expect(statuses).toEqual(['in-progress', 'done', 'todo']);
  });

  it('filters by status and search text', () => {
    service.add(input('Learn Angular signals'));
    const { id } = service.add(input('Buy groceries'));
    service.advanceStatus(id);

    service.statusFilter.set('in-progress');
    expect(service.visibleTasks().map((t) => t.title)).toEqual(['Buy groceries']);

    service.statusFilter.set('all');
    service.search.set('ANGULAR');
    expect(service.visibleTasks().map((t) => t.title)).toEqual(['Learn Angular signals']);
  });

  it('sorts by due date with undated tasks last, or by priority', () => {
    service.add(input('No date', { priority: 'high' }));
    service.add(input('Later', { dueDate: '2030-05-01', priority: 'low' }));
    service.add(input('Sooner', { dueDate: '2030-01-01', priority: 'medium' }));

    service.sortBy.set('due');
    expect(service.visibleTasks().map((t) => t.title)).toEqual(['Sooner', 'Later', 'No date']);

    service.sortBy.set('priority');
    expect(service.visibleTasks().map((t) => t.title)).toEqual(['No date', 'Sooner', 'Later']);
  });

  it('computes stats including overdue and completion %', () => {
    service.add(input('Past due', { dueDate: '2000-01-01' }));
    const { id } = service.add(input('Finished', { dueDate: '2000-01-01' }));
    service.advanceStatus(id);
    service.advanceStatus(id);

    expect(service.stats()).toEqual({ total: 2, todo: 1, inProgress: 0, done: 1, overdue: 1, completion: 50 });
  });

  it('updates and removes tasks', () => {
    const { id } = service.add(input('Old title'));
    service.update(id, input('New title', { priority: 'high' }));
    expect(service.getById(id)).toMatchObject({ title: 'New title', priority: 'high' });

    service.remove(id);
    expect(service.tasks()).toEqual([]);
  });

  it('saves to storage and restores on the next start', () => {
    service.add(input('Persist me'));
    TestBed.tick(); // let the saving effect run

    const storage = TestBed.inject(StorageService) as MemoryStorage;
    const saved = storage.data.get('task-manager.tasks') as unknown[];
    expect(saved).toHaveLength(1);

    // A brand-new service reading the same storage sees the task.
    TestBed.resetTestingModule();
    const again = new MemoryStorage();
    again.data.set('task-manager.tasks', saved);
    TestBed.configureTestingModule({ providers: [{ provide: StorageService, useValue: again }] });
    expect(TestBed.inject(TaskService).tasks()[0].title).toBe('Persist me');
  });
});
