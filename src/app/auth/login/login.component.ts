import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private store: Store<AppState>,
    ) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.uiSubscription = this.store.select('ui').subscribe(ui=>{
      this.loading = ui.isLoading;
    })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario(){
    if(this.loginForm.invalid) return;

    this.store.dispatch(isLoading())

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const {email, password} = this.loginForm.value;
    this.authService.login(email, password).then(credenciales=>{
      // Swal.close();
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
    })
  }
}
