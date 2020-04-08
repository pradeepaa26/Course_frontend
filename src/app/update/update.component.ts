import { Component, OnInit } from '@angular/core';
import{FormGroup, FormControl, FormArray} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import * as classicEditor from '@ckeditor/ckeditor5-build-classic';
import {ViewChild} from '@angular/core';
import {CourseServiceService} from '../course-service.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  public editor=classicEditor;
  // @ViewChild('editorReference') editorContent:any;
  
  levels:Array<any>=[];
  course_name="";
  slug:any;
  categories:Array<any>=[];
  textEditor:any;
  metaKey:string;
  tags:string;
  id:number;
  existingData:any;
  saveEditorContent:boolean;
  listOfDocs:any;
  currentDoc:any;
  docId:number;
  courseVideoMapping:Array<any>=[];
  listOfVideos:Array<any>=[];
  listOfAllVideos:Array<any>=[];
  listOfVideosId:Array<number>=[];
  listOfAllVideosId:Array<number>=[];
  videoCheckBoxValuesArray:FormArray;
  videoToBeAddedArray:Array<any>=[];
  listOfVideosdata:any;

  createForm=new FormGroup({
    createdon:new FormControl(),
    courseName:new FormControl(),
    version:new FormControl(),
    level:new FormControl(),
    category:new FormControl(),
    tags:new FormControl(),
    slug:new FormControl(),
    levelOverride:new FormControl(),
    isPreSignUp:new FormControl(),
    isSlugLogin:new FormControl(),
    isDashboard:new FormControl(),
    completionActivityPoints:new FormControl(),
    enrollmentActivityPoints:new FormControl(),
    description:new FormControl(),
    metaKey:new FormControl(),
    metaDescription:new FormControl(),
    chooseIcon:new FormControl(),
    newEditorName:new FormControl(),
    mode:new FormControl(),
    newEditorContentText:new FormControl(),
    editorName:new FormControl(),
    editorContentText:new FormControl(),
    videoToBeAdded:new FormArray([])
  });
  constructor(private router:Router,private courseService:CourseServiceService,private activeroute: ActivatedRoute,private modalService:NgbModal) { }

  ngOnInit(): void {
   
    this.activeroute.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.viewExistingDataOfChoosenId();
    this.viewLevels();
    this.viewCategories();
    this.viewExistingDocs();
    this.viewExistingVideos();
    this.viewAllVideos();
    
  }
  viewExistingDataOfChoosenId(){
    this.courseService.viewCourseById(this.id).subscribe((res:any)=>{
    this.existingData=res.data;
    this.loadValueInUpdateForm();//mapping is done
  });
     
  }
  public loadValueInUpdateForm(){
    this.createForm.patchValue({
   version:this.existingData.version,
    courseName:this.existingData.name,
    level:this.existingData.levelObj.id,
    category:this.existingData.categoryObj.id,
    slug:this.existingData.slug,
    tags:this.existingData.tag.split(','),
    levelOverride:this.existingData.isLevelOverride,
    isPreSignUp:this.existingData.isPreSignUp,
    isDashboard:this.existingData.isDashboard,
    isSlugLogin:this.existingData.isSlugLogin,
    completionActivityPoints:this.existingData.completionActivityPoints,
    enrollmentActivityPoints:this.existingData.enrollmentActivityPoints,
    description:this.existingData.description,
    metaKey:this.existingData.metaKey.split(','),
    metaDescription:this.existingData.metaDesc,
    chooseIcon:this.existingData.course_icon,
    mode:this.existingData.mode,
    createdon:this.existingData.createdOn,
    });
  }
  public onReadyForNewEntry( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
}
public onReadyForExitstingEntry( editor ,doc:any) {
  editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
  );
  editor.setData(doc.content);
 
}

viewLevels(){
  this.courseService.viewLevel().subscribe(
    (res:any)=>{
        this.levels=res.data;
        
    }
  );
}
viewCategories(){
  this.courseService.viewCategory().subscribe(
    (res:any) =>{
      this.categories=res.data;
    }
  );

}

onSaveAsNewVersion(){
  this.createForm.value.version++;
  this.createForm.value.mode="p";
  if(!this.currentDoc)
    this.currentDoc=null;
  this.courseService.update(this.createForm.value,this.id,this.currentDoc,this.videoToBeAddedArray).subscribe(
    (res)=>{
      this.router.navigateByUrl("/view");
   });
 
}
onSaveAsDraft(){
  this.createForm.value.mode="d";
  if(!this.currentDoc)
  this.currentDoc=null;
  this.courseService.update(this.createForm.value,this.id,this.currentDoc,this.videoToBeAddedArray).subscribe(
    (res)=>{
      this.router.navigateByUrl("/view");
   });
   
}
open(content) {
  this.modalService.open(content,{
    size: 'xl'
});
}
openAddVideoModal(content){
  this.modalService.open(content,{
    size: 'md'
});
for(let i=0;i<this.listOfVideos.length;i++){
  this.listOfVideosId.push(this.listOfVideos[i].id);
}
}
openExistingDoc(exisingContent,doc:any){
  this.currentDoc=doc;
  
  this.modalService.open(exisingContent);
  this.createForm.controls['editorName'].setValue(this.currentDoc.name);
}
 saveContent(){
  this.saveEditorContent=true;
  this.modalService.dismissAll();
      }
      viewExistingDocs(){
        this.courseService.viewDocByCourseId(this.id).subscribe((res:any)=>{
          this.listOfDocs=res.data;
        });
      }
      viewExistingVideos(){
        this.courseService.viewVideoByCourseId(this.id).subscribe((res:any)=>{
         this.courseVideoMapping=res.data;
          this.getVideoById();
        });
        }
        getVideoById(){
          let i=0;
          for(i=0;i<this.courseVideoMapping.length;i++){
            this.courseService.viewVideoById(this.courseVideoMapping[i].videoId).subscribe(
              (res:any)=>{
                this.listOfVideos.push(res);
              }
            );
          }
         
        }
        viewAllVideos(){
          this.courseService.viewAllVideos().subscribe(
            (res:any)=>{
            this.listOfAllVideos=res;
            
            for(let i=0;i<this.listOfAllVideos.length;i++)
                this.listOfAllVideosId.push(this.listOfAllVideos[i].id);
          })
          
        }
       onCheckBoxChange(event){
          const formArray: FormArray = this.createForm.get('videoToBeAdded') as FormArray;
          if(event.target.checked){
            formArray.push(new FormControl(event.target.value));
          }
        }
        addSelectedVideo(){
          const formArray: FormArray = this.createForm.get('videoToBeAdded') as FormArray;
          
          for(let i=0;i<formArray.length;i++){
           let video={
             "videoId":formArray.at(i).value
           }
           this.videoToBeAddedArray.push(video);
        }
        this.modalService.dismissAll();
        }
        deleteCourseVideoMapping(id:number){
          let courseVideoMappingId;
          for(let i=0;i<this.courseVideoMapping.length;i++){
            if(this.courseVideoMapping[i].videoId==id)
                courseVideoMappingId=this.courseVideoMapping[i].id;
          }
          return this.courseService.deleteCourseVideoMapping(courseVideoMappingId).subscribe(
            (res)=>{

            }
          );
        }
      back()
      {
        this.router.navigateByUrl("/view");
      }
}
