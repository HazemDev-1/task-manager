import { Routes } from '@angular/router';

// Pages are lazy-loaded: each one is downloaded only when the user opens it.
export const routes: Routes = [
  { path: '', title: 'Tasks', loadComponent: () => import('./pages/task-list/task-list').then((m) => m.TaskList) },
  { path: 'tasks/new', title: 'New task', loadComponent: () => import('./pages/task-form/task-form').then((m) => m.TaskForm) },
  { path: 'tasks/:id', title: 'Edit task', loadComponent: () => import('./pages/task-form/task-form').then((m) => m.TaskForm) },
  { path: 'stats', title: 'Stats', loadComponent: () => import('./pages/stats/stats').then((m) => m.Stats) },
  { path: '**', title: 'Not found', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) },
];
