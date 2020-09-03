import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

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

  cargarMedicos() {
    const url = `${base_url}/medicos`;
    return this.http.get(url, this.headers)
    .pipe(
      map( (resp: { ok: boolean, medicos: Medico[]}) => resp.medicos)
    );
  }

  crearMedico(medico: {nombre: string, hospital: string}) {
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  // tslint:disable-next-line: variable-name
  actualizarMedico( medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  // tslint:disable-next-line: variable-name
  borrarMedico( medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    return this.http.delete(url, this.headers);
  }

  obtenerMedicoId(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this.http.get(url, this.headers)
    .pipe(
      map( (resp: { ok: boolean, medico: Medico}) => resp.medico)
    );
  }
}