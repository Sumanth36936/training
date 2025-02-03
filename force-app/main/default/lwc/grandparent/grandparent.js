import { LightningElement, track } from 'lwc';
 
export default class GrandParent extends LightningElement {
    @track selectedCount = 0;
 
    handleChildSelection(event) {
        this.selectedCount = event.detail.selectedCount;
    }
 
    resetAll() {
        const parentComponent = this.template.querySelector('c-parent');
        if (parentComponent) {
            parentComponent.reset();
        }
    }
}
 
 