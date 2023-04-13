import { Component, OnInit } from '@angular/core';

//import de l objet  Observable de la librairie rxjs pour la programmation reactive(avec les evenements et les valeurs des observables  qu on peut observer en temps réel) et permet de composer du code asynchrone
//les observables deviennent des flux de données avec suscribe qui permet de manipuler les valeur emise de l observable 
//import de la methode interval qui genere un Observable qui emet des nombres croissant avec un interval de 1000ms
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  intervalDom$!: Observable<number>; //propriété de la class, de type objet Observable, et les emissions de type  number entre chevrons
 
  ngOnInit() {

    //propriété de la class, l Observable est souscrit au bout de 6s avec le pipe async et qui  insere et affiche les emissions dans le DOM a partir  le template de AppComponent
    setTimeout(() => this.intervalDom$ = interval(1000), 6000 )

    /* interval() genere un Observable, la norme veut que lon ajoute un $ a la variable qui stocke un Observable
    // la fonction callBack  de subscribe()est nommé next() par convention, ici elle est anonyme
    //subscribe(next(value), err(), complete())
    // la collection de callbacks dans subscribe() s appelle un Observer
    
    // ** POUR UNE SEULE INSTANCE de l Observable interval$ avec une seule suscription**
    const interval$ = interval(1000).subscribe( value => console.log(value));*/
    

    // **POUR DEUX INSTANCES de l Observable interval$ avec deux souscription**

    // -une première souscription qui cree une instance de l Observable  qui emet les nombres croissants tous les 1 secondes
    const interval$ = interval(1000) // variable local de la fonction ngOnInit()
    // methode subscribe () souscrit à l obsevable a partir du typescript et les emissions affiché dans le typescript
    interval$.subscribe(value => console.log(value))

    // -une deuxieme souscription qui crée une deuxieme instance de l Observable qui emt les nombres croissants tous les 1 seconde
    //mais l emissions des valeurs des nombres croissants demarre aapres 3 secondes
    //souscription à l interval au bout de 3 secondes
    setTimeout(() => interval$.subscribe(value => console.log(value)), 3000);
    /*         ou
    setTimeout (() => {
      interval$.subscribe(value => console.log(value));
    }, 3000)*/

    console.log(interval$) /* affiche l objet Observable et sa methode subscribe, et quand on souscrit, n affiche plus l objet Observable mais affiche la class SafeSubscriber,
    les constructors et la collection de callbacks "partials Observer" de subscribe(next(value), err(), complete())*/
    
  // tous les 5s l observable emet les nombres croissants, si on veut emmetre les valeur par cing on transforme les emissions avec le modulo % , 
  //si c est divisible par cinq et que le reste est 0 et on garde ses nombre divisible dans les emissions
    const interval2$ = interval(5000);
    interval2$.subscribe( val => console.log(val))
  }
  
}
