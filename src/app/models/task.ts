export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  /** ISO date (YYYY-MM-DD) or null when there is no deadline. */
  dueDate: string | null;
  createdAt: string;
}

/** The fields a user fills in. id/createdAt are set by the service. */
export type TaskInput = Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'>;

export const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export const NEXT_STATUS: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
};

export const STATUS_LABEL: Record<Status, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
};
