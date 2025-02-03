/*import { LightningElement, wire, api } from 'lwc';
import getRelatedOpportunities from '@salesforce/apex/AccRelOpp.getRelatedOpportunities';
import { NavigationMixin } from 'lightning/navigation';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Import stage picklist values (you'll need to create this Apex method)
import getStageOptions from '@salesforce/apex/AccRelOpp.getStageOptions';

export default class AccRelatedOpp extends NavigationMixin(LightningElement) {
    @api recordId;
    opportunities;
    error;
    isModalOpen = false;
    stageOptions = [];
    selectedOpportunityId;

    columns = [
        { 
            label: 'Opportunity Name', 
            fieldName: 'nameUrl',
            type: 'url',
            typeAttributes: {
                label: { fieldName: 'Name' },
                target: '_blank'
            }
        },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
        { 
            label: 'Amount', 
            fieldName: 'Amount', 
            type: 'currency',
            typeAttributes: { currencyCode: 'USD' }
        },
        { label: 'Stage', fieldName: 'StageName' },
        {
            label: 'Change Stage',
            type: 'button',
            typeAttributes: {
                label: 'Change Stage',
                name: 'changeStage',
                variant: 'brand'
            }
        }
    ];

    @wire(getStageOptions)
    wiredStageOptions({ error, data }) {
        if (data) {
            this.stageOptions = data.map(stage => ({
                label: stage,
                value: stage
            }));
        } else if (error) {
            console.error('Error loading stage options:', error);
        }
    }

    @wire(getRelatedOpportunities, { accountId: '$recordId' })
    wiredOpportunities({ data, error }) {
        if (data) {
            this.opportunities = data.map(opp => ({
                ...opp,
                nameUrl: `/${opp.Id}`
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
            this.opportunities = undefined;
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        
        if (actionName === 'changeStage') {
            this.selectedOpportunityId = row.Id;
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleStageChange(event) {
        const selectedStage = event.detail.value;
        
        const fields = {
            Id: this.selectedOpportunityId,
            StageName: selectedStage
        };

        updateRecord({ fields })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Opportunity stage updated',
                        variant: 'success'
                    })
                );
                this.isModalOpen = false;
                // Refresh the data
                return getRelatedOpportunities({ accountId: this.recordId });
            })
            .then(result => {
                this.opportunities = result.map(opp => ({
                    ...opp,
                    nameUrl: `/${opp.Id}`
                }));
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}*/
/*
 ******************************************************************************************
 * @Name of the LWC    :  test.js
 * @ Description       :  Used to insert a new record by selecting particular recordtype
 * @ Author            :  Sai Suhas
 * @ Created Date      :  28-01-2024
 ******************************************************************************************
 * @ Last Modified By         :  Sai Suhas
 * @ Last Modified On         :  29-01-2024
 * @ Modification Description : Added extra functionality
 ******************************************************************************************
 */
 

import { LightningElement, wire, api } from 'lwc';
import getRelatedOpportunities from '@salesforce/apex/OpportunityNavigation.getRelatedOpportunities';
import { NavigationMixin } from 'lightning/navigation';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getStageOptions from '@salesforce/apex/OpportunityNavigation.getStageOptions';
import { refreshApex } from '@salesforce/apex';
 
export default class AccRelatedOpp extends NavigationMixin(LightningElement) {
    @api recordId;
    opportunities;
    error;
    showModal = false;
    showConfirmationModal = false;
    stageOptions = [];
    selectedStage;
    selectedRows = [];
 
    columns = [
        {
            label: 'Opportunity Name',
            fieldName: 'Name',
            type: 'button',
            typeAttributes: {
                label: { fieldName: 'Name' },
                name: 'navigate',
                variant: 'base'
            }
        },
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
        {
            label: 'Amount',
            fieldName: 'Amount',
            type: 'currency',
            typeAttributes: { currencyCode: 'USD' }
        },
        { label: 'Stage', fieldName: 'StageName', type: 'text' }
    ];
 
    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows;
    }
 
 
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
 
        if (actionName === 'navigate') {
            this[NavigationMixin.GenerateUrl]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.Id,
                    objectApiName: 'Opportunity',
                    actionName: 'view'
                }
            }).then((url) => {
                window.open(url, '_blank');
            });
        }
    }
 
    handleUpdateStage() {
        if (this.selectedRows.length > 0) {
            this.showModal = true;
        }
    }
 
   
    handleStageChange(event) {
        this.selectedStage = event.detail.value;
    }
 
    showConfirmDialog() {
        if (this.selectedStage) {
            this.showModal = false;
            this.showConfirmationModal = true;
        }
    }
 
    //2nd model
 
    closeConfirmationModal() {
        this.showConfirmationModal = false;
        this.selectedStage = undefined;
        this.selectedRows = [];
    }
 
   
    closeModal() {
        this.showModal = false;
        this.selectedStage = undefined;
    }
 
 
    get selectedOpportunitiesCount() {
        return this.selectedRows.length;
    }
 
    get isUpdateButtonDisabled() {
        return this.selectedRows.length === 0;
    }
 
    get isNextButtonDisabled() {
        return !this.selectedStage;
    }
 
   /* @wire(getStageOptions)
    wiredStageOptions({ error, data }) {
        if (data) {
            this.stageOptions = data.map(stage => ({
                label: stage,
                value: stage
            }));
        } else if (error) {
            console.error('Error loading stage options:', error);
        }
    }
 
        @wire(getRelatedOpportunities, { accountId: '$recordId' })
        wiredOpportunities(result) {
            this.wiredOpportunitiesResult = result; // Store the wire result
            const { data, error } = result;
            if (data) {
                this.opportunities = data;
                this.error = undefined;
            } else if (error) {
                this.error = error.body.message;
                this.opportunities = undefined;
            }
        }*/
        connectedCallback() {
            this.fetchOpportunities();
            this.fetchStageOptions();
        }

        fetchOpportunities() {
            getRelatedOpportunities({ accountId: this.recordId })
                .then((data) => {
                    this.opportunities = data;
                    this.error = undefined;
                })
                .catch((error) => {
                    this.error = error;
                    this.opportunities = [];
                });
        }

        fetchStageOptions() {
            getStageOptions()
                .then((data) => {
                    this.stageOptions = data.map((stage) => ({
                        label: stage,
                        value: stage,
                    }));
                })
                .catch((error) => {
                    console.error('Error loading stage options:', error);
                });
        }
 
 
    applyStageUpdate() {
        const updates = this.selectedRows.map(row => ({
            fields: {
                Id: row.Id,
                StageName: this.selectedStage
            }
        }));
   
        Promise.all(updates.map(update => updateRecord(update)))
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: `Updated ${updates.length} opportunities`,
                        variant: 'success'
                    })
                );
                this.showConfirmationModal = false;
                this.selectedStage = undefined;
                this.selectedRows = [];
   
                // Use refreshApex to update the UI table
                return refreshApex(this.wiredOpportunitiesResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
 
}
 