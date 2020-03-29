import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl} from '@angular/forms';
import {CourseServiceService} from '../course-service.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as classicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-clone',
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.css']
})
export class CloneComponent implements OnInit {
id:number;
public editor=classicEditor;
  constructor(private router:Router,private courseService:CourseServiceService,private activeRoute:ActivatedRoute,private modalService:NgbModal) { }
  cloneForm=new FormGroup({
    courseName:new FormControl(),
    level:new FormControl(),
    category:new FormControl(),
    tags:new FormControl(),
    slug:new FormControl(),
    levelOverride:new FormControl(),
    availableFor:new FormControl(),
    enrollmentActivityPoints:new FormControl(),
    completionActivityPoints:new FormControl(),
    description:new FormControl(),
    metaKey:new FormControl(),
    metaDescription:new FormControl(),
    chooseIcon:new FormControl(),
    newEditorName:new FormControl(),
    newEditorContentText:new FormControl(),
    editorName:new FormControl(),
    editorContentText:new FormControl(),
  });
  course_name:string;
  levels:any;       //to store the available levels for displayin options in the dropdown
  categories:any;   //to store the available categories for displayin options in the dropdown
  tags:any;
  metaKey:string[];
  currentDoc:any;
  saveEditorContent:boolean;
  listOfDocs:any;
  docId:number;
  existingData:any;
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params=>{
      this.id=params['id'];
    });
    this.viewExistingDataOfChoosenId();
    this.viewLevels();
    this.viewCategories();
    this.viewExistingDocs();
  }
  viewLevels(){
    this.courseService.viewLevel().subscribe(
      (res:any)=>{
          this.levels=res;
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
  open(content) {
    this.modalService.open(content,{
      size: 'xl'
  });
  }
  openExistingDoc(exisingContent,doc:any){
    this.currentDoc=doc;
    
    console.log("document name==>"+this.currentDoc.name);
    console.log("modal is being opened")
    this.modalService.open(exisingContent);
    this.cloneForm.controls['editorName'].setValue(this.currentDoc.name);
    console.log("the id of the clicked document is==>"+doc.id);
    }
   saveContent(){
    this.saveEditorContent=true;
    console.log("save method is called")
    this.modalService.dismissAll();
        }
        viewExistingDocs(){
          this.courseService.viewDocByCourseId(this.id).subscribe((res)=>{
            this.listOfDocs=res;
          });
        }
    
onPublish(){
  console.log("form_value====>"+this.cloneForm.value.level);
  // console.log("text editor==>"+this.editorContent.editorInstance.getData())
  if(this.currentDoc)
  this.docId=this.currentDoc.id;
  else 
  this.docId=null;
  this.courseService.clone(this.cloneForm.value,this.docId).subscribe(
    (res)=>{
      console.log(res);
    }
  );

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
      this.cloneForm.patchValue({
     
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
    
    this.cloneForm.controls['courseName'].setValue(this.existingData.name+"(copy)");
      // console.log(this.existingData.name);
    }
back()
{
  this.router.navigateByUrl("/view");
}
}
