# Angular Interview Prep Session - Task Manager with Signals

## What We Built
A Task Manager application using Angular 19's latest features, focusing on **Signals** and **Testing**.

## Project Structure
```
task-manager/
├── src/app/
│   ├── models/
│   │   └── task.ts
│   ├── services/
│   │   └── task.service.ts
│   │   └── task.service.spec.ts
│   └── components/
│       └── task-list/
│           ├── task-list.component.ts
│           ├── task-list.component.html
│           ├── task-list.component.scss
│           └── task-list.component.spec.ts
```

## Key Concepts Covered

### 1. Signals (Angular 17+)
**What:** Reactive primitives for managing state
```typescript
// Creating a signal
private taskListSignal = signal<Task[]>([]);

// Reading a signal (in component)
tasks = this.taskService.taskList;  // The signal itself

// Reading signal value (in template)
@for (task of tasks(); track task.id) { }  // Note the ()

// Updating a signal
this.taskListSignal.update(tasks => [...tasks, newTask]);
```

### 2. Computed Signals
**What:** Derived state that auto-updates when dependencies change
```typescript
readonly completedCount = computed(() =>
  this.taskListSignal().filter(task => task.completed).length
);

// In template
<div>Completed: {{ completedCount() }}</div>
```

### 3. Effects
**What:** Side effects that run when signals change
```typescript
constructor() {
  effect(() => {
    const tasks = this.taskListSignal();
    localStorage.setItem('tasks', JSON.stringify(tasks));
  });
}
```

**Important:** Effects run after the current execution context completes, not immediately!

### 4. Modern Angular Patterns

#### inject() Function
```typescript
// Instead of constructor injection
private taskService = inject(TaskService);
```

#### New Control Flow (@for)
```typescript
@for (task of tasks(); track task.id) {
  <div>{{ task.title }}</div>
} @empty {
  <p>No tasks</p>
}
```
- `track` is REQUIRED (performance by default!)
- Always call signals with `()`

### 5. Testing Patterns
```typescript
describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();  // Clean state
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should add a task', () => {
    const task: Task = { /* ... */ };
    service.addTask(task);
    
    expect(service.taskList()).toContain(task);
    expect(service.totalCount()).toBe(1);
  });

  it('should save to localStorage', () => {
    const spy = spyOn(localStorage, 'setItem');
    service.addTask(task);
    
    expect(spy).toHaveBeenCalledWith('tasks', JSON.stringify([task]));
  });
});
```

## Common Interview Questions About Signals

1. **Q: What's the difference between signals and observables?**
   - Signals: Synchronous, always have current value, simpler API
   - Observables: Async, push-based, more powerful but complex

2. **Q: When would you use computed() vs regular methods?**
   - computed(): For derived state that depends on other signals (auto-memoized)
   - Methods: For actions or calculations that don't need caching

3. **Q: Can effects update other signals?**
   - Not recommended! Can cause infinite loops. Effects are for side effects only.

4. **Q: How do signals improve performance?**
   - Fine-grained reactivity - only updates what changed
   - Automatic dependency tracking
   - No need for OnPush change detection strategy

## Testing Commands (After Restart)

### For Windows (after installing Node):
```powershell
cd C:\Users\user\source\repos\sandbox\task-manager
npm install
ng test --browsers=ChromeHeadless --watch=false
```

### For WSL (with Chrome issues):
```bash
# Option 1: Headless with flags
ng test --browsers=ChromeHeadlessNoSandbox --watch=false

# Option 2: Run tests without browser
npm test -- --no-browsers --reporters=progress
```

## Next Steps for Interview

### Must Practice:
1. **Component Testing** - Test the TaskListComponent
2. **Signal Inputs/Outputs** - New in Angular 17.1+
3. **Error Handling** - Add try/catch in service methods
4. **Form Integration** - Add a task form component with validation

### Additional Topics to Add:
1. **Custom Directive** - e.g., autofocus directive
2. **Route Guards** - CanDeactivate for unsaved changes
3. **HTTP Interceptor** - For logging/error handling
4. **Lazy Loading** - Create a settings module

### Quick Wins for Tomorrow:
1. Add delete functionality to your task list
2. Add a filter component (All/Active/Completed)
3. Write at least one component test
4. Practice explaining signals vs observables

## Code Snippets to Remember

### Pattern 1: Partial Updates
```typescript
partialUpdateTask(taskId: string, updates: Partial<Task>) {
  this.taskListSignal.update(tasks =>
    tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
  );
}
```

### Pattern 2: Readonly Signal Pattern
```typescript
private taskListSignal = signal<Task[]>([]);
readonly taskList = this.taskListSignal.asReadonly();
```

### Pattern 3: Toggle Pattern
```typescript
toggleTaskComplete(taskId: string) {
  this.taskListSignal.update(tasks =>
    tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    )
  );
}
```

## Interview Prep Checklist
- [x] Can explain signals vs observables
- [x] Understand computed() and when to use it
- [x] Know effect() limitations and use cases
- [x] Can write comprehensive unit tests with mocking
- [x] Familiar with new @for syntax
- [x] Comfortable with inject() pattern
- [x] Can implement CRUD operations with signals
- [x] Understand OnPush change detection with signals
- [x] Can create smart/dumb components with signal inputs/outputs
- [x] Can implement HTTP interceptors (functional style)
- [x] Can create route guards (CanDeactivate)
- [x] Understand modern Angular routing

## Day 2 Accomplishments

### 1. OnPush Change Detection
- Added `ChangeDetectionStrategy.OnPush` to TaskListComponent
- Works perfectly with signals because signals trigger change detection automatically
- **Interview point**: "OnPush + Signals provides optimal performance with minimal effort"

### 2. Advanced Component Testing
```typescript
// Key patterns learned:
- Mock services with jasmine.SpyObj<ServiceType>
- Mock signals: signal(data).asReadonly()
- Test DOM with fixture.debugElement.query(By.css())
- Use fixture.componentRef.setInput() for signal inputs
- Always call fixture.detectChanges() after setup
```

### 3. Smart/Dumb Component Pattern
- Created TaskItemComponent with signal inputs/outputs
- Used new Angular 17+ syntax:
  - `task = input.required<Task>()`
  - `toggleComplete = output<string>()`
- Remember: Call signal inputs with `()` in templates!

### 4. HTTP Interceptor (Functional)
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Add auth token
  // Handle 401 errors
  // Modern functional approach
};
```

### 5. CanDeactivate Guard
- Prevents navigation with unsaved changes
- Functional guard approach
- Interface pattern for components

## Common Pitfalls to Remember
1. Signal inputs need `()` in templates: `task().title`
2. Use `===` not `=` in conditionals!
3. Mock child components in unit tests
4. Add standalone: true to components
5. Register interceptors with `withInterceptors([...])`

## Key Interview Topics Covered
- **Performance**: OnPush + Signals
- **Architecture**: Smart/Dumb components
- **Testing**: Comprehensive unit tests with mocking
- **Security**: HTTP interceptors for auth
- **UX**: Route guards for data protection
- **Modern Angular**: Functional approaches, signal I/O

## Tomorrow's Focus
- [ ] Add lazy loading modules
- [ ] Implement reactive forms with signals
- [ ] Add error handling strategies
- [ ] Create custom directives
- [ ] Add RxJS interop with signals

Good luck with your interview! You've got this! 🚀