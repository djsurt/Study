import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  isUploading: boolean = false;
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  fileName: string = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  onDragOver(event: DragEvent){
    event.preventDefault();
  }

  onDrop(event: DragEvent){
    event.preventDefault();
    if(event.dataTransfer?.files && event.dataTransfer.files.length > 0){
      this.selectedFile = event.dataTransfer.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  uploadFile(){
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress with a mock implementation
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.isUploading = false;
        // Optional: Reset after showing success message
        // setTimeout(() => this.removeFile(), 3000);
      }
    }, 200); // Updates every 200ms for smooth progress
  }

  removeFile(){
    this.selectedFile = null;
    this.fileName = '';
    this.uploadProgress = 0;
    this.isUploading = false;
  }
}
