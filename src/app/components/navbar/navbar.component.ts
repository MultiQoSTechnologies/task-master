import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Board } from '../../models/board.model';
import { ThemeTogglerComponent } from "../sidebar/theme-toggler/theme-toggler.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, MatMenuModule, ThemeTogglerComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() opened!: boolean;
  @Input() activeBoard!: Board | null;
  @Input() boards!: Board[];
  @Input() darkMode!: boolean;
  @Output() boardSelect = new EventEmitter<number>();
  @Output() boardAdd = new EventEmitter<void>();
  @Output() boardEdit = new EventEmitter<void>();
  @Output() boardDelete = new EventEmitter<void>();
  @Output() taskAdd = new EventEmitter<void>();
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() enableDarkMode = new EventEmitter<boolean>();
  sidebarShown = false;
  @Output() openSidebar = new EventEmitter<void>();

  expandSidebar(): void {
    this.openSidebar.emit();
  }
  collapseSidebar(): void {
    this.closeSidebar.emit();
  }
  selectBoard(boardIdx: number): void {
    this.boardSelect.emit(boardIdx);
  }

  addBoard(): void {
    this.boardAdd.emit();
  }

  editBoard(): void {
    this.boardEdit.emit();
  }

  deleteBoard(): void {
    this.boardDelete.emit();
  }


  open(): void {
    this.sidebarShown = true;
  }

  close(): void {
    this.sidebarShown = false;
  }

  stopPropagation(e: Event) {
    e.stopPropagation();
  }
}
