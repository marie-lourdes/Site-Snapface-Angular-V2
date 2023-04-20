import { Component, OnInit } from '@angular/core';
import { interval, Subject} from "rxjs";
import { take, map } from "rxjs/operators";
import { FaceSnap } from '../models/face-snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';

@Component({
  selector: 'app-face-snap-list',
  templateUrl: './face-snap-list.component.html',
  styleUrls: ['./face-snap-list.component.scss']
})
export class FaceSnapListComponent implements OnInit {

  faceSnaps!: FaceSnap[];

  constructor(private faceSnapsService: FaceSnapsService) { }

  ngOnInit(): void {
    this.faceSnaps = this.faceSnapsService.getAllFaceSnaps();
    const subject = new Subject<number>()
    const str :string ="bjrker" 
    //Le subject peut etre un observable et un observateur, il emet  des valeurs comme addlistener à travers le subscribe et les observers qui ecoute
    // et peut aussi soucrire à un Observable et etre un Observer comme ci dessous
    subject.subscribe({ //*definition de l objet Observer et les callback  observers
       // Observer: collection de callback observers dans le subscribe de Subject , implementer ensuite dans l Observable
      //l observer ecoute les valeur 1 5 et les  valeurs de l Observable interval$
      next:(val)=> console.log("observer call back",val),
      error:(err)=> console.log("une erreur s est produite",err),
      complete:() => console.log("finished")
    })
    subject.next(1)// emet comme un Observable mais de maniere synchrone la valeur 1 et 5 car n est pas appelé depuis une methode subscribe()
    subject.next(5)
    
    const interval$ = interval(1000).pipe(
      take(10),
    ).subscribe(subject);// emet les valeurs dans l observer de interval$ de manière asynchrone avec le bloc de fonction appelé de l observer Subject en arguments depuis la methode subscribe de l Observable interval$ 
    // le subject est implémenté un Observer de l Observable dans le subscribe de l 'Observable interval$, il ecoute les valeur de l Observable interval et emet ses valeurs comme un Observable auquel on a souscrit precedement
   

  }

}
