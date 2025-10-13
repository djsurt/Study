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

  }

  onDragOver(event: DragEvent){

  }

  onDrop(event: DragEvent){
    
  }

  uploadFile(){

  }

  removeFile(){
    
  }
}
