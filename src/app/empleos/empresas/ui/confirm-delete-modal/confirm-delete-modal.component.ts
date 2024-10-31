import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.css'],
  standalone: true
})
export class ConfirmDeleteModalComponent {
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  confirmDelete() {
    this.deleteConfirmed.emit();
    this.close();
  }

  close() {
    this.closeModal.emit();
  }
}
