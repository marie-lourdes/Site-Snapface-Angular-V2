import { Component, OnInit, OnDestroy} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FaceSnap } from '../models/face-snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';

@Component({
  selector: 'app-face-snap-list',
  templateUrl: './face-snap-list.component.html',
  styleUrls: ['./face-snap-list.component.scss']
})
export class FaceSnapListComponent implements OnInit, OnDestroy {

  faceSnaps!: FaceSnap[];
  subjectDestroy$!: Subject<string>;

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

    this.subjectDestroy$ = new Subject();
    this.subjectDestroy$.subscribe(console.log)//le subject precise et log quand le component est detruit dans sa valeur emise, avec le subscribe toujours avant de definir les valeur d'un Subject
    /* si on veut juste le faire emttre un evenement sans manipuler la valeur emise sans y souscrire directement au subject
    mais qui servira à l operator takeUntil() comme argument pour stopper les emissions de l observable
     - on y souscrit pas et garde l initialisation avec la nouvelle instance de Subject 
     this.subjectDestroy$ = new Subject();
     -et dans destroy la valeur emise ne sera pas manipulé ni loggué aucune reaction a l emission de la valeur
     
     */

    interval$.pipe(
      takeUntil(this.subjectDestroy$)// l operator takeUntil() stoppe les emission de l Observable des que le Subject ou tout autre observable passé en argument a complété
    ).subscribe(val=>console.log("observable avec strategie de unsubscribe avec ngdestroy et takeUntil,Subject", val));
  }

  ngOnDestroy(): void {
    this.subjectDestroy$.next("component detruit")// Le subject emet et complete avec une seule emission
  }
}
