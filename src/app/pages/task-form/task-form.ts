import { Component, OnInit, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Priority } from '../../models/task';
import { TaskService } from '../../services/task.service';

/** One form for both "new task" and "edit task". The route decides which. */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
  private readonly service = inject(TaskService);
  private readonly router = inject(Router);

  /** Filled from the route (/tasks/:id) thanks to withComponentInputBinding(). */
  readonly id = input<string>();

  protected notFound = false;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    description: ['', Validators.maxLength(500)],
    priority: ['medium' as Priority, Validators.required],
    dueDate: [''],
  });

  protected get isEdit(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
    if (!this.isEdit) return;
    const task = this.service.getById(Number(this.id()));
    if (!task) {
      this.notFound = true;
      return;
    }
    this.form.setValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ?? '',
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = { ...this.form.getRawValue(), dueDate: this.form.getRawValue().dueDate || null };
    if (this.isEdit) this.service.update(Number(this.id()), value);
    else this.service.add(value);
    this.router.navigateByUrl('/');
  }

  protected showError(field: 'title' | 'description'): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }
}
