import { Component, OnInit } from '@angular/core';
import{FormGroup, FormControl} from '@angular/forms';

import { CourseServiceService} from '../course-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private courseService: CourseServiceService) { }

  ngOnInit(): void {
  }

  // loginForm=new FormGroup({
  //   userName:new FormControl(),
  //   password:new FormControl()
  // });
  // onSubmit(){
  //   this.courseService.
  // }
}
