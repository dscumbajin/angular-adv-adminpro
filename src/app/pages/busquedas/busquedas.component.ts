import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: [
  ]
})
export class BusquedasComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];

  constructor( private activatedRoute: ActivatedRoute, private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe( ({termino}) => {
      // console.log(termino);
      this.busquedaGlobal(termino);
    } );
  }

  busquedaGlobal(termino: string ){
    this.busquedasService.busquedaGlobal(termino)
    .subscribe( (resp: any) => {
      // console.log(resp);
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;
    });
  }

}
