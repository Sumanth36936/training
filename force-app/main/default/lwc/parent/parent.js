import { LightningElement, track, api } from 'lwc';
 
export default class Parent extends LightningElement {
    @track childOneStatus = ' Deselected ';
    @track childTwoStatus = ' Deselected ';
    @track childThreeStatus = ' Deselected ';
 
    get selectedCount() {
        return [this.childOneStatus, this.childTwoStatus, this.childThreeStatus].filter(status => status === 'Selected').length;
    }
 
    handleStatusChange(event) {
        const { name, status } = event.detail;
 
        if (name === 'Child One') this.childOneStatus = status;
        if (name === 'Child Two') this.childTwoStatus = status;
        if (name === 'Child Three') this.childThreeStatus = status;
 
        this.dispatchEvent(new CustomEvent('childselectionchange', {
            detail: { selectedCount: this.selectedCount }
        }));
    }
 
    @api
    reset() {
        this.childOneStatus = ' Deselected ';
        this.childTwoStatus = ' Deselected ';
        this.childThreeStatus = ' Deselected ';
 
        this.dispatchEvent(new CustomEvent('childselectionchange', {
            detail: { selectedCount: 0 }
        }));
 
        this.template.querySelectorAll('c-child').forEach(child => child.reset());
    }
}
 
 