import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STATUS_LABEL, Status } from '../../models/task';
import { SortBy, StatusFilter, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  protected readonly service = inject(TaskService);
  protected readonly statusLabel = STATUS_LABEL;
  protected readonly filters: StatusFilter[] = ['all', 'todo', 'in-progress', 'done'];

  protected label(filter: StatusFilter): string {
    return filter === 'all' ? 'All' : STATUS_LABEL[filter as Status];
  }

  protected onSearch(event: Event): void {
    this.service.search.set((event.target as HTMLInputElement).value);
  }

  protected onSort(event: Event): void {
    this.service.sortBy.set((event.target as HTMLSelectElement).value as SortBy);
  }

  protected remove(id: number, title: string): void {
    if (confirm(`Delete "${title}"?`)) this.service.remove(id);
  }
}
