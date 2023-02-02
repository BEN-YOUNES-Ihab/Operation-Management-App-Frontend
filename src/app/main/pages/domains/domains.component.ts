import { Component, OnInit ,ViewEncapsulation, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomainService } from '../domains/services/domain.service';
import { Domain} from '../domains/models/domain.model'
import { Contractor } from './models/contractor.model';
import { ContractorService } from './services/contractor.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { French } from "flatpickr/dist/l10n/fr.js"
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { User } from 'app/main/admin/users/models/user.model';
import { UserService } from 'app/main/admin/users/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DomainsComponent implements OnInit {
 
  public tableRows: any;
  public ColumnMode = ColumnMode;
  public basicSelectedOption: number = 10;
  public error: string = "";
  public domainSubmitted = false;
  public contractorSubmitted = false;
  public basicDateOptions: FlatpickrOptions = {
    altInput: true,
    "locale": French,
  }
  public showAdd !: boolean;
  public showUpdate !: boolean;

  public domainLength :number = 1;
  public domainsList : Domain[];
  public selectedDomain: Domain;

  public contractorsList : Contractor[];
  public selectedContractor: Contractor;
  public options: GlobalConfig;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private domainService: DomainService,
    private contractorService: ContractorService,
    private userService : UserService,
    private route: Router,
    private toastr: ToastrService
    ) {
    }

  ngOnInit() {
    this.resetForm();
    this.refreshDomainList();
    this.refreshContractorList();
  }
  ConfirmTextOpen(_id: string) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    })
    .then((result)=> {
      if (result.value) {
        this.onDelete(_id);
      }
    });
  }
  clickAddDomain(modalBasic){
    this.domainSubmitted = false;
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
    });
    this.resetForm();
    this.showAdd = true;
    this.showUpdate = false;
  }

  clickAddContractor(modalBasic){
    this.error = "";
    this.contractorSubmitted = false;
    this.modalService.open(modalBasic, {
      windowClass: 'modal',
      centered: true,
      size: 'sm'
    });
    this.resetContractorForm();
  }
  sucessToastr(message,title) {
    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-left',
      toastClass: 'ngx-toastr myToast',
      closeButton: true
    });
  }
  errorToastr(message,title) {
    this.toastr.error(message, title, {
      positionClass: 'toast-bottom-left',
      toastClass: 'ngx-toastr myToast',
      closeButton: true
    });
  }
  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.selectedDomain = {
      _id: "",
      name: "",
      contractor: null,
      expiration_date: Date.now(),
      price: 0
    }
  }
  resetContractorForm(form?: NgForm) {
    if (form)
      form.reset();
    this.selectedContractor = {
      _id: "",
      name: ""
    }
  }

  refreshDomainList() {
    this.domainService.getDomainList().subscribe((res) => {
      this.domainsList = res as Domain[];
      this.tableRows = res;
      this.domainLength = this.domainsList.length;
    }
    ,(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }
    }
    );
  }
  refreshContractorList() {
    this.contractorService.getContractorsList().subscribe((res) => {
      this.contractorsList = res as Contractor[];
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }
    });
  }
 

  onEdit(domain: Domain, modalBasic) {
    this.domainSubmitted = false;
    this.modalService.open(modalBasic, {
      windowClass: 'modal'
    });
    this.selectedDomain = domain;
    this.showAdd = false;
    this.showUpdate = true;
  }

  onDelete(_id: string) {
    this.domainService.deleteDomain(_id).subscribe((res) => {
      this.refreshDomainList();
      Swal.fire({
        icon: 'success',
        title: 'Supprimé!',
        text: "Le domaine a été supprimé.",
        customClass: {
          confirmButton: 'btn btn-success'
        }
      });
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: "Veuillez réessayer ultérieurement.",
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        });      }
    }
    );
  }
  postDomainDetails(form: NgForm){
    this.domainSubmitted = true;
    if(form.invalid){
      return;
    }
    this.domainService.postDomain(form.value).subscribe((res) => {
      this.resetForm(form);
      this.refreshDomainList();
      this.sucessToastr("Domaine ajouté avec succès","Bravo!");
      this.modalService.dismissAll();
      this.domainSubmitted = false;
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }else{
        this.errorToastr('Veuillez réessayer ultérieurement.','Erreur');
      }
    }
    );
  }
  updateDomainDetails(form: NgForm){
    this.domainSubmitted = true;
    if(form.invalid){
      return;
    }
    this.domainService.putDomain(form.value).subscribe((res) => {
      this.resetForm(form);
      this.refreshDomainList();
      this.sucessToastr('Domaine mis à jour avec succès','Bravo!');
      this.modalService.dismissAll();
      this.domainSubmitted = false;
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }else{
        this.errorToastr('Veuillez réessayer ultérieurement','Erreur');
      }
    }
    );
  }


  postContractorDetails(form: NgForm){
    this.contractorSubmitted = true;
    if(form.invalid){
      return;
    }
    for(let contractor of this.contractorsList){
      if(contractor.name == form.value.name){
        this.error = "Ce fournisseur existe déjà";
        return;
      }
    }
    this.contractorService.postContractor(form.value).subscribe((res) => {
      this.resetContractorForm(form);
      this.refreshContractorList();
      this.contractorSubmitted = false;
      this.sucessToastr("Fournisseur ajouté avec succès",'Bravo!')
      let ref = document.getElementById('cancel')
      ref?.click();
    },(err)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.userService.logout();
          this.route.navigate(['pages/authentication/login-v2']);
        }
      }else{
        this.error ="Erreur!! Veuillez réessayer";
      }
    }
    );
  }

  /**
   * Search (filter)
   *
   * @param event
   */
   filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    //filter our data
    const temp = this.domainsList.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.tableRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}



