import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Subject, takeUntil } from 'rxjs';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  public packages = ["Monthly", "Quarterly", "Yearly"]

  public importantList: string[] = [
    "toxic fat reduction",
    "Building Muscles",
    'Sugar Craving Body',
    'Fitness Freak'
  ]
  registerForm!: FormGroup
  userUpdate: any
  destroyvalue$ = new Subject<boolean>
  public isUpdateActive: boolean = false
 


  constructor(private formbuilder: FormBuilder, private serv: RegisterService, private toastServ: NgToastService, private activerouter: ActivatedRoute,
    private route: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGynBefore: [''],
      enquiryDate: [''],

    })

    this.registerForm.controls['height'].valueChanges.pipe(takeUntil(this.destroyvalue$)).subscribe((res: any) => {
      this.calculateBmi(res)
    })
    this.activerouter.params.subscribe((val: any) => {
      this.userUpdate = val['id']
      this.serv.getRegisteredUserId(this.userUpdate).pipe(takeUntil(this.destroyvalue$)).subscribe((result: any) => {
        this.isUpdateActive = true
        this.formUpdate(result)
      })
    })
  }


  submit() {


    this.serv.postRegistration(this.registerForm.value).pipe(takeUntil(this.destroyvalue$)).subscribe((result: any) => {
      this.toastServ.success({ detail: "Sucess", summary: "Enquiry Added", duration: 3000 })
      this.registerForm.reset()
    })


  }



  update() {

    this.serv.updateRegisterUser(this.registerForm.value, this.userUpdate).pipe(takeUntil(this.destroyvalue$)).subscribe((result: any) => {
      this.toastServ.success({ detail: "Sucess", summary: "Enquiry Updated", duration: 3000 })
      this.registerForm.reset()
      this.route.navigate(['list'])
    })
  }

  calculateBmi(heightvalue: number) {
    const weight = this.registerForm.value.height
    const height = heightvalue;
    const bmi = weight / (height * height)
    this.registerForm.controls['bmi'].patchValue(bmi);

    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue("UnderWeight")
        break;

      case (bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue("Normal")
        break;

      case (bmi >= 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("OverWeight")
        break;

      default:
        this.registerForm.controls['bmiResult'].patchValue("Obese")
        break;
    }
  }

  formUpdate(user: any) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      height: user.height,
      weight: user.weight,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGynBefore: user.haveGynBefore,
      enquiryDate: user.enquiryDate,
    })
  }
  ngOnDestroy(): void {
    this.destroyvalue$.next(true)
    this.destroyvalue$.complete()
  }



}
