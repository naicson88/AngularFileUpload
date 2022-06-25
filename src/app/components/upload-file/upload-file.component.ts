import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/services/file-upload.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  selectedFiles: FileList
  currentFile: File
  progress = 0;
  message = '';
  fileInfos: Observable<any>

  constructor(private uploadService: FileUploadService) { }

  ngOnInit() {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event:any){
    this.selectedFiles = event.target.files;
  }

  upload(){
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);

    this.uploadService.upload(this.currentFile).subscribe( event => {
      if(event.type === HttpEventType.UploadProgress){
        this.progress = Math.round(100 * event.loaded / event.total);

      } else if (event instanceof HttpResponse ){
        this.message = event.body.message;
        this.fileInfos = this.uploadService.getFiles();
      }
    }, err => {
      this.progress = 0;
      this.message = 'It was not possible upload the file!';
      this.currentFile = undefined
      console.log(err);

    });
    this.selectedFiles = undefined;
  }

}
