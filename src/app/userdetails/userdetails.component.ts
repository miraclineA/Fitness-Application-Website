import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.scss']
})
export class UserdetailsComponent implements OnInit,OnDestroy {

  constructor(private serv: RegisterService, private activeRoute: ActivatedRoute) { }


  card: any
  id: any
  destroyvalue$ = new Subject <boolean>
  ngOnInit(): void {
    this.activeRoute.paramMap.pipe(takeUntil(this.destroyvalue$)).subscribe(val => {
      this.card = val.get('id')
      this.serv.getRegisteredUserId(this.card).pipe(takeUntil(this.destroyvalue$)).subscribe(result => {
        this.card = result

      })
    })

  }
  ngOnDestroy(): void {
    this.destroyvalue$.next (true)
    this.destroyvalue$.complete()
  }

}
