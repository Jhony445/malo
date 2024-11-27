
/*
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidatorFn,AbstractControl,ValidationErrors } from '@angular/forms';

  onLogin(){
    debugger;
    this.http.post("https://malo-backend.onrender.com/api/auth/login", this.loginObj).subscribe((res:any)=>{
      debugger;
      if(res.result){
        alert("Login success")
      }else{
        alert("error en contrase;a o usuario")
      }
    })
  }

  function upperCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { upperCase: true };
  };
}
*/