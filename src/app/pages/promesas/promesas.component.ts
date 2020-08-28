import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  users;

  constructor() { }

  ngOnInit(): void {
    this.getUsuarios().then( usuarios => {
      this.users = usuarios;
      console.log(this.users);
    });
  }

  getUsuarios() {

    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data));
    });
  }

}
