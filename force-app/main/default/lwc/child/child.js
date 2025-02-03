import { LightningElement, api, track } from 'lwc';
 
export default class Child extends LightningElement {
    @api name;
    @track status = ' Deselected';
 
    get buttonLabel() {
        return this.status === 'Deselected' ? 'Select' : 'Deselect';
    }
 
    get buttonVariant() {
        return this.status === 'Deselected' ? 'success' : 'destructive';
    }
 
    toggleStatus() {
        this.status = this.status === 'Deselected' ? 'Selected' : 'Deselected';
 
        this.dispatchEvent(new CustomEvent('statuschange', {
            detail: { name: this.name, status: this.status }
        }));
    }
 
    @api
    reset() {
        this.status = 'Deselected';
    }
}