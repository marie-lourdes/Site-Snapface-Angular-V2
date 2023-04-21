import { Component, OnInit } from '@angular/core';
import { Observable, Observer, interval, Subject, BehaviorSubject,timer} from "rxjs";
import { take, map, takeUntil} from "rxjs/operators";
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

    /*SUBJECT*/
    const subject$ = new Subject<number>()
 
    //Le subject peut etre un observable et un observateur, il emet  des valeurs comme addlistener à travers le subscribe et les observers qui ecoute
    // et peut aussi soucrire à un Observable et etre un Observer comme dans le subscriber de l'Observable interval$
    // le Subject peut emettre a plusieurs Observer, il est multicast alors que l 'Observable n a qu un seul Observer qui ecoute ses valeur dans le subscribe 
    //pour que le même Subject soit ecouté par un autre observer, on souscrit au Subject en indiquent un call back observer
    subject$.subscribe({ //*definition de l objet Observer et les callback  observers
    // Observer: collection de callback observers dans le subscribe de Subject , implementer ensuite dans l Observable
    //l observer ecoute les valeur 1 5 et les  valeurs de l Observable interval$
      next:(val)=> console.log("observer A call back",val),
      error:(err)=> console.log("une erreur s est produite",err),
      complete:() => console.log(" observer A finished")
    })
    // L observer A ecoute les valeurs emises du Subject (1, 5) et ceux de l observable car il ecoute a son tour comme Observer de l Observable interval$
    // Mais pas l'observer B car le souscriber qui appelle le call back  observer next() , permet la souscription au Subject apres les emission de 1 et 5 auquelle il n a pas sousscrit en ecoutant avec l Observer de la methode subscribe()
    //on souscrit d abord au Subject puis on definit les valeur dans next() en appelant  call back observer next()
    subject$.next(1)// emet comme un Observable mais  le subscriber recoit les valeurs de  maniere synchrone la valeur 1 et 5 car n est pas appelé depuis une methode subscribe()
    subject$.next(5)

    // le même Subject emet des valeurs a plusieurs Observers l Observer A et l Observer B qui ecoute le meme Subject au meme titre qu' un Observable mais lObservable n a qu un seul Observer dans le subscribe meme avec le constructor:
    /* new Observable(Observer: Observer<number>)
    observer.next(value1)
    observer.next(value2) il s agit du meme observer*/
    subject$.pipe(
      map(val => val*10)
    ).subscribe({ // a la difference des Observable, ces fonctions callback observers qui son defini l objet Observer(une collection de callbacks observers) vont s executer apres la souscription au Subject, on apelle ces callbacks apres la souscription
     next:(val)=> console.log("observer B call back",val),
     error:(err)=> console.log("une erreur s est produite",err),
     complete:() => console.log("observer B finished"),
    })

    subject$.next(10) // appel de la fonction call back observer next() qui s execute apres avoir souscrit
   
    //L observer A et l observer B, ecoute tout deux le meme flux de données  du même Subject apres leur souscription respective au Subject, 
    //a la difference l observer B a un suscriber qui a souscrit aux emisions qui on été traité par map() avant la souscription 
    //Le subject est multicast, en un seul flux, ses données sont distribué a plusieurs point, plus precisement plusieurs Observers(2) de la methode subscribe()

    const interval$ = interval(1000).pipe(
      take(10),
    ).subscribe(subject$);// emet les valeurs dans l observer de interval$ de manière asynchrone avec le bloc de fonction appelé de l observer Subject en arguments depuis la methode subscribe de l Observable interval$ 
    // le subject est implémenté un Observer de l Observable dans le subscribe de l 'Observable interval$, il ecoute les valeur de l Observable interval et emet ses valeurs comme un Observable auquel on a souscrit precedement
    
  

    /* unsubscribe provoque une erreur et apelle le call back error car on unsubscribe () alors que Subject est reutilisé comme Observer dans interval$ mais sans emissions
    // Les observers de Subject implementé dans l Observer du subscriber interval$ n ecoute plus les valeurs car desabonné
    //si on complete plutot que de desouscrire, c est le meme resultat le subject et ses observers n ecoutes plus les valeurs de l observable
    //mais ne provoque pas d erreur car le flux est complété et n existe plus 
    
    subject$.complete()
    subject$.unsubscribe()*/
   
    console.log( "log interval$ avec onserver Subject", interval$)

    // cette methode avec les callback en argument de subscribe de l 'Observable interval2$ est deconseillé,
    // mieux vaut regrouper ces callback dans un objet Observer, ou un Subject qui prend en argument de son subscriber  un objet Observer avec une liste de call backs(next, error, complete)
    const timer$ = timer(5000)
    const interval2$ =interval(1000).pipe(
      takeUntil(timer$) // timer() cree un Observable de chronometre et et takeUntil() dit à l observable de s arreter d emttre quand l observable timer emet et complété à 5s 
    ).subscribe(
      (val)=>console.log("observable interval2",val),
       (error)=>{
        console.log(error)
       },
       () => {    
        console.log( "observable interval 2 finished")
       }
    )
    
    /*BEHAVIORSUBJECT AVEC VALEUR INITIAL*/

    // les Subject n ont pas de valeur initial, mais les BhabiorSubject oui et c est obligatoire
    const behaviorSubject$ = new BehaviorSubject<number>(5);
    behaviorSubject$.subscribe(val=>console.log("log BehaviorSubject en tant qu Observer de intervazl3$ avec valeur initial et les emission de l observable interval3$"))
    const interval3$ = interval(1000).subscribe(behaviorSubject$)
    //le subscriber fonction du constructor de Observable a un Observer qui a 4 methode (next, error, complete, unsubscribe)
    //mais pas la methode subscribe, on cree  l Observable avec son constructor et son Observer apres on y souscrit
    // la methode subscribe() a 3 arguments next, error, complete

    
  /**SNIPET DE CODE AVEC Observer**/ 
    // This function runs when subscribe() is called
    function sequenceSubscriber(observer: Observer<number>)
    {
    // synchronously deliver 1, 2, and 3, then complete
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    // unsubscribe function doesn't need to do anything in this
    // because values are delivered synchronously
    return {unsubscribe() {}};
    }
    // Create a new Observable that will deliver the above sequence
    const sequence = new Observable(sequenceSubscriber);
    // execute the Observable and print the result of eachnotification
    sequence.subscribe({
    next(num) { console.log(num); },
    complete() { console.log('Finished sequence'); }
    });

    // Logs:
    // 1
    // 2
    // 3
    // Finished sequence

  }

}
