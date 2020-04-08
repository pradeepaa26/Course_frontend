import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {CourseServiceService} from '../course-service.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  id:number;
  courseObject:any;
  confirmation:boolean;
  availableFor:Array<any>=[];
  courseVideoMapping:Array<any>;
  listOfVideos:Array<any>=[];
  constructor(private router: Router,private route:ActivatedRoute,private courseService:CourseServiceService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{
      this.id=params['id'];
    });
    this.viewDetails();
    this.viewExistingVideos();

  }

  viewDetails(){
    this.courseService.viewCourseById(this.id).subscribe((res:any)=>{
      this.courseObject=res.data;
    });
  
  }
  back(){
  this.router.navigateByUrl("/view");
      }
  delete(id:number)
      {
      this.confirmation=confirm("Are you sure to delete this course")
      if(this.confirmation)
      {
        this.courseService.delete(id).subscribe((res:any)=>{
          this.router.navigateByUrl("/view");
        },error=>{
          console.log(error)
        }); 
      }
    }
  navigatToUpdateComponent=(id:number)=>{
    this.router.navigate(['/update'],{ queryParams: { id: id} });
  }
  navigatToCloneComponent=(id:number)=>{
    this.router.navigate(['/clone'],{ queryParams: { id: id} });
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
}
