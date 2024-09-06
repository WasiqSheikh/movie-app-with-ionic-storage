import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/tv/top_rated?page=${page}&api_key=${environment.apiKey}`
    );
  }

  getMovieDetails(id: any): Observable<any> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/tv/${id}?api_key=${environment.apiKey}`
    );
  }
}

export interface ApiResult {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

