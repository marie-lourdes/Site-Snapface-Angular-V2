import { Component, OnInit } from '@angular/core';

//import de l objet  Observable de la librairie rxjs pour la programmation reactive(avec les evenements et les valeurs des observables  qu on peut observer en temps réel) et permet de composer du code asynchrone
//les observables deviennent des flux de données avec suscribe qui permet de manipuler les valeur emise de l observable 
//import de la methode interval qui genere un Observable qui emet des nombres croissant avec un interval de 1000ms
import { interval, of } from 'rxjs';
import { filter, map, tap, mergeMap } from "rxjs/operators"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  // propriétés de la classe qui font office de compteur incrementés par la fonction appellé dans l 'operateur haut niveau mergeMap()
  redtrain = 0;
  yellowTrain = 0;
  
  ngOnInit() {

   const interval$= interval(500).pipe(
      map( value => value % 2 === 0 ? "rouge" : "jaune" ),//map() operateur bas niveau transforme les emissions number en string avec les couleurs, avec des couleurs en fonction des emision de nombre pairs et impairs
      mergeMap( color => this.getTrainObservable$(color))
      //mergeMap Operateur haut niveau souscrit à l Observable interieur generé par l operateur of de la methode getTrainObservable$ 
      //via le pipe passe l emission à l argument de la methode getTrainObservable$
      //l'Observable haut niveau souscrivant à l Observable interieur, emettra les valeur de l emission de l observable interieur

    ).subscribe((val) => console.log(val))//souscription à l observable haut niveau généré par la fonction interval()
   
  }
  getTrainObservable$(color: "rouge" |"jaune"){
    const isRedTrain = color ==="rouge";
    isRedTrain ? this.redtrain++ : this.yellowTrain++
    const trainIndex = isRedTrain ? this.redtrain : this.yellowTrain
    return of({color, trainIndex}) //operateur of() de creation d un observables avec les valeurs souhaites en argument et  emises un apres l autre lors de la souscription
  } 
}
