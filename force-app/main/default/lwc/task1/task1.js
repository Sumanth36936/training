import { LightningElement} from 'lwc';
 
export default class FormComponent extends LightningElement {
    firstName = '';
    lastName = '';
    email = '';
    phoneNumber = '';
 
    handleInputChange(event) {
        const fieldName = event.target.dataset.field;
        this[fieldName] = event.target.value;
    }
 
    connectedCallback() {
        console.log('Component Initialized');
    }
 
    renderedCallback() {
        console.log('Component Rendered');
    }
 
    handleSubmit() {
        console.log('Form Data');
        console.log('First Name:', this.firstName);
        console.log('Last Name:', this.lastName);
        console.log('Email:', this.email);
        console.log('Phone Number:', this.phoneNumber);
    }
}