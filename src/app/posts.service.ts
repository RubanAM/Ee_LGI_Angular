import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Post } from './post.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(postData: Post, addSuccess: boolean) {
    this.http
      .post<{ Post }>(
        'https://v97g8jmdi6.execute-api.eu-west-2.amazonaws.com/dev/employee',
        postData,
        {
          observe: 'response'
        }
      )
      .subscribe(
        responseData => {
          console.log(responseData);
          addSuccess=true;
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    return this.http
      .get<{ Post }>(
        /* 'http://localhost:3000/employee', */
       'https://v97g8jmdi6.execute-api.eu-west-2.amazonaws.com/dev/employees',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: searchParams,
          responseType: 'json'
        }
      )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key] });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts(employeeID: string) {
    return this.http
      .delete<{string}>('https://v97g8jmdi6.execute-api.eu-west-2.amazonaws.com/dev/employee/'+ employeeID, {
      /* .delete<{string}>('http://localhost:3000/employee/'+ employeeID, { */
        observe: 'events'
      })
      .pipe(
        tap(event => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            // ...
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
