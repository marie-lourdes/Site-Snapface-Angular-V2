import { Component, OnInit, OnDestroy} from '@angular/core';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

import { FaceSnap } from '../models/face-snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';

@Component({
  selector: 'app-face-snap-list',
  templateUrl: './face-snap-list.component.html',
  styleUrls: ['./face-snap-list.component.scss']
})
export class FaceSnapListComponent implements OnInit, OnDestroy {

  faceSnaps!: FaceSnap[];

  constructor(private faceSnapsService: FaceSnapsService) { }

  ngOnInit(): void {
    this.faceSnaps = this.faceSnapsService.getAllFaceSnaps();

    // en changeant de page  et revenant sur la page la class FaceSnapListCompoment apelle a nouveau ngOnInit() et initialise a nouveau une autre instance de l observable interval$ cree avec subscribe
    // par defaut l observable cree une nouvel instance avec subscribe()
    // a chaque fois qu on sort et revient sur la page d autres instance de l Observable est créé avec subscribe 
    //et les flux des precedentes instances de l Observable continue à émettre car nous avons pas unsubscribe ou limiter les emissions
    //ce qu on appelle une fuite de memoire, il faut mettre en place une strategie de unsubscribe
    const interval$ = interval(1000);

    //**Observable avec strategie de unsubscribe pour eviter les fuite de memoire lorsqu on est pas sur cette page virtuel en limitant les emissions avec l operator bas niveau take() et completer l observable au bout de 10 emissions
    interval$.pipe(
      take(10),
    ).subscribe(val=>console.log("observable avec strategie de unsubscribe avec(take(10)", val));

    interval$.subscribe(val=>console.log("observable avec strategie de unsubscribe avec ngdestroy et takeUntil,Subject", val));
  }

  ngOnDestroy(): void {
    
  }
}
