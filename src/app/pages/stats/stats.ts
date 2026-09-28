import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-stats',
  template: `
    <h2>Overview</h2>
    <div class="grid">
      <div class="card"><span>Total</span><strong>{{ s().total }}</strong></div>
      <div class="card"><span>To do</span><strong>{{ s().todo }}</strong></div>
      <div class="card"><span>In progress</span><strong>{{ s().inProgress }}</strong></div>
      <div class="card"><span>Done</span><strong>{{ s().done }}</strong></div>
      <div class="card" [class.alert]="s().overdue > 0"><span>Overdue</span><strong>{{ s().overdue }}</strong></div>
    </div>

    <h3>Completion</h3>
    <div class="bar" role="progressbar" [attr.aria-valuenow]="s().completion" aria-valuemin="0" aria-valuemax="100">
      <div class="fill" [style.width.%]="s().completion"></div>
    </div>
    <p class="muted">{{ s().completion }}% of tasks are done</p>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }
    .card { display: flex; flex-direction: column; gap: 4px; }
    .card span { color: var(--muted); font-size: 0.85rem; }
    .card strong { font-size: 1.8rem; }
    .card.alert strong { color: var(--danger); }
    .bar { height: 12px; background: var(--border); border-radius: 999px; overflow: hidden; }
    .fill { height: 100%; background: var(--ok); transition: width 0.3s; }
  `,
})
export class Stats {
  protected readonly s = inject(TaskService).stats;
}
