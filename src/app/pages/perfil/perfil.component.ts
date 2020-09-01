import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { FileUploadService } from '../../services/file-upload.service';
import { UsuarioService } from '../../services/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usurio: Usuario;
  public imagenSubir: File;
  public imgTemp: any;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) {
    this.usurio = usuarioService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usurio.nombre, Validators.required],
      email: [this.usurio.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil() {
    // console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe(() => {
        const { nombre, email } = this.perfilForm.value;
        this.usurio.nombre = nombre;
        this.usurio.email = email;
        Swal.fire({
          title: 'Actualizado!',
          text: 'Usuario actualizado',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }, (err) => {
        // console.log(err.error.msg);
        Swal.fire({
          title: 'Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }

  cambiarImagen(file: File) {
    // console.log(file);
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // console.log(reader.result);
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usurio.uid)
      .then(img => {
        this.usurio.img = img;
        //  console.log(`${img} inicio`);
        if (img) {
          Swal.fire({
            title: 'Imagen',
            text: 'Actualizada',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        } else {
          Swal.fire({
            title: 'Error Formato',
            text: 'No se puedo subir la imagen',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      }).catch(err => {
        return false;
      });
  }
}
