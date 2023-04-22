import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subject, Observer, Observable, timer } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { FaceSnap } from '../models/face-snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';

@Component({
  selector: 'app-face-snap-list',
  templateUrl: './face-snap-list.component.html',
  styleUrls: ['./face-snap-list.component.scss']
})

//implementation life cycle hook OnInit pour le montage du component OnInit et le life cycle hook OnDestroy pour le demontage du component 
//dont apelle les methode respectives
export class FaceSnapListComponent implements OnInit, OnDestroy {

  faceSnaps!: FaceSnap[];
  subjectDestroy$!: Subject<string>;
  intervalDom$!: Observable<number>;

  constructor(private faceSnapsService: FaceSnapsService) { }

  ngOnInit(): void {
    this.faceSnaps = this.faceSnapsService.getAllFaceSnaps();

    // en changeant de page  et revenant sur la page la class FaceSnapListCompoment apelle a nouveau ngOnInit() et initialise a nouveau une autre instance de l observable interval$ cree avec subscribe
    // par defaut l observable cree une nouvel instance avec subscribe()
    // a chaque fois qu on sort et revient sur la page d autres instance de l Observable est créé avec subscribe 
    //et les flux des precedentes instances de l Observable continue à émettre car nous avons pas unsubscribe ou limiter les emissions
    //ce qu on appelle une fuite de memoire, il faut mettre en place une strategie de unsubscribe
    
    const interval$ = interval(1000);

    /*STRATEGIE-1 UNSUBSCRIBE AVEC LA COMPLETION DE L OBSERVABLE EN INDIQUANT LES EMISSIONS QUI NOUS INTERESSENT*/
    //**Observable avec strategie de unsubscribe pour eviter les fuite de memoire lorsqu on est pas sur cette page virtuel en limitant les emissions avec l operator bas niveau take() et completer l observable au bout de 10 emissions
    interval$.pipe(
      take(10),
    ).subscribe(val => console.log("observable avec strategie de unsubscribe avec(take(10)", val));

    /*STRATEGIE-2 UNSUBSCRIBE AVEC LA DESTRUCTION DE L OBSERVABLE EN DETRUISANT LE COMPONENT*/
    // creation de l instance de la classe Observable Subject avec le constructor qui initialise l'objet subjectDestroy$ et qui est appelé avec new 
    this.subjectDestroy$ = new Subject<string>();
    this.subjectDestroy$.subscribe(console.log)//le subject precise et log quand le component est detruit dans sa valeur emise, avec le subscribe toujours avant de definir les valeur d'un Subject
    /* si on veut juste le faire emttre un evenement sans manipuler la valeur emise sans y souscrire directement au subject
    mais qui servira à l operator takeUntil() comme argument pour stopper les emissions de l observable
     - on y souscrit pas et garde l initialisation avec la nouvelle instance de Subject 
     this.subjectDestroy$ = new Subject();
     -et dans destroy la valeur emise ne sera pas manipulé ni loggué aucune reaction a l emission de la valeur
     
     */
    interval$.pipe(
      takeUntil(this.subjectDestroy$)// l operator takeUntil() stoppe les emission de l Observable des que le Subject ou tout autre observable passé en argument a complété
    ).subscribe(val => console.log("observable avec strategie de unsubscribe avec ngdestroy et takeUntil,Subject", val));

    /* interval$.pipe(
      tap(val=> console.log("log tap observable:", val))
    ).subscribe()*/

    /*STRATEGIE-3 UNSUBSCRIBE AVEC LA SOUSCRIPTION DANS LE TEMPLATE AVEC LE PIPE ASYNC QUI UNSUBSCRIBE AUTOMATIQUEMENT LORS DE LA DESTRUCTION DU COMPONENT*/
    this.intervalDom$ = interval$;

    
    /***DIFFERENCE ENTRE OBSERVABLE ET SUBJECT***/

    //a la difference des Observables comme ceux generé par interval(), on ne peut pas les forcer a emettre, Subject permet de le faire emettre à la demande car on peut configurer l Observer de son subscribe et le faire emettre à la demande en appelant un des callback de l Observer next()
    // si on veut controler les emission d un Oservable , il  faut ajouter l objet Observer dans le constructor de l Observervable et appeler les methode de l Observer:
    
    //l Observable timer() tres utile pour notifier(emettre) apres le delay passé en 1erargument, et emet un number 0 par defaut au bout de ce delay, puis le 2eme argument qui est l interval
    const timer$ = timer(5000, 1000).pipe(
      tap(val=>console.log("observable timer", val))
    ).subscribe()// ce callback dans subscribe est une fonction next() en premier argument qui n est utilisé qu'une fois, donc on ne peut controler chaque emission sinon ecouter toutes emissions

    /**Si on cree un Observer et ajoute au subscribe de l Observable: **/

    const observable$ = new Observable<number>();
    const observer$: Observer<number> = { //inititialisation du Type Observer avec l objet vide 
      next:(val) => console.log("log type Observer de observable$: ",val),
      error:(error) => console.log(error),
      complete:() =>console.log("finished")
    }
    const observer2$: Observer<number> ={
      next:(val) => console.log("log type Observer de interval$: ",val),
      error:(error) => console.log(error),
      complete:() =>console.log("finished")
    }
    observer$.next(1);
    observer$.next(3);
    // les deux Observers ecoutent les valeurs de leurs Observables respectif mais ne peut avoir qu un seul Observer à la fois
    // contrairement a Subject ou on peut configurer plusieurs Observer dans chaque subscribe() au Subject qui peut etre un Observable auquel on souscrit mais aussi un Observer pour un autre Observable
    observable$.subscribe(observer$);
    interval$.subscribe(observer2$);

    /** Si on cree plusieurs Observer dans un Subject qu on implementer comme un Observer de intervalSubjObserver$
    et ajoute au subscribe de l Observable : **/
    const subjectAsObserver$ = new Subject<any>();
    const observerA$: Observer<number> = { //initialisation du Type Observer avec l objet vide 
      next:(val) => console.log("log type Observer A de subjectAsObserver$ : ",val),
      error:(error) => console.log(error),
      complete:() => console.log("observable complété ")
    }
    const observerB$: Observer<number> ={
      next:(val) => console.log("log type Observer B de subjectAsObserver$: ",val),
      error:(error) => console.log(error),
      complete:() => console.log("Oservable complété")
    }
    subjectAsObserver$.subscribe(observerA$);
    subjectAsObserver$.subscribe(observerB$);

    const intervalSubjObserver$ = interval$.pipe(
      take(10),
      tap(val => console.log("subject en tant qu'Observer avec l implémentation des deux type Observer, Observer A et Observer B ", val))
    ).subscribe(subjectAsObserver$)
    //subject en tant qu'Observer avec l implmentation des deux type Observer dejà crée pour chaque Observable, ici avec Subject en tant qu observer, 
    //l Observable aura 2 observer ui ecoutent l Observable de par le Subject
  }
  
  //on execute du code au moment de la destruction du component, ici  l emission du Subject
  //c est le router ici qui insere le component dans l application(<router-outlet>)  et qui detruit le FaceSnapListComponent, lorsqu il change de route sur la route d un autre component 
  ngOnDestroy(): void {
    this.subjectDestroy$.next("component detruit")
    // Le Subject emet et complete avec une seule emission, ici souscrire au subject n est pas utile pour manipuler l emission, le but est de le faire emettre n importe qu elle valeur et takeUntil () lors de l emission dit a angular de stopper les emissions de l Observerble interval
  }
}
