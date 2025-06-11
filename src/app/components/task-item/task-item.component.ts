import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task';
import { DatePipe } from '@angular/common';
import { CanComponentDeactivate } from '../../guards/unsaved-changes.guard';

@Component({
  selector: 'app-task-item',
  imports: [DatePipe],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent{
  task = input.required<Task>();

  toggleComplete = output<string>();
  deleteTask = output<string>();

  onToggle() {
    this.toggleComplete.emit(this.task().id);
  }
}
