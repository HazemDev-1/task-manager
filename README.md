# Task Manager (Angular)

A task manager built with **Angular 21**, **signals**, standalone components, reactive forms and lazy-loaded routes. Tasks are saved in the browser, so nothing is lost on refresh.

![tests](https://github.com/HazemDev-1/task-manager/actions/workflows/tests.yml/badge.svg)

## Features

- Create, edit and delete tasks with title, description, priority and due date
- One click moves a task through **To do → In progress → Done**
- Filter by status, live search, sort by due date / priority / newest
- Overdue tasks are highlighted
- Stats page with counts and a completion bar
- Form validation with clear error messages
- 404 page for unknown routes
- Light and dark mode (follows the system)

## What it demonstrates

| Angular concept | Where |
|---|---|
| Signals, `computed`, `effect` | `services/task.service.ts` holds state; the list re-filters automatically; saving runs in an `effect` |
| Dependency injection | `StorageService` wraps `localStorage`; tests swap it for an in-memory version |
| Standalone components + new control flow (`@if`, `@for`) | all pages |
| Reactive forms + validators | `pages/task-form` (one form for create and edit) |
| Router: lazy loading, route params as inputs, wildcard route | `app.routes.ts`, `app.config.ts` |
| Unit and component tests (Vitest) | `*.spec.ts` (16 tests) |

## Run it

Requires Node.js **22.12+** (or 20.19+).

```bash
npm install
npm start          # http://localhost:4200
npm test -- --watch=false
npm run build
```

## Project structure

```
src/app/
  models/task.ts            Task type and status/priority helpers
  services/task.service.ts  All task logic (signals)
  services/storage.service.ts  localStorage wrapper
  pages/task-list/          List, filters, search, sort
  pages/task-form/          Create / edit form
  pages/stats/              Overview numbers
  pages/not-found/          404
```
