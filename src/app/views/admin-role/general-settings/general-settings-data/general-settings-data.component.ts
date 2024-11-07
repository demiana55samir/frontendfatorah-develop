import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-general-settings-data',
  templateUrl: './general-settings-data.component.html',
  styleUrls: ['./general-settings-data.component.scss']
})
export class GeneralSettingsDataComponent implements OnInit {
  GeneralSettingsForm!:FormGroup
  private subs=new Subscription()
  generalSettings:any
  language:any
  constructor(private fb:FormBuilder,private http:HttpService,private changeLang:ChangeLanguageService,private toastr:ToastrService) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.GeneralSettingsForm=this.fb.group({
      site_name:this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      // site_name_en:[''],
      // site_name:[''],
      keywords: this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      description:this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      sms_activation: this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      webiste_name: this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      facebook: this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      whatsapp: this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),
      twitter: this.fb.group({
        ar: [''], // initial value for Arabic
        en: ['']  // initial value for English
      }),

    })

    this.getGenaralSettings()
  }

  getGenaralSettings(){
    this.subs.add(this.http.getReq('api/admin/settings/general').subscribe({
      next:res=>{
        this.GeneralSettingsForm.get('site_name')?.setValue({
          ar: res.data[0].value.ar,
          en: res.data[0].value.en
        });

        this.GeneralSettingsForm.get('keywords')?.setValue({
          ar: res.data[1].value.ar,
          en: res.data[1].value.en
        });

        this.GeneralSettingsForm.get('description')?.setValue({
          ar: res.data[2].value.ar,
          en: res.data[2].value.en
        });

        this.GeneralSettingsForm.get('sms_activation')?.setValue({
          ar: res.data[3].value.ar,
          en: res.data[3].value.en
        });

        this.GeneralSettingsForm.get('webiste_name')?.setValue({
          ar: res.data[5].value.ar,
          en: res.data[5].value.en
        });
        this.GeneralSettingsForm.get('facebook')?.setValue({
          ar: res.data[6].value.ar,
          en: res.data[6].value.en
        });
        this.GeneralSettingsForm.get('whatsapp')?.setValue({
          ar: res.data[7].value.ar,
          en: res.data[7].value.en
        });
        this.GeneralSettingsForm.get('twitter')?.setValue({
          ar: res.data[8].value.ar,
          en: res.data[8].value.en
        });
        // this.GeneralSettingsForm.controls['site_name.ar']?.setValue(res.data[0].value)
        // this.GeneralSettingsForm.controls['site_name.en']?.setValue(res.data[0].value)

        // this.GeneralSettingsForm.controls['keywords.ar']?.setValue(res.data[1].value)
        // this.GeneralSettingsForm.controls['keywords.en']?.setValue(res.data[1].value)

        // this.GeneralSettingsForm.controls['description.ar']?.setValue(res.data[2].value)
        // this.GeneralSettingsForm.controls['description.en']?.setValue(res.data[2].value)

        // this.GeneralSettingsForm.controls['sms_activation.ar']?.setValue(res.data[3].value)
        // this.GeneralSettingsForm.controls['sms_activation.en']?.setValue(res.data[3].value)

        // this.GeneralSettingsForm.controls['webiste_name'].setValue(res.data[5].value.ar)
        // this.GeneralSettingsForm.controls['facebook'].setValue(res.data[6].value.ar)
        // this.GeneralSettingsForm.controls['whatsapp'].setValue(res.data[7].value.ar)
        // this.GeneralSettingsForm.controls['twitter'].setValue(res.data[8].value.ar)
        this.generalSettings=this.GeneralSettingsForm.value

      }
    }))
  }

  editGeneralSettings(){
    if(this.GeneralSettingsForm.valid){
      if(JSON.stringify(this.GeneralSettingsForm.value) != JSON.stringify(this.generalSettings)){
        // for (const key in this.GeneralSettingsForm.value) {
        //   if(['webiste_name','facebook','whatsapp','twitter'].includes(key)){
        //     const value = this.GeneralSettingsForm.value[ key ];
        //     if (value !== null && value !== undefined && value !== '') {
        //       this.GeneralSettingsForm.controls[ key ].setValue(
        //         {
        //           'en':value,
        //           'ar':value
        //         }
        //       )
        //     }
        //   }
          
        // }
        this.subs.add(this.http.putReq('api/admin/settings',this.GeneralSettingsForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            window.location.reload()
          },error:()=>{
            for (const key in this.GeneralSettingsForm.value) {
              const value = this.GeneralSettingsForm.value[ key ];
                if (value !== null && value !== undefined && value !== '') {
                  this.GeneralSettingsForm.controls[ key ].setValue(value.ar)
                }
            }
          }
        }))
      }
      else{
        if(this.language=='en'){
          this.toastr.error('please update Data first')
        }
        else{
          this.toastr.error('الرجاء تحديث البيانات أولاً')
        }
      }
    }else{
      this.GeneralSettingsForm.markAllAsTouched()
    }
  }

}
