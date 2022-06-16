import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, take } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unsetUser } from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      if(fuser){
        this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().pipe(take(1)).subscribe(fireStoreUser=>{
          const user = User.fromFirebase(fireStoreUser);
          this.store.dispatch(setUser({user}))
        })
      }else{
        this.store.dispatch(unsetUser())
      }
      
    })
  }

  register(nombre: string, email: string, password: string){

    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({user})=>{
        const newUser = new User(user?.uid, nombre, user?.email ?? '' );
       return this.firestore.doc(`${user?.uid}/usuario`)
          .set({...newUser});
      });
  }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map(fuser => fuser !=null)
    );
  }
}
