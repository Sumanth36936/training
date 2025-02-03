/*
 ******************************************************************************************
 * @Name of the LWC    :  relatedopportunity.js
 * @ Description       :  Used to fetch opportunities.
 * @ Author            :  Sumanth
 * @ Created Date      :  31-01-2024
 ******************************************************************************************
 * @ Last Modified By         :  Sumanth
 * @ Last Modified On         :  31-01-2024
 * @ Modification Description : Added extra functionality
 ******************************************************************************************
 */
 import { LightningElement,  api,wire, track } from 'lwc';
 import getRelatedOpportunities from '@salesforce/apex/OpportunityNavigation.getRelatedOpportunities';
 // import { NavigationMixin } from 'lightning/navigation';
 import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
 import { updateRecord } from 'lightning/uiRecordApi';
 import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 import getStageOptions from '@salesforce/apex/OpportunityNavigation.getStageOptions';
 //import { refreshApex } from '@salesforce/apex';
  
 export default class AccRelatedOpp extends NavigationMixin(LightningElement) {
     @track accountId;
      // Accept accountId from the parent component
  
  
     @track opportunities;
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
  
     @wire(CurrentPageReference)
         getStateParameters(currentPageReference) {
             if (currentPageReference) {
                 this.accountId = currentPageReference.state.c__recordId;
 }
     }
  
     handleRowSelection(event) {
         this.selectedRows = event.detail.selectedRows;
     }

     handleRowActions(event) {
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

    // extractAccountIdFromUrl() {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     this.accountId = urlParams.get('c__recordId');
   
    //     if (this.accountId) {
    //         this.fetchOpportunities();
    //         this.fetchStageOptions();
    //     }
    // }
  
  
    
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
  
     connectedCallback() {
        this.fetchOpportunities();
        this.fetchStageOptions();
        // this.extractAccountIdFromUrl();
    }
  
    
      /*@wire(getStageOptions)
      wiredStageOptions({ error, data }) {
          if (data) {
              this.stageOptions = data.map(stage => ({
                  label: stage,
                  value: stage
              }));
          } else if (error) {
              console.error('Error loading stage options:', error);
          }
      }*/
  
     fetchOpportunities() {
         getRelatedOpportunities({ accountId: this.accountId})
             .then((data) => {
                 this.opportunities = data;
                 this.error = undefined;
             })
             .catch((error) => {
                 this.error = error;
                 this.opportunities = [];
             });
     }  
  
         /* @wire(getRelatedOpportunities, { accountId: '$accountId' })
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
            const dataTable = this.template.querySelector('lightning-datatable');
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
                         dataTable.selectedRows = [];
            
                         // Use refreshApex to update the UI table
                         //return refreshApex(this.wiredOpportunitiesResult);

                         this.opportunities = this.opportunities.map(opp => {
                            if (Id.includes(opp.Id)) {
                                return { ...opp, StageName: this.selectedStage };
                            }
                            return opp;
                        });
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