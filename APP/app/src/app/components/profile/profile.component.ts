import { Component, OnInit } from '@angular/core';
import { ApiService, PostResponse, PostSchema } from '../../services/feed/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  timeline: PostSchema[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getAuthenticatedUserPosts().subscribe((data: PostResponse) => {
      this.timeline = data.posts;
    });
  }

}
