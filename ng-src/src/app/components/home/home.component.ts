import { Observable, of, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { catchError, takeUntil, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  passwordText: string;
  emailText: string;

  destroyed$: Subject<null> = new Subject();
  user$: Observable<firebase.User> = this.authService.user$;
  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  ngOnInit(): void {
  }

  login(){
    this.authService.login().pipe(
      catchError((error) => of(null)),
      filter((res) => res),
      takeUntil(this.destroyed$)
    )
    .subscribe(
      (authState) => {
        this.router.navigate(['room']);
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

}
