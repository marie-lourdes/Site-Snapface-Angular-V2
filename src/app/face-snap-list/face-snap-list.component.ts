import { Component, OnInit } from '@angular/core';
import { interval,Subject, Observable,  of, from } from 'rxjs';
import { tap, mergeMap, map, delay, take } from 'rxjs/operators';

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
  intervalDom2$!: Observable<number>;

  constructor(private faceSnapsService: FaceSnapsService) { }

  ngOnInit(): void {
    this.faceSnaps = this.faceSnapsService.getAllFaceSnaps();
    const observableQuiz$ = from(["first", "second", "third"]).pipe(
      tap(val =>console.log(`valeur observable exterieur ${val}`)),
      mergeMap((val) => this.processMessage$(val) )// avec la souscription à l observable interieur a chaque emission
    ).subscribe(val =>console.log("subscribe observable global",val))


    /**DFFERENCE ENTRE OF() ET FROM() QUI EMET EN UNE SEULE SEQUENCE(dans le même temps) ET L INTERVAL() QUI EMET SELON UN INTERVAL DE MILLISECONDES */
    // emet un a un les valeur en une seule sequence( visible dans la console)
    // puis reste sur la derniere emission qui complete l Observable donc le 5, 
    //le pipe |async  souscrit a l Observable et affichera donc la derniere emission de of()  et n affiche pas toutes les valeurs et des emission 
    // alors qu avec interval(), async souscris mais affiche egalement toutes les emissions qui n emet pas en une seule sequence mais tous les sencondes
    this.intervalDom$ = of(1,2,3,4,5).pipe(
      tap(val => console.log("valeur intervalDom$ of()",val))
    )
    this.intervalDom2$ =interval(1000).pipe(
      take(5),
      tap(val => console.log("valeur intervalDom$ of()",val))
    )
  

    // les operateur ternaire est differentes des conditions if avec les comparaison evalué a true par defaut 
    //: est relié a la valeur false de la variable isfalse et la valeur true pour ?
    const isFalse = false;
    const test = isFalse ? true : false
    console.log(test)
    // avec les operateur et l expression de comparaison , la valeur de retour de l expression comme pour if est à true par defaut!,
    // la valeur de retour qui sera evalue si c est true ? affecte la valeur qui suit et si c est  la valeur de retour de l expression de comparaison est false, ce sera la : qui affecte la valeur qui suit
    const isRed= "red";
    const test2 = isRed === "red" ? true : false
    
  }

  processMessage$(val:string) {
      return of(val).pipe(
        map(val => `val observable interieur: ${val} proceed`),
        delay(3000)
      )
  }
}
