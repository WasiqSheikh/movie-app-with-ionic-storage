import { StorageServiceService } from './../../services/storage-service.service';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {

  currentPage = 1;
  topRatedSeasons: any = [];
  imageBaseUrl = environment.images;
  Loading: boolean = true;
  constructor(private movieService: MovieService,
    private loadingCtrl: LoadingController, private storageService: StorageServiceService) {
    }

  async ngOnInit() {
    await this.storageService.init()
    await this.storageService.get('topratedSeasons').then((data) => {
      if (data) {
        this.topRatedSeasons = data;
        this.Loading = false;
        console.log(this.topRatedSeasons);
      }
      else {
        this.loadMovies();
        //this.loadMore(null);
      }
    })
    // this.loadMovies();
  }

  async loadMovies(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });
    await loading.present();
    this.movieService.getTopRatedMovies(this.currentPage).subscribe(
      (res) => {
        console.log('res = ', res);
        loading.dismiss();
        this.topRatedSeasons.push(...res.results);
        console.log('loadMovies = ',this.topRatedSeasons);
        this.Loading = false
        event?.target.complete();
        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
        //this.storageService.remove('topratedSeasons');
        this.storageService.set('topratedSeasons', this.topRatedSeasons);
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  loadMore(event: InfiniteScrollCustomEvent | any) {
    this.currentPage++;
    this.loadMovies(event);
  }

  // async loadMore(event: InfiniteScrollCustomEvent | any) {
  //   const loading = await this.loadingCtrl.create({
  //     message: 'Loading more movies...',
  //     spinner: 'bubbles',
  //   });
  //   await loading.present();

  //   this.movieService.getTopRatedMovies(this.currentPage).subscribe(
  //     (res) => {
  //       loading.dismiss();  

  //       this.topRatedSeasons.push(...res.results);
  //       this.currentPage++;
  //       this.Loading = res.total_pages === this.currentPage; // Update loading state
  //       this.storageService.set('topratedSeasons', this.topRatedSeasons);

  //       if (event) {
  //         event.target.complete();
  //         event.target.disabled = this.Loading; // Disable infinite scroll if no more data
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //       loading.dismiss();
  //     }
  //   );
  // }
}
