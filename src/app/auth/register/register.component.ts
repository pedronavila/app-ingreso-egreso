import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  crearUsuario(): void {
    if(this.registerForm.invalid) return;
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    })
    const {nombre, email, password} = this.registerForm.value;
    this.authService.register(nombre, email, password).then(credenciales=>{
      Swal.close();
      this.router.navigate(['/'])
    })
    .catch(error=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    });
  }

}
