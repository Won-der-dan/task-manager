import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { DatePipe } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CanComponentDeactivate } from '../../guards/unsaved-changes.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskItemComponent],
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, CanComponentDeactivate {
  hasUnsavedChanges = false;

  canDeactivate() {
    return !this.hasUnsavedChanges;
  };

  private taskService = inject(TaskService);
  private router = inject(Router);

  tasks = this.taskService.taskList;
  totalTasks = this.taskService.totalCount;
  completedTasks = this.taskService.completedCount;
  activeTasks = this.taskService.activeCount;

  ngOnInit(): void {
    console.log('init');
  }

  addDummyTask() {
    let task: Task = {
      id: crypto.randomUUID(),
      title: 'complete code interview',
      description: 'you need to get a job bro',
      completed: false,
      createdAt: new Date()
    }
    this.taskService.addTask(task);
    this.hasUnsavedChanges = true;
  }

  toggleTaskComplete(taskId: string) {
    this.taskService.toggleTaskComplete(taskId);
    console.log('toggle');
    this.hasUnsavedChanges = true;
  }

  save() {
    this.taskService.saveToLocalStorage();
    this.hasUnsavedChanges = false;
  }

  redirect() {
    this.router.navigate(['/home']);
  }

}
