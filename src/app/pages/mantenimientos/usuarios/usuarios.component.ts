import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../../models/usuario.model'; import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { BusquedasService } from '../../../services/busquedas.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;
  public cargando = true;
  public imgSubs: Subscription;

  // tslint:disable-next-line: max-line-length
  constructor(private usuarioService: UsuarioService, private busquedasService: BusquedasService, private modalImagenService: ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        if (usuarios.length !== 0) {
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
        }
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedasService.buscar('usuarios', termino)
      .subscribe(resultados => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuario(usuario: Usuario) {

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire(
        'Error!',
        `No puede borrarse a si mismo!!`,
        'error'
      );
    }
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borra al usuario: ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {
            Swal.fire(
              'Eliminado!',
              `El usuario: ${usuario.nombre} fue eliminado !!`,
              'success'
            );
            this.cargarUsuarios();
          });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => console.log(resp));
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
