import { LightningElement, wire } from 'lwc';
import BUSINESS_TEAM_IMAGE from '@salesforce/resourceUrl/businessTeamImage';
import getNationalityPicklistValues from '@salesforce/apex/BankPicklistController.getNationalityPicklistValues';
import getResidencePicklistValues from '@salesforce/apex/BankPicklistController.getResidencePicklistValues';
import getUKResidentPlanningPicklistValues from '@salesforce/apex/BankPicklistController.getUKResidentPlanningPicklistValues';
import getWorkCountryPicklistValues from '@salesforce/apex/BankPicklistController.getWorkCountryPicklistValues';
import saveBankRecord from '@salesforce/apex/BankPicklistController.saveBankRecord';

export default class BankAccountApplication extends LightningElement {
    businessTeamImage = BUSINESS_TEAM_IMAGE;
    
    nationality;
    residence;
    planningTo;
    workCountry;
    birthdate;
    
    nationalityOptions = [];
    residenceOptions = [];
    planningOptions = [];
    workingCountryOptions = [];

    @wire(getNationalityPicklistValues)
    wiredNationalityOptions({ error, data }) {
        if (data) {
            this.nationalityOptions = data;
        } else if (error) {
            console.error('Error fetching nationality options:', error);
        }
    }

    @wire(getResidencePicklistValues)
    wiredResidenceOptions({ error, data }) {
        if (data) {
            this.residenceOptions = data;
        } else if (error) {
            console.error('Error fetching residence options:', error);
        }
    }

    @wire(getUKResidentPlanningPicklistValues)
    wiredPlanningOptions({ error, data }) {
        if (data) {
            this.planningOptions = data;
        } else if (error) {
            console.error('Error fetching planning options:', error);
        }
    }

    @wire(getWorkCountryPicklistValues)
    wiredWorkingCountryOptions({ error, data }) {
        if (data) {
            this.workingCountryOptions = data;
        } else if (error) {
            console.error('Error fetching working country options:', error);
        }
    }

    handleNationalityChange(event) {
        this.nationality = event.detail.value;
        console.log('Nationality selected:', this.nationality);
    }
    
    handleResidenceChange(event) {
        this.residence = event.detail.value;
        console.log('Residence selected:', this.residence);
    }
    
    handlePlanningChange(event) {
        this.planningTo = event.detail.value;
        console.log('Planning to:', this.planningTo);
    }
    
    handleWorkCountryChange(event) {
        this.workCountry = event.detail.value;
        console.log('Work Country selected:', this.workCountry);
    }
    
    handleBirthdateChange(event) {
        this.birthdate = event.detail.value;
        console.log('Birthdate selected:', this.birthdate);
    }

    handleCheck() {
        const allFieldsValid = [...this.template.querySelectorAll('lightning-combobox, lightning-input')]
            .reduce((validSoFar, field) => {
                return validSoFar && field.reportValidity();
            }, true);


        if (allFieldsValid) {
            saveBankRecord({ 
                nationality: this.nationality,
                residence: this.residence,
                ukResidentPlanning: this.planningTo,
                workCountry: this.workCountry,
                dateOfBirth: this.birthdate
            })
            .then(result => {
                console.log('Record saved successfully');
                // Add success toast message or navigation logic here
            })
            .catch(error => {
                console.error('Error saving record:', error);
                // Add error handling here
            });
        }
    }
}