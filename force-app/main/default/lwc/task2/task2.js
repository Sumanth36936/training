import { LightningElement, track } from 'lwc';
import createOrUpdateAccount from '@salesforce/apex/AccountController.createOrUpdateAccount';
 
export default class Task2 extends LightningElement {
    @track accountName = '';
    @track accountNumber = '';
    @track billingAddress = '';
    @track description = '';
 
    handleInputChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }
 
    handleSubmit() {
       
 
        createOrUpdateAccount({
            accountData: {
                Name: this.accountName,
                AccountNumber: this.accountNumber,
                BillingAddress: this.billingAddress,
                Description: this.description,
            },
        })
            .then((result) => {
                alert('Account saved successfully!');
                console.log('Result:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while saving the account.');
            });
    }
}