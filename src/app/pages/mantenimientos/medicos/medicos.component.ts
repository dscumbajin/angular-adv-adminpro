import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import { Subscription } from 'rxjs';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy{

  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando = true;
  public imgSubs: Subscription;

  constructor(private medicoService: MedicoService, private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarMedicos());
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.medicos = this.medicosTemp;
    }
    this.busquedasService.buscar('medicos', termino)
      .subscribe(resultados => {
        this.medicos = resultados;
      });
  }


  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        if (medicos.length !== 0) {
          this.medicos = medicos;
          this.medicosTemp = medicos;
        }
        this.cargando = false;
      }
      );
  }


  elimindarMedico(medico: Medico) {

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borra al médico: ${medico.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico)
          .subscribe(resp => {
            Swal.fire(
              'Eliminado!',
              `El médico: ${medico.nombre} fue eliminado !!`,
              'success'
            );
            this.cargarMedicos();
          });
      }
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }


}
