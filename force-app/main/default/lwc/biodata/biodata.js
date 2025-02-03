import { LightningElement, track } from 'lwc';
import getPicklistFields from '@salesforce/apex/PersonalDetailsPicklistController.getPicklistFields';
import savePersonalDetails from '@salesforce/apex/PersonalDetailsPicklistController.savePersonalDetails';
 
export default class PersonalInformation extends LightningElement {
    @track formData = {
        title__c: '',
        First_Name__c: '',
        Surname__c: '',
        Middle_Name__c: '',
        former_name_or_maiden_name__c: '',
        other_name__c: '',
        Other_First_Name__c: '',
        gender__c: '',
        Date_of_Birth__c: '',
        marital_status__c: '',
        country_of_birth__c: '',
        town_city_of_birth__c: '',
        country_of_residence__c: '',
        primary_contact_of_nationality__c: '',
        secondary_country_of_nationality__c: '',
        identification_type__c: '',
        Identification_Number__c: ''
    };
 
    @track picklistValues = {
        title__c: [],
        former_name_or_maiden_name__c: [],
        other_name__c: [],
        gender__c: [],
        marital_status__c: [],
        country_of_birth__c: [],
        town_city_of_birth__c: [],
        country_of_residence__c: [],
        primary_contact_of_nationality__c: [],
        secondary_country_of_nationality__c: [],
        identification_type__c: []
    };
 
    connectedCallback() {
        this.fetchPicklistValues();
    }
 
    fetchPicklistValues() {
        getPicklistFields()
            .then((result) => {
                for (const [fieldName, values] of Object.entries(result)) {
                    if (this.picklistValues.hasOwnProperty(fieldName)) {
                        this.picklistValues[fieldName] = values.map((value) => ({
                            label: value,
                            value: value
                        }));
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching picklist values:', error);
            });
    }
 
    handleChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;
 
        if (field) {
               
            //newly added
            if (
                ['First_Name__c', 'Surname__c', 'Middle_Name__c', 'Other_First_Name__c'].includes(field) &&
                (!/^[a-zA-Z\s]*$/.test(value) || value.length > 250)
            ) {
                event.target.setCustomValidity(
                    value.length > 250
                        ? 'Text should not exceed 250 characters.'
                        : 'Please enter only letters.'
                );
            }
            /*if (
                ['First_Name__c', 'Surname__c', 'Middle_Name__c', 'Other_First_Name__c'].includes(field) &&
                !/^[a-zA-Z\s]*$/.test(value)
            ) {
                event.target.setCustomValidity('Please enter only letters.');
            } */
            // Validation for Identification Number
            else if (field === 'Identification_Number__c' && (!/^[a-zA-Z0-9]{15}$/.test(value))) {
                event.target.setCustomValidity('Identification Number must be exactly 15 alphanumeric characters.');
            }
            // Clear validity for valid values
            else {
                event.target.setCustomValidity('');
            }
   
            event.target.reportValidity(); //newly added
            this.formData = { ...this.formData, [field]: value };
        }
    }
 
    handleSubmit() {
        const inputs = [...this.template.querySelectorAll('input, select')];
    let isValid = inputs.reduce((validSoFar, input) => {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
        return validSoFar;
    }, true);
 
    if (isValid) {
        console.log('Form Data Submitted:', JSON.stringify(this.formData)); // Logging the form data
        savePersonalDetails({ formData: this.formData })
            .then((result) => {
                console.log('Record inserted successfully with Id:', result);
                this.clearForm();
                alert('Record saved successfully!');
            })
            .catch((error) => {
                console.error('Error saving record:', error);
                alert('Error saving record. Please try again.');
            });
    }
    }
 
    clearForm() {
 
        const fields = this.template.querySelectorAll('input, textarea, select');
 
    // Iterate through each field and reset its value
    fields.forEach((field) => {
        field.value = ''; // Clear the field's value (newly added)
    });
        /* this.formData = {
            title__c: '',
            First_Name__c: '',
            Surname__c: '',
            Middle_Name__c: '',
            former_name_or_maiden_name__c: '',
            other_name__c: '',
            Other_First_Name__c: '',
            gender__c: '',
            Date_of_Birth__c: '',
            marital_status__c: '',
            country_of_birth__c: '',
            town_city_of_birth__c: '',
            country_of_residence__c: '',
            primary_contact_of_nationality__c: '',
            secondary_country_of_nationality__c: '',
            identification_type__c: '',
            Identification_Number__c: ''
        }; */
    }
}