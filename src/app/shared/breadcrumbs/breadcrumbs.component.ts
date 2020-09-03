import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  titulo: string;
  tituloSubs: Subscription;
  constructor(private router: Router) {

    this.tituloSubs = this.getArgumentosRuta()
                            .subscribe(data => {
                              // console.log(data);
                              this.titulo = data.titulo;
                              document.title = `AdminPro - ${this.titulo}`;
                            });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.tituloSubs.unsubscribe();
    document.title = `AdminPro`;
  }

  getArgumentosRuta() {
    return this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data),
      );
    // .subscribe( ({ titulo}) => { titulo

  }

}
