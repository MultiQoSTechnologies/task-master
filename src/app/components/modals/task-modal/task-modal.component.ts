import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Column } from '../../../models/column.model';
import { Task } from '../../../models/task.model';
import { SubTask } from '../../../models/subTask.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, ReactiveFormsModule, MatMenuModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  form!: FormGroup;
  opened = false;
  isDisabled: boolean = true;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      task: Task;
      darkMode: boolean;
      columns: Column[];
      editMode: boolean;
      currentColumn:any
    },
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.nonNullable.group({
      title: this.fb.control(this.data.task?.title || '', {
        validators: [Validators.required],
      }),
      description: this.fb.control(this.data.task?.description || ''),
      status: this.fb.control(
        this.data.task?.status || this.data?.currentColumn,
        {
          validators: [Validators.required],
        },
      ),
      subtasks: this.fb.array([
        this.fb.nonNullable.group({
          isCompleted: false,
          title: ['', Validators.required],
        }),
      ]),
    });

    if (this.data.task?.subtasks.length > 0) {
      this.subTaskArray.clear();
      this.data.task.subtasks.forEach((subtask) => this.addSubtask(subtask));
    }
    this.form.get('status')?.disable()
  }

  get subTaskArray() {
    return this.form.get('subtasks') as FormArray;
  }

  addSubtask(subtask: SubTask = { title: '', isCompleted: false }) {
    const group = this.fb.nonNullable.group({
      isCompleted: subtask.isCompleted,
      title: [subtask.title, Validators.required],
    });
    this.subTaskArray.push(group);
  }

  removeSubtask(index: number): void {
    this.subTaskArray.removeAt(index);
  }

  openDropdown(): void {
    this.trigger.openMenu();
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  submit() {
    const editMode = this.data.editMode;

    if (editMode) {
      const updatedBoard: any = {
        ...this.data.task,
        ...this.form.value,
      };

      console.log(updatedBoard);
      this.dialogRef.close({ ...updatedBoard });
    }

    if (!editMode) {
      let data=this.form.value
      data['status']=this.form.get('status')?.value
      this.dialogRef.close(data);
    }
  }
}
