import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { signal } from '@angular/core';
import { Task } from '../../models/task';
import { By } from '@angular/platform-browser';
import { TaskItemComponent } from '../task-item/task-item.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    const task1: Task = {
      id: '1',
      title: 'task 1',
      description: 'task 1 desc',
      completed: false,
      createdAt: new Date()
    }

    const task2: Task = {
      id: '2',
      title: 'task 2',
      description: 'task 2 desc',
      completed: false,
      createdAt: new Date()
    }

    mockTaskService = jasmine.createSpyObj(
      'TaskService',
      ['addTask', 'toggleTaskComplete'],
      {
        taskList: signal([task1, task2]).asReadonly(),
        totalCount: signal(2).asReadonly(),
        activeCount: signal(2).asReadonly(),
        completedCount: signal(0).asReadonly()
      }
    );

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, TaskItemComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tasks from service', () => {
    const taskElements = fixture.debugElement.queryAll(By.css('app-task-item'));
    expect(taskElements.length).toBe(2);

    expect(taskElements[0].nativeElement.textContent).toContain('task 1');
  })

  it('should display task counts', () => {
    const countElements = fixture.debugElement.queryAll(By.css('.count'));
    expect(countElements.length).toBe(3);

    expect(countElements[0].nativeElement.textContent).toContain('Total tasks: 2');
    expect(countElements[1].nativeElement.textContent).toContain('Completed tasks: 0');
    expect(countElements[2].nativeElement.textContent).toContain('Active tasks: 2');
  })

  it('should call toggleTaskComplete when checkbox clicked', () => {
    const checkboxElements = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
    expect(checkboxElements.length).toBe(2);

    checkboxElements[0].nativeElement.click();
    expect(mockTaskService.toggleTaskComplete).toHaveBeenCalledWith('1');
  });

  it('should call addTask when Add dummy task button clicked', () => {
    const buttonElements = fixture.debugElement.queryAll(By.css('button'));
    expect(buttonElements.length).toBe(1);

    const dummyButtonElement = buttonElements[0];
    dummyButtonElement.nativeElement.click();

    expect(mockTaskService.addTask).toHaveBeenCalled();

    const callArgs = mockTaskService.addTask.calls.mostRecent().args;
    const taskAdded = callArgs[0]; // First argument

    // Now check the task properties
    expect(taskAdded.title).toBe('complete code interview');
    expect(taskAdded.description).toBe('you need to get a job bro');
    expect(taskAdded.completed).toBe(false);
    expect(taskAdded.id).toBeTruthy(); // Just check it exists
  })
});
