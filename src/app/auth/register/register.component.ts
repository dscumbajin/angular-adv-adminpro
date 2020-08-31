import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;
  public registerForm = this.fb.group({
    nombre: ['Darwin Cumbajin', [Validators.required, Validators.minLength(3)]],
    email: ['test@hotmail.com', [Validators.required, Validators.email]],
    password: ['1234', [Validators.required, Validators.minLength(4)]],
    password2: ['1234', [Validators.required, Validators.minLength(4)]],
    terminos: [, [Validators.required]]
  }, {
    validators: [this.passwordsIguales('password', 'password2')]
  });

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;
   // console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      console.log('Formulario no valido');
      return;
    }
    // Realizar la creacion o posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        // Navegar al Dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        // Si sucede un error
        Swal.fire({
          title: 'Error!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }

  campoNoValidado(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasNoValidas(): boolean {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;
    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptarTerminos(): boolean {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passwordsIguales(pass1: string, pass2: string) {

    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);
      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
      // tslint:disable-next-line: semicolon
    }
    // tslint:disable-next-line: no-trailing-whitespace
  }

}
