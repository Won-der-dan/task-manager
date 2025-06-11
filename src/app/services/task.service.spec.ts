import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a task', () => {
    const startingCount = service.totalCount();
    service.addTask({
      id: '123',
      title: 'test task',
      description: 'test task description',
      completed: false,
      createdAt: new Date()
    });
    expect(service.totalCount()).toBe(startingCount + 1);
  });

  it('should add the correct task to the list', () => {
    const task: Task = {
      id: '123',
      title: 'test task',
      description: 'teast task description',
      completed: false,
      createdAt: new Date()
    };
    service.addTask(task);
    expect(service.taskList()).toContain(task);
    expect(service.taskList()[0].title).toBe('test task');
  });

  it('should toggle task completion', () => {
    const task: Task = {
      id: '123',
      title: 'test task',
      description: 'test task description',
      completed: false,
      createdAt: new Date()
    };
    service.addTask(task);
    service.toggleTaskComplete('123');
    expect(service.taskList()[0].completed).toBe(true);
    expect(service.completedCount()).toBe(1);
  });

  it('should save tasks to localStorage when modified', () => {
    const spy = spyOn(localStorage, 'setItem');

    const task: Task = {
      id: '123',
      title: 'test task',
      description: 'test task description',
      completed: false,
      createdAt: new Date()
    };

    service.addTask(task);

    TestBed.flushEffects();
    expect(spy).toHaveBeenCalledWith('tasks', JSON.stringify([task]));
  })
});
