import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { NEXT_STATUS, PRIORITY_ORDER, Status, Task, TaskInput } from '../models/task';
import { StorageService } from './storage.service';

export type StatusFilter = Status | 'all';
export type SortBy = 'due' | 'priority' | 'newest';

const STORAGE_KEY = 'task-manager.tasks';

/**
 * The single source of truth for tasks, built on Angular signals.
 * Components read computed signals and call methods; they never change the array themselves.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly storage = inject(StorageService);
  private readonly _tasks = signal<Task[]>(this.storage.read<Task[]>(STORAGE_KEY, []));

  readonly tasks = this._tasks.asReadonly();

  // Filters are signals too, so the visible list updates automatically when they change.
  readonly statusFilter = signal<StatusFilter>('all');
  readonly search = signal('');
  readonly sortBy = signal<SortBy>('due');

  readonly visibleTasks = computed(() => {
    const status = this.statusFilter();
    const query = this.search().trim().toLowerCase();

    const filtered = this._tasks().filter(
      (t) =>
        (status === 'all' || t.status === status) &&
        (!query || t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)),
    );
    return [...filtered].sort(comparators[this.sortBy()]);
  });

  readonly stats = computed(() => {
    const all = this._tasks();
    const done = all.filter((t) => t.status === 'done').length;
    const today = todayIso();
    return {
      total: all.length,
      todo: all.filter((t) => t.status === 'todo').length,
      inProgress: all.filter((t) => t.status === 'in-progress').length,
      done,
      overdue: all.filter((t) => t.status !== 'done' && t.dueDate !== null && t.dueDate < today).length,
      completion: all.length === 0 ? 0 : Math.round((done / all.length) * 100),
    };
  });

  constructor() {
    // Save automatically whenever the task list changes.
    effect(() => this.storage.write(STORAGE_KEY, this._tasks()));
  }

  getById(id: number): Task | undefined {
    return this._tasks().find((t) => t.id === id);
  }

  add(input: TaskInput): Task {
    const task: Task = {
      ...clean(input),
      id: Math.max(0, ...this._tasks().map((t) => t.id)) + 1,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };
    this._tasks.update((list) => [...list, task]);
    return task;
  }

  update(id: number, input: TaskInput): void {
    this.requireTask(id);
    this._tasks.update((list) => list.map((t) => (t.id === id ? { ...t, ...clean(input) } : t)));
  }

  /** todo -> in-progress -> done -> todo */
  advanceStatus(id: number): void {
    this.requireTask(id);
    this._tasks.update((list) => list.map((t) => (t.id === id ? { ...t, status: NEXT_STATUS[t.status] } : t)));
  }

  remove(id: number): void {
    this._tasks.update((list) => list.filter((t) => t.id !== id));
  }

  isOverdue(task: Task): boolean {
    return task.status !== 'done' && task.dueDate !== null && task.dueDate < todayIso();
  }

  private requireTask(id: number): Task {
    const task = this.getById(id);
    if (!task) throw new Error(`Task ${id} not found`);
    return task;
  }
}

function clean(input: TaskInput): TaskInput {
  const title = input.title.trim();
  if (!title) throw new Error('Title is required');
  return { title, description: input.description.trim(), priority: input.priority, dueDate: input.dueDate || null };
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Tasks without a due date go last when sorting by due date.
const comparators: Record<SortBy, (a: Task, b: Task) => number> = {
  due: (a, b) => (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31') || a.id - b.id,
  priority: (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.id - b.id,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id,
};
