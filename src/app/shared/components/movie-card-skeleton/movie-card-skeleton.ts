import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-movie-card-skeleton',
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './movie-card-skeleton.html',
  styleUrl: './movie-card-skeleton.scss',
})
export class MovieCardSkeletonComponent {}
