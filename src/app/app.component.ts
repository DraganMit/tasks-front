import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from './task';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public tasks: Task[] = [];
  public editTask: Task;
  public deleteTask: Task;
  public date: Date;

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.getTasks();
    this.date = new Date;
  }

  public getTasks(): void {
    this.tasksService.getAllTasks().subscribe(
      (response: Task[]) => {
        this.tasks = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddTask(addForm: NgForm): void {
    document.getElementById('add-task-form').click();
    this.tasksService.addTask(addForm.value).subscribe(
      (response: Task) => {
        console.log(response);
        this.getTasks();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    )
  }

  public onUpdateTask(task: Task): void {
    this.tasksService.updateTask(task).subscribe(
      (response: Task) => {
        console.log(response);
        this.getTasks();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteTask(taskId: number): void {
    this.tasksService.deleteTask(taskId).subscribe(
      (response: void) => {
        console.log(response);
        this.getTasks();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public searchTasks(key: string): void {
    const results: Task[] = [];
    for (const task of this.tasks) {
      if (task.title.toLowerCase().indexOf(key.toLowerCase()) !== -1
    || task.category.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(task);
      }
    }
    this.tasks = results;
    if (results.length === 0 || !key) {
      this.getTasks();
    }
  }

  public onOpenModal(task: Task, mode: string, amount: HTMLOutputElement): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addTaskModal');
    }
    if (mode === 'edit') {
      this.editTask = task;
      amount.value = String(this.editTask.priority);
      button.setAttribute('data-target', '#updateTaskModal');
    }
    if (mode === 'delete') {
      this.deleteTask = task;
      button.setAttribute('data-target', '#deleteTaskModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onCloseModal(): void {
    this.editTask = null;
  }

}
