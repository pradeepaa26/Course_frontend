import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseServiceService } from '../course-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  id: number;
  object: Array<any> = [];
  constructor(private courseService:CourseServiceService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.viewDetails()
  }
  viewDetails()
  {
//console.log(this.id);
this.courseService.viewCourseById(this.id).subscribe((res :any)=>{
  this.object=res;
  this.object = arrayparse(this.object);//bcoz object should be an array then only we can use ngfor in html 
  function arrayparse(object) {
    return new Array(object);
  }
  console.log(this.object);
},error=>{
  console.log(error);
});
  }
back()
{
  this.router.navigateByUrl("/view");
}
}
