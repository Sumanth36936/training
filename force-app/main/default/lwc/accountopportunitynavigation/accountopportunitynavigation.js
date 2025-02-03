/*
 ******************************************************************************************
 * @Name of the LWC    :  accountopportunitynavigation.js
 * @ Description       :  Used to fetch accounts.
 * @ Author            :  Sumanth
 * @ Created Date      :  30-01-2024
 ******************************************************************************************
 * @ Last Modified By         :  Sumanth
 * @ Last Modified On         :  31-01-2024
 * @ Modification Description : Added extra functionality
 ******************************************************************************************
 */
import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/opportunitynavigation.getAccounts';
import { NavigationMixin } from 'lightning/navigation';
 
const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Type', fieldName: 'Type', type: 'text' },
    {
        type: 'button',
        typeAttributes: {
            label: 'View Opportunities',
            name: 'view_opportunities',
            variant: 'brand',
            onclick: 'handleRowAction'
        }
    }
];
 
export default class AccountDatatable extends NavigationMixin(LightningElement) {
    @track accounts = [];
    columns = COLUMNS;
    @track opportunities;
    @track paginatedAccounts = []; // Current page of accounts
    error;
   
    // Pagination properties
    currentPage = 1;
    pageSize = 5; // Number of rows per page
    totalPages = 0;
    error;
 
    connectedCallback() {
        this.loadAccounts();
    }
 
    loadAccounts() {
        getAccounts()
            .then((data) => {
                this.accounts = data;
                this.error = undefined;
                this.calculatePagination();
            })
            .catch((error) => {
                this.error = error;
                this.accounts = [];
            });
    }
 
    calculatePagination() {
        this.totalPages = Math.ceil(this.accounts.length / this.pageSize);
        this.updatePaginatedAccounts();
    }
 
    // Update paginated accounts based on current page
    updatePaginatedAccounts() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedAccounts = this.accounts.slice(startIndex, endIndex);
    }
 
    // Navigation methods
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedAccounts();
        }
    }
 
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedAccounts();
        }
    }
 
    // Computed properties for button states
    get isFirstPage() {
        return this.currentPage === 1;
    }
 
    get isLastPage() {
        return this.currentPage === this.totalPages;
    }
 
 
    handleRowAction(event) {
        // Get row data and action details from the eve
       const row = event.detail.row;
        const action = event.detail.action;
 
        // Check if this is the view opportunities action
        if (action.name === 'view_opportunities') {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `/relatedopportunity?c__recordId=${row.Id}`
                }
            });
        }
            /*const accountId = event.currentTarget.dataset.id;
            this[NavigationMixin.Navigate]({
                type: 'standard__namedPage',
                attributes: {
                    pageName: 'relatedopportunity'  // page name
                },
                state: {
                    c__recordId: accountId
                }
            });*/
    }
}