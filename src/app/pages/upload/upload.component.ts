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

  }

  onDrop(event: DragEvent){
    event.preventDefault();
    if(event.dataTransfer?.files && event.dataTransfer.files.length > 0){
      this.selectedFile = event.dataTransfer.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  uploadFile(){

  }

  removeFile(){

  }
}
