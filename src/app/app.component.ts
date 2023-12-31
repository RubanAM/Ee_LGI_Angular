import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AddForm, Department, Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;
  addSuccess:boolean = false;

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    this.addSuccess = false;
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
        console.log("loaded posts 1",this.loadedPosts)
      },
      error => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onCreatePost(formData: AddForm) {
    let departmentData: Department = {
      departmentCode: formData.departmentCode,
      departmentName: formData.departmentName
    }
    let postData: Post = {
      employeeId: formData.employeeId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      department: departmentData
    }
    // Send Http request
    this.postsService.createAndStorePost(postData,this.addSuccess);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
        console.log("loaded posts 2",this.loadedPosts)
      },
      error => {
        this.isFetching = false;
        this.error = error.message;
        console.log(error);
      }
    );
  }

  onClearPosts(post: Post) {
    // Send Http request
    this.postsService.deletePosts(post.employeeId).subscribe(() => {
      this.onFetchPosts();
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
