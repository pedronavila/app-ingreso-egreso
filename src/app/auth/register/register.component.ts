import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router:Router,
    private store: Store<AppState>
    ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(ui=>{
      this.loading = ui.isLoading;
    })
  }

  crearUsuario(): void {
    if(this.registerForm.invalid) return;

    this.store.dispatch(isLoading())
    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })
    const {nombre, email, password} = this.registerForm.value;
    this.authService.register(nombre, email, password).then(credenciales=>{
      this.store.dispatch(stopLoading())
      this.router.navigate(['/'])
    })
    .catch(error=>{
      this.store.dispatch(stopLoading())
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      })
    });
  }

}
