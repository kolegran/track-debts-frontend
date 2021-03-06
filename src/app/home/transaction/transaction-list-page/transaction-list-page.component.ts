import { Component, OnInit } from '@angular/core';
import {Transaction} from '../../../core/transaction';
import {HttpClient} from '@angular/common/http';
import {Page} from '../../../core/page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-transaction-list-page',
  templateUrl: './transaction-list-page.component.html',
  styleUrls: ['./transaction-list-page.component.scss']
})
export class TransactionListPageComponent implements OnInit {
  transactions?: Page<Transaction>;
  users: User[] = [];
  acceptMoneyForm: FormGroup;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => Object.assign({}, {page: 1}, params)),
        tap(params => params.page = params.page - 1),
        switchMap(params => this.http.get<Page<Transaction>>('/api/transactions?size=10&page=' + params.page))
      )
      .subscribe(np => this.transactions = np);

    this.http.get<User[]>('/api/users')
      .subscribe(users => this.users = users);

    this.acceptMoneyForm = this.fb.group({
      'senderId': ['', Validators.compose([Validators.required, Validators.min(1)])],
      'amount': ['', Validators.compose([Validators.required, Validators.min(1)])],
      'comment': ['', Validators.maxLength(200)]
    });
  }

  loadPage(page) {
    const path = this.route.snapshot.pathFromRoot
      .map(p => p.routeConfig ? p.routeConfig.path : '/')
      .filter(s => s);

    this.router.navigate(path, {queryParams: {page: page}});
  }

  acceptMoney() {
    // TODO: not strong typed
    this.http.post('/api/transactions', this.acceptMoneyForm.value)
      .subscribe(() => this.ngOnInit());
  }
}
