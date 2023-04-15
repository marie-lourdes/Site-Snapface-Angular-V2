import { Component, OnInit } from '@angular/core';

//import de l objet  Observable de la librairie rxjs pour la programmation reactive(avec les evenements et les valeurs des observables  qu on peut observer en temps réel) et permet de composer du code asynchrone
//les observables deviennent des flux de données avec suscribe qui permet de manipuler les valeur emise de l observable 
//import de la methode interval qui genere un Observable qui emet des nombres croissant avec un interval de 1000ms
import { interval, Observable } from 'rxjs';
import { filter, map } from "rxjs/operators"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  intervalDom$!: Observable<number>; //propriété de la class, de type objet Observable, et les emissions de type  number entre chevrons
  intervalFilter$!: Observable<number>;
  intervalMapNumber$!: Observable<number>;
  intervalMapPairImpair$!: Observable<string>;
  intervalMapPairImpair2$!: Observable<string>;
  ngOnInit() {
    const interval$ = interval(1000) // variable local de la fonction ngOnInit()
    //propriété de la class, l Observable est souscrit au bout de 6s avec le pipe async et qui  insere et affiche les emissions dans le DOM a partir  le template de AppComponent
    setTimeout(() => this.intervalDom$ = interval$, 6000 )

    /* interval() genere un Observable, la norme veut que lon ajoute un $ a la variable qui stocke un Observable
    // la fonction callBack  de subscribe()est nommé next() par convention, ici elle est anonyme
    //subscribe(next(value), err(), complete())
    // la collection de callbacks dans subscribe() s appelle un Observer
    
    // ** POUR UNE SEULE INSTANCE de l Observable interval$ avec une seule suscription**
    const interval$ = interval(1000).subscribe( value => console.log(value));*/
    

    // **POUR DEUX INSTANCES de l Observable interval$ avec deux souscription**

    // -une première souscription qui cree une instance de l Observable interval$  qui emet les nombres croissants tous les 1 secondes
    // methode subscribe () souscrit à l obsevable a partir du typescript et les emissions affiché dans le typescript
    interval$.subscribe(value => console.log(value))

    // -une deuxieme souscription qui crée une deuxieme instance de l Observable interval$ qui emet les nombres croissants tous les 1 seconde
    //mais l emissions des valeurs des nombres croissants demarre aapres 3 secondes
    //souscription à l interval au bout de 3 secondes
    setTimeout(() => interval$.subscribe(value => console.log(value)), 3000);
    /*         ou
    setTimeout (() => {
      interval$.subscribe(value => console.log(value));
    }, 3000)*/

    console.log(interval$) /* affiche l objet Observable et sa methode subscribe, et quand on souscrit, n affiche plus l objet Observable mais affiche la class SafeSubscriber,
    les constructors et la collection de callbacks "partials Observer" de subscribe(next(value), err(), complete())*/
    
    /** tous les 5s l observable emet les nombres croissants, si on veut emmetre les valeur par cing on filtre les emissions avec le modulo % , 
      -si c est divisible par cinq et que le reste est 0 et on garde ses nombre divisible dans les emissions**/
    const interval2$ = interval(5000);
    interval2$.subscribe( val => console.log(val))

    /**tous les 100millisencondes l interval emet les nombres croissants et l'operator ( introduit par la methode pipe())filter() traite que les emissions divisible par 5
     -la souscription est faite avec async dans le template, seuls les nombres divisibles par 5 apparaissant avec l operateur de bas niveau filter
     -les operateurs de bas niveau tel que map() et filter() agissent directement sur les emissions de l Observable**/
    this.intervalFilter$ = interval(100).pipe(
      filter( value => value % 5 === 0 ), 
    ); 
    
    // Tranformez les emissions de l Observable original interval$ en multipliant ses emission par 10: 
    //operateur map() branché à l Observable deja existant interval$ et renvoit un nouvel observable ( l observable global) interbalMapNumber$
    this.intervalMapNumber$ = interval$.pipe(
      map( value => value * 10)
    )

     // Tranformez les emissions de l Observable original interval$ en transformant ses emissions en string avec un condition qui trie les nombre pair et impairs dans la chaine de caractere avec le modulo % 20 ( nombre  augmente par dizaine): 
     //operateur map() branché à l Observable deja existant interval$ et renvoit un nouvel observable ( l observable global) interbalMapPairImpair$
     this.intervalMapPairImpair$ = interval$.pipe(
      map( value => value * 10),
      map(value => value % 20 === 0 
        ? ` Ce nombre ${value} est pair`
        : `Ce nombre ${value} est impair`) 
        //le deuxieme map tarnsforme l emission en string, bien que l Observable original sur lequel il est basé emet des nombre 
        //ce sera l emission final transformé en string qui definit le type de l observable globale qui est le nouvel observable (intervalMapPairImpair$) renvoyé par les opérateurs
    )

     // Tranformez les emissions de l Observable original interval$ en transformant ses emissions en string avec un condition qui trie les nombre pair et impairs dans la chaine de caractere avec le modulo % 2: 
     //operateur map() branché à l Observable deja existant interval$ et renvoit un nouvel observable ( l observable global) interbalMapPairImpair$
     this.intervalMapPairImpair2$ = interval$.pipe(
      map(value => value % 2 === 0 
        ? ` Ce nombre ${value} est pair`
        : `Ce nombre ${value} est impair`) 
        //le deuxieme map tarnsforme l emission en string, bien que l Observable original sur lequel il est basé emet des nombre 
        //ce sera l emission final transformé en string qui definit le type de l observable globale qui est le nouvel observable (intervalMapPairImpair$) renvoyé par les opérateurs
    )
  }  
}
