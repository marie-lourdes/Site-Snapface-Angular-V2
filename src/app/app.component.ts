import { Component, OnInit } from '@angular/core';

//import de l objet  Observable de la librairie rxjs pour la programmation reactive(avec les evenements et les valeurs des observables  qu on peut observer en temps réel) et permet de composer du code asynchrone
//les observables deviennent des flux de données avec suscribe qui permet de manipuler les valeur emise de l observable 
//import de la methode interval qui genere un Oservable qui emet des nombres croissant avec un interval de 1000ms
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    // interval() genere un Observable, la norme veut que lon ajoute un $ a la variable qui stocke un Observable
    const interval$ = interval(1000).subscribe( value => console.log(value) )
    // la fonction callBack est nommé next() par convention, ici elle est anonyme
    // la collection de callback dans subscribe() s appelle un Observer

    console.log(interval$) /* affiche l objet Observable et sa methode subscribe, et quand on souscrit, n affiche plus l objet Observable mais affiche la class SafeSubscriber,
    les constructors et la collection de callbacks "partials Observer" de subscribe(next(value), err(), complete())*/
  }
}
