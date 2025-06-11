import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskListSignal: WritableSignal<Task[]> = signal([]);
  readonly taskList = this.taskListSignal.asReadonly();
  readonly completedCount = computed(() =>
    this.taskListSignal().filter(task => task.completed).length
  );
  readonly totalCount = computed(() =>
    this.taskListSignal().length
  );
  readonly activeCount = computed(() =>
    // this.taskListSignal().filter(task => !task.completed).length
    this.totalCount() - this.completedCount()
  )

  constructor() {
    // effect(() => {
    //   const tasks = this.taskListSignal();
    //   localStorage.setItem('tasks', JSON.stringify(tasks));
    //   console.log('Tasks saved to localStorage:', tasks.length);
    // });
    this.loadTasks();
  }

  addTask(task: Task): void {
    this.taskListSignal.update(list => [...list, task]);
  }

  updateTask(task: Task): void {
    this.taskListSignal.update(tasks =>
      tasks.map(prevTask => prevTask.id === task.id ? task : prevTask));
  }

  partialUpdateTask(taskId: string, updates: Partial<Task>) {
    this.taskListSignal.update(tasks =>
      tasks.map(task => task.id === taskId ? { ...task, ...updates } : task)
    )
  }

  deleteTask(taskId: string) {
    this.taskListSignal.update(tasks => tasks.filter(task => task.id !== taskId))
  }

  toggleTaskComplete(taskId: string) {
    this.taskListSignal.update(tasks =>
      tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task)
    );
  }

  saveToLocalStorage() {
    const tasks = this.taskListSignal();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks saved to localStorage:', tasks.length);
  }

  private loadTasks(): void {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      this.taskListSignal.set(JSON.parse(saved));
    }
  }
}
