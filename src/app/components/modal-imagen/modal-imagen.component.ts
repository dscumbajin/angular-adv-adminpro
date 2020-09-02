import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';


@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any;

  constructor(public modalImagenService: ModalImagenService, private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
      .then(img => {
        if (img) {
          Swal.fire({
            title: 'Imagen',
            text: 'Actualizada',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          this.modalImagenService.nuevaImagen.emit(img);
          this.cerrarModal();
        } else {
          Swal.fire({
            title: 'Error Formato',
            text: 'No se puedo subir la imagen',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.cerrarModal();
        }
      }).catch(err => {
        return false;
      });
  }

}
