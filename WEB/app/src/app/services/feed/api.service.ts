import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError, map, take } from "rxjs/operators";
import { environment } from "src/environments/environment";


const POST_API = environment.appServer + '/api/posts';
const COMMENT_API = environment.appServer + 'api/comments';


export interface PostResponse {
    posts: PostSchema[];
}

export interface PostSchema {
    id: string;
    created_at: string;
    text_content: string;
    img_urls: string[];
    posted_by: string;
    comments: string[]
}

export interface CommentResponse {
    comments: CommentSchema[];
}

export interface CommentSchema {
    id: string;
    created_at: string;
    text_content: string;
    commebted_by: string;
    commented_on: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient){ }

    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error(`http error: ${error.error.message}`)
        } else {
            console.error(`bad response: ${error.status}: ${error.statusText} ${JSON.stringify(error.error)}`);
        }
        return throwError('Loging attempt failed');
    }

    getAuthenticatedUserPosts() {
        const opts = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            })
        };
        return this.http.get<PostResponse>(POST_API, opts);
    }

    getPostComments(post_id: string) {
        const opts = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }),
            params: new HttpParams({
                fromString: post_id
            })
        };
        return this.http.get<CommentResponse>(COMMENT_API, opts);
    }

    
}