import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';
import { CargarHospital } from '../interfaces/cargar-hospitales.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) {

  }


  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  cargarHospitales() {
    const url = `${base_url}/hospitales`;
    return this.http.get(url, this.headers)
    .pipe(
     map( (resp: { ok: boolean, hospitales: Hospital[]}) => resp.hospitales)
    );
  }

  cargarHospitalesPag( desde: number = 0) {
    const url = `${base_url}/hospitales/todo/?desde=${desde}`;
    return this.http.get<CargarHospital>(url, this.headers)
    .pipe(
     map( resp => {
       const hospitales = resp.hospitales.map(
         hosp => new Hospital(hosp.nombre, hosp._id, hosp.img, hosp.usuario)
       );
       return {
         total: resp.total,
         hospitales
       };
     })
    );
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  // tslint:disable-next-line: variable-name
  actualizarHospital( _id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  // tslint:disable-next-line: variable-name
  borrarHospital( _id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    return this.http.delete(url, this.headers);
  }

}
