import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observer, Observable,  of, from } from 'rxjs';
import { tap, mergeMap, concatMap, map, delay } from 'rxjs/operators';

import { FaceSnap } from '../models/face-snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';

@Component({
  selector: 'app-face-snap-list',
  templateUrl: './face-snap-list.component.html',
  styleUrls: ['./face-snap-list.component.scss']
})

export class FaceSnapListComponent implements OnInit {

  faceSnaps!: FaceSnap[];
  subjectDestroy$!: Subject<string>;
  intervalDom$!: Observable<number>;

  constructor(private faceSnapsService: FaceSnapsService) { }

  ngOnInit(): void {
    this.faceSnaps = this.faceSnapsService.getAllFaceSnaps();
    const intervalQuiz = of("first", "second", "third").pipe(
      tap(val =>console.log(`valeur observable exterieur ${val}`)),
      mergeMap((val) => this.processMessage$(val) )
    ).subscribe(console.log)

    // les operateur ternaire est differentes des conditions if avec les comparaison evalué a true par defaut 
    //: est relié a la valeur false de la variable isfalse et la valeur true pour ?
    const isFalse = false;
    const test = isFalse ? true : false
    // avec les operateur et l expression de comparaison , la valeur de retour de l expression comme pour if est à true par defaut!,
    // la valeur de retour qui sera evalue si c est true ? affecte la valeur qui suit et si c est  la valeur de retour de l expression de comparaison est false, ce sera la : qui affecte la valeur qui suit
    const isRed= "red";
    const test2 = isRed === "red" ? true : false
    console.log(test)
  }
  processMessage$(val:string) {
      return of(val).pipe(
        map(val => `val observable interieur: ${val} proceed`),
        delay(3000)
      )
  }

 

}
