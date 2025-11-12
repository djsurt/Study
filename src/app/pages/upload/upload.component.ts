import { Component } from '@angular/core';
import { response } from 'express';

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

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Upload successful:', data);
      this.isUploading = false;
      this.uploadProgress = 100;
      alert(`File uploaded successfully: ${data.url}`);
    })
    .catch(error => {
      console.log('Upload failed', error);
      this.isUploading = false;
      alert('File upload failed. Please try again.');
    });
  }

  removeFile(){
    this.selectedFile = null;
    this.fileName = '';
    this.uploadProgress = 0;
    this.isUploading = false;
  }
}
