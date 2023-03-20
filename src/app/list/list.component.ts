import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { Subject, takeUntil } from 'rxjs';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  dataSource: any

  users: any
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  displayedColumns: string[] = ['id', 'firstName', 'email', 'mobile', 'bmi', 'bmiResult',
    'gender', 'package', 'enquiryDate', 'action'
  ];
  destroyvalue$ = new Subject<boolean>
  constructor(private serv: RegisterService, private route: Router, private confirm: NgConfirmService,
    private toast: NgToastService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.serv.getRegisterUser().pipe(takeUntil(this.destroyvalue$)).subscribe((result: any) => {
      this.users = result
      this.dataSource = new MatTableDataSource(this.users)
      this.dataSource.paginator = this.paginator,
        this.dataSource.sort = this.sort
    })
  }
  filter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id: any) {
    this.route.navigate(['update', id])
  }
  delete(id: any) {
    this.confirm.showConfirm("Are you Sure want to delete?", (

    ) => {
      this.serv.deleteRegistered(id).pipe(takeUntil(this.destroyvalue$)).subscribe((res: any) => {
        this.toast.success({ detail: 'sucess', summary: 'Deleted Sucessfully', duration: 3000 })
        this.getUsers()
      })
    },
      () => {

      })

  }
  ngOnDestroy(): void {
    this.destroyvalue$.next(true)
    this.destroyvalue$.complete()
  }

}
