import { Component, OnInit } from '@angular/core';
import {throwError as observableThrowError,  Observable ,  Subject ,  BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users$: Observable<User[]>;
  usersID$: Observable<User[]>;
  private searchTerms = new Subject<string>();
  private searchTermsId = new Subject<number>();

  constructor(private http: HttpClient,) { }

  search(term: string): void {
    this.searchTerms.next(term);
  }
  searchid(term: number): void{
    this.searchTermsId.next(term);
  }

  ngOnInit(): void {
    this.users$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(100),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.searchHeroes(term)),
    );
    this.usersID$ = this.searchTermsId.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(100),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: number) => this.searchHeroesID(term)),
    );
  }

  
  searchHeroes(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users/?name=${term}`).pipe(
      catchError((error: any) => observableThrowError(error || 'Server error')));
  }

  searchHeroesID(term: number): Observable<User[]> {
    return this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users/?id=${term}`).pipe(
      catchError((error: any) => observableThrowError(error || 'Server error')));
  }
}
