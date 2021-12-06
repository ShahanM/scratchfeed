import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of } from 'rxjs';
import data from "./data/posts.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {

   constructor(private http: HttpClient) {
        this.getJSON().subscribe(data => {
            console.log(data);
            return of(data).pipe();
        });
    }

    public getJSON(): Observable<any> {
        // return this.http.get("./data/posts.json");
        return of(data).pipe();
    }
}