import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-service.service';
// import * as data from "../data/posts.json";

export interface PostSchema {
  username: string;
  post: string;
  likes: number;
  shares: number;
  topics: string;
  date_created: string;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})

export class FeedComponent implements OnInit {

  postlist: PostSchema[] = [];

  constructor(
    private dataService : DataService
  ) {}

  ngOnInit(): void {
    this.dataService.getJSON().subscribe(data => {
      this.postlist = data;
      console.log(this.postlist);
    });
    // console.log('test');
    // console.log(this.postlist);
    // console.log(data);
    // this.postlist = data;
    
  }

}
