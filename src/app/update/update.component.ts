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
  courseVideoMapping:Array<any>;
  listOfVideos:Array<any>=[];
  listOfAllVideos:Array<any>=[];
  listOfVideosId:Array<number>=[];
  listOfAllVideosId:Array<number>=[];
  videoCheckBoxValuesArray:FormArray;
  videoToBeAddedArray:Array<any>=[];
  
  createForm=new FormGroup({
    courseName:new FormControl(),
    level:new FormControl(),
    category:new FormControl(),
    tags:new FormControl(),
    slug:new FormControl(),
    levelOverride:new FormControl(),
    availableFor:new FormControl(),
    completionActivityPoints:new FormControl(),
    enrollmentActivityPoints:new FormControl(),
    description:new FormControl(),
    metaKey:new FormControl(),
    metaDescription:new FormControl(),
    chooseIcon:new FormControl(),
    newEditorName:new FormControl(),
    newEditorContentText:new FormControl(),
    editorName:new FormControl(),
    editorContentText:new FormControl(),
    videoToBeAdded:new FormArray([])
   
  });
  constructor(private router:Router,private courseService:CourseServiceService,private activeroute: ActivatedRoute,private modalService:NgbModal) { }

  ngOnInit(): void {
   
    this.activeroute.queryParams.subscribe(params => {
      this.id = params['id'];
      //console.log("-----------"+params['id'])
    });
    this.viewExistingDataOfChoosenId();
    this.viewLevels();
    this.viewCategories();
    this.viewExistingDocs();
    this.viewExistingVideos();
    this.viewAllVideos();
    
  }
  viewExistingDataOfChoosenId(){
console.log("fetched id : ==>"+this.id);
    this.courseService.viewCourseById(this.id).subscribe((res:any)=>{
    this.existingData=res;
    console.log("existing data  =>"+this.existingData.levelObj.name);
    this.loadValueInUpdateForm();//mapping is done
  });
     
  }
  public loadValueInUpdateForm(){
    console.log("loadvalue function is called"+this.existingData);
    console.log("level_id=====>"+this.existingData.levelObj.id);
    //console.log("document id is===>"+this.existingData.docObj[0].id)
    this.createForm.patchValue({
   
    courseName:this.existingData.name,
    level:this.existingData.levelObj.id,
    category:this.existingData.categoryObj.id,
    slug:this.existingData.slug,
    tags:this.existingData.tag.split(','),
    levelOverride:this.existingData.isLevelOverride,
    availableFor:this.existingData.availableFor,
    completionActivityPoints:this.existingData.completionActivityPoints,
    enrollmentActivityPoints:this.existingData.enrollmentActivityPoints,
    description:this.existingData.description,
    metaKey:this.existingData.metaKey.split(','),
    metaDescription:this.existingData.metaDesc,
    chooseIcon:this.existingData.course_icon,
    // editorText:this.existingData.docObj.content,
    // editorID:this.existingData.docObj[0].id
    });
   
    // console.log(this.existingData.name);
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
        this.levels=res;
        // console.log(this.levels);
        
    }
  );
}
viewCategories(){
  this.courseService.viewCategory().subscribe(
    (res:any) =>{
      this.categories=res;
    }
  );

}

onSaveAsNewVersion(){
  
  console.log("videos to be added are =>"+this.createForm.controls['videoToBeAdded'].value);
  console.log("form_value====>"+this.createForm.value.level);
  // console.log("text editor==>"+this.editorContent.editorInstance.getData())
  if(this.currentDoc)
  this.docId=this.currentDoc.id;
  else 
  this.docId=null;
  this.courseService.update(this.createForm.value,this.id,this.docId,this.videoToBeAddedArray).subscribe(
    (res)=>{
      console.log(res);
   });
  this.router.navigate(['view']); 
}
open(content) {
  this.modalService.open(content,{
    size: 'xl'
});
}
openAddVideoModal(content){
  console.log("open modal is called")
  this.modalService.open(content,{
    size: 'md'
});
console.log("inside add video modal, size of listOfvideo"+this.listOfVideos.length)
for(let i=0;i<this.listOfVideos.length;i++){
  this.listOfVideosId.push(this.listOfVideos[i].id);
  console.log("listofvideosId"+this.listOfVideos[i].id)
}
// document.getElementById('docName').setAttribute('value',this.currentDoc.name);
}
openExistingDoc(exisingContent,doc:any){
  this.currentDoc=doc;
  
  console.log("document name==>"+this.currentDoc.name);
  console.log("modal is being opened")
  this.modalService.open(exisingContent);
  this.createForm.controls['editorName'].setValue(this.currentDoc.name);
  // this.ref=document.getElementById('docName');
  //document.getElementById('docName').setAttribute('value',this.currentDoc.name);
  // this.ref.select();
  // this.ref.value=this.currentDoc.name;
  // console.log("value of the reference"+ document.getElementById('docName'))
 
console.log("the id of the clicked document is==>"+doc.id);
//this.editorContenttwo.editorInstance.setData(doc.content);
}
 saveContent(){
  this.saveEditorContent=true;
  console.log("save method is called")
 // console.log(this.createForm.value)
  // console.log(this.editorContent)
  // console.log(this.editorContent.editorInstance.getData())
  this.modalService.dismissAll();
      }
      viewExistingDocs(){
        this.courseService.viewDocByCourseId(this.id).subscribe((res)=>{
          this.listOfDocs=res;
        });
      }
      viewExistingVideos(){
        console.log("viewExistingVideos function is called..");
        this.courseService.viewVideoByCourseId(this.id).subscribe((res:Array<any>)=>{
         this.courseVideoMapping=res;
          console.log("response is:---------->"+this.courseVideoMapping)
          console.log("video id=======>"+this.courseVideoMapping[0].videoId)
          this.getVideoById();
        
        });

       // console.log(this.courseVideoMapping)
        
        }
        getVideoById(){
          let i=0;
          for(i=0;i<this.courseVideoMapping.length;i++){
            this.courseService.viewVideoById(this.courseVideoMapping[i].videoId).subscribe(
              (res)=>{
                this.listOfVideos.push(res);
                console.log("here res is===>"+res)
                console.log("current state of listOfVideos is==>"+this.listOfVideos)
              }
            );
          }
          console.log("result==========>"+this.listOfVideos.length);
         
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
          console.log("Checkboxchanged method called")
          const formArray: FormArray = this.createForm.get('videoToBeAdded') as FormArray;
          if(event.target.checked){
            formArray.push(new FormControl(event.target.value));
          }
        }
        addSelectedVideo(){
          const formArray: FormArray = this.createForm.get('videoToBeAdded') as FormArray;
          console.log("add button is clicked and value===>"+formArray)
          
          for(let i=0;i<formArray.length;i++){
            console.log("elements are"+formArray.at(i).value)
           let video={
             "videoId":formArray.at(i).value
           }
           this.videoToBeAddedArray.push(video);
        }
        console.log("resultant array:"+this.videoToBeAddedArray);
        this.modalService.dismissAll();
        }
      back()
      {
        this.router.navigateByUrl("/view");
      }
}
