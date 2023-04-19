import { Component, OnInit } from '@angular/core';

//import de l objet  Observable de la librairie rxjs pour la programmation reactive(avec les evenements et les valeurs des observables  qu on peut observer en temps réel) et permet de composer du code asynchrone
//les observables deviennent des flux de données avec suscribe qui permet de manipuler les valeur emise de l observable 
//import de la methode interval qui genere un Observable qui emet des nombres croissant avec un interval de 1000ms
import { interval, of } from 'rxjs';
import { map, tap, take, delay, mergeMap, exhaustMap, concatMap, switchMap } from "rxjs/operators";

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

    const lightObservable$ = interval(500).pipe(
      map(value => value % 2 === 0 ? 'rouge' : 'jaune'),
      take(10),
      // utilisation de la direction %c de l interface console pour le style de l affichage dans la console du navigateur
      //applique le style passé en parametre et sur le message de la console qui suit la directive et pas le texte avant
      tap(color => console.log(`La lumière s'allume en %c${color}`, `color:${this.translateColor(color)}`)),//map() operateur bas niveau transforme les emissions number en string avec les couleurs, avec des couleurs en fonction des emision de nombre pairs et impairs
      mergeMap(color => this.getTrainObservable$(color)),
      //-switchMap() va souscrire a l observable interieur  a chaque emissions de l observable exterieur 
      //mais si le precdent observable interieur n est pas complété ou en cours il annule la souscription et  il souscris l'observable suivant
      // si one ne limite pas le nombre d emissions( take(10)), switchMap() continue a souscrire au observable qui suit en annulant les souscription des precedent observable qui ne sont pas complété
      //avec le nombre d emission limité de l observable exterieur et le delay des observable interieur, à la 10eme emissions
      //donc à la derniere emission(10eme) , il souscrit à nouveau à l observable interieur qui complete et ne sera pas annulé car aucun autre observable interieur est generé car l observable exterieur n emet plus et l operateur haut niveau switchMap ne recupere plsu ses emissions pour transmettre a la fonction callback ((value)=>..)  
      //switchMap permet de recuperer l emission la plus recente

      //-mergeMap Operateur haut niveau souscrit à l Observable interieur generé par l operateur of de la methode getTrainObservable$ 
      //via le pipe passe l emission à l argument de la methode getTrainObservable$
      //l'Observable haut niveau souscrivant à l Observable interieur, emettra les valeur de l emission de l observable interieur quand on souscrit à l obervable exterieur (intervalDom$) avec pipe async dans le template
      tap(value => console.log(` Le train n° %c${value.trainIndex} de couleur ${value.color} est arrivé!`, 
      `color:${this.translateColor(value.color)};font-weight: 600`))
    ).subscribe(val=> console.log("log lightObservable",val));
  }

  getTrainObservable$(color: 'rouge' |'jaune'){
    const isRedTrain = color === 'rouge';
    isRedTrain ? this.redtrain++ : this.yellowTrain++;
    const trainIndex = isRedTrain ? this.redtrain : this.yellowTrain;
    console.log(` Le train n° %c${trainIndex} de couleur ${color} est appelé!`,`text-decoration: underline; color: ${this.translateColor(color)}`);
    //operateur of() de creation d un observable avec les valeurs(un objet ici) souhaites en argument et  emises en une seule sequence lors de la souscription
    return of({ color, trainIndex }).pipe(
      delay(isRedTrain ? 5000 : 6000) 
      //les emissions de l observable demarre apres 5 ou 6 s selon la couleur,
      /*mais a chaque fois of() cree un observable, et les emission demarre apres ce delay,
      s il s agissait du meme observable, les emission demarerai apres 5 ou 6s puis emetrait selon l interval qui lui est donné*/
    )
  }

  // creation de la methode qi traduit les couleur en valeur css en anglais pour appliquer au style du message de la console avec la directive %c
  translateColor(color: 'rouge' | 'jaune') {
    return color === 'rouge' ? 'red' : 'yellow';
  }
}
