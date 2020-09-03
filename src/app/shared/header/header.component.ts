import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {


  public usuario: Usuario;

  constructor( private usuarioService: UsuarioService, private router: Router) {
    this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioService.logout();
  }

  buscar(termino: string){
    if (termino.length === 0) {
      this.router.navigateByUrl(`/dashboard`);
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }

}
