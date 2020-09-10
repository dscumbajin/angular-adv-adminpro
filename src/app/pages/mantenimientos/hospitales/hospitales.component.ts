import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando = true;
  public imgSubs: Subscription;
  public desde = 0;
  public totalHospitales = 0;

  constructor(private hospitalService: HospitalService, private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarHospitalPag();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarHospital());
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.hospitales = this.hospitalesTemp;
    }
    this.busquedasService.buscar('hospitales', termino)
      .subscribe(resultados => {
        this.hospitales = resultados;
      });
  }

  cargarHospital() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {

        if (hospitales.length !== 0) {
           this.hospitales = hospitales;
           this.hospitalesTemp = hospitales;
        }
        this.cargando = false;
      });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire(
          'Actualizado',
          hospital.nombre,
          'success'
        );
      });
  }

  elimindarHospital(hospital: Hospital) {

    Swal.fire({
      title: '¿Borrar hospital?',
      text: `Esta a punto de borra al hospital: ${hospital.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.hospitalService.borrarHospital(hospital._id)
          .subscribe(resp => {
            Swal.fire(
              'Eliminado!',
              `El hospital: ${hospital.nombre} fue eliminado !!`,
              'success'
            );
            this.cargarHospital();
          });
      }
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    });
    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          this.hospitales.push(resp.hospital);
        });
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }


  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalHospitales) {
      this.desde -= valor;
    }
    this.cargarHospitalPag();
  }

  cargarHospitalPag() {
    this.cargando = true;
    this.hospitalService.cargarHospitalesPag(this.desde)
    .subscribe(({total, hospitales}) => {
      this.totalHospitales = total;
      if (hospitales.length !== 0) {
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      }
      this.cargando = false;
    });
  }


}
