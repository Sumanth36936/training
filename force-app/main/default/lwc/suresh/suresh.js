/*import { LightningElement, track } from 'lwc';

export default class BankApplication extends LightningElement {
    image =  Avatar;
            @track reviews = [
                {
                    id: '1',
                    name: 'Charolette Hanlin',
                    title: 'Product Designer, InnovateX',
                    comment: 'A game-changer UI Kit for UX/UI designers. Union UI is a must-try.',
                    avatar : this.image,
                    className: 'slds-media slds-media_center new'
                },
                {
                    id: '2',
                    name: 'Eleanor Pena',
                    title: 'Product Designer, Apex',
                    comment: "I've gained so much knowledge using Union UI, and now I recommend it to all the Junior Designers I mentor.",
                    avatar: this.image,
                    className: 'slds-media slds-media_center'
                },
                {
                    id: '3',
                    name: 'Guy Hawkins',
                    title: 'Founder, Quantum Creations',
                    comment: "Loving Union UI! It's been perfect for my ongoing project, covering every component required for the design.",
                    avatar: this.image,
                    className: 'slds-media slds-media_center'
                },
                {
                    id: '4',
                    name: 'Kristin Watson',
                    title: 'UI/UX Designer, Nexus Tech',
                    comment: 'Union UI is the best design system on Figma. Excited to dive into it again.',
                    avatar: this.image,
                    className: 'slds-media slds-media_center newcss'
                },
                {
                    id: '5',
                    name: 'Jane Cooper',
                    title: 'Co-Founder, Elevate',
                    comment: 'A key asset in my design journey, Union UI has streamlined defining elements and layouts in my projects.',
                    avatar: this.image,
                    className: 'slds-media slds-media_center'
                },
                {
                    id: '6',
                    name: 'Leslie Alexander',
                    title: 'UI Designer, Fusion Dynamics',
                    comment: 'Using Union UI has greatly improved my efficiency. It provides everything necessary for rapid iteration.',
                    avatar: this.image,
                    className: 'slds-media slds-media_center newcss'
                }
            ];
        /*handleMouseOver(event) {
            const box = event.currentTarget;
            box.style.transform = 'rotateY(10deg)';
            box.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            box.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
        }
    
        handleMouseOut(event) {
            const box = event.currentTarget;
            box.style.transform = 'none';
            box.style.boxShadow = 'none';
        }
        */
        
        import { LightningElement, api, wire } from 'lwc';
        import { NavigationMixin } from 'lightning/navigation';
        import getOpportunitiesByAccountId from '@salesforce/apex/OpportunityController.getOpportunitiesByAccountId';
        import { ShowToastEvent } from 'lightning/platformShowToastEvent';
        import updateOpportunityStages from '@salesforce/apex/OpportunityController.updateOpportunityStages';
        import getStageNamePicklistValues from '@salesforce/apex/OpportunityController.getStageNamePicklistValues';
        import { refreshApex } from '@salesforce/apex';
         
        export default class OppWithStageUpdate extends NavigationMixin(LightningElement) {
            @api recordId; // Account ID passed to the component
            opportunities = [];
            error;
            selectedOpportunities = new Set(); // To store selected opportunities
            showModal = false; // Controls the stage selection modal visibility
            showConfirmationModal = false; // Controls the confirmation modal visibility
            selectedStage = ''; // Stores the stage selected in the modal
            stageOptions = [];
            wiredOpportunitiesResult;
         
            @wire(getStageNamePicklistValues)
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
         
            @wire(getOpportunitiesByAccountId, { accountId: '$recordId' })
            wiredOpportunities(result) {
                this.wiredOpportunitiesResult = result;
                if (result.data) {
                    this.opportunities = result.data;
                    this.error = undefined;
                } else if (result.error) {
                    this.error = result.error;
                    this.opportunities = [];
                }
            }
         
            handleOpportunityClick(event) {
                const opportunityId = event.currentTarget.dataset.id;
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: opportunityId,
                        actionName: 'view',
                    },
                }).then((url) => {
                    window.open(url, '_blank');
                });
            }
         
            handleCheckboxChange(event) {
                const opportunityId = event.target.dataset.id;
                if (event.target.checked) {
                    this.selectedOpportunities.add(opportunityId);
                } else {
                    this.selectedOpportunities.delete(opportunityId);
                }
            }
         
            handleUpdateStage() {
                if (this.selectedOpportunities.size === 0) {
                    this.showToast('No Records Selected', 'Please select at least one opportunity to update.', 'warning');
                } else {
                    this.showModal = true; // Open the stage selection modal
                }
            }
         
            closeModal() {
                this.showModal = false;
                this.selectedStage = ''; // Reset the selected stage
            }
         
            closeConfirmationModal() {
                this.showConfirmationModal = false;
            }
            handleStageChange(event) {
                this.selectedStage = event.detail.value;
            }
         
            confirmStageUpdate() {
                if (!this.selectedStage) {
                    this.showToast('No Stage Selected', 'Please select a stage to apply.', 'warning');
                    return;
                }
           
                this.showModal = false;
                this.showConfirmationModal = true; // Open the confirmation modal
            }
         
            applyStageUpdate() {
                const selectedOpportunityIds = Array.from(this.selectedOpportunities);
           
                updateOpportunityStages({
                    opportunityIds: selectedOpportunityIds,
                    newStage: this.selectedStage,
                })
                    .then(() => {
                        this.showToast('Success', 'Opportunities updated successfully.', 'success');
                        this.showConfirmationModal = false; // Close the confirmation modal
                        this.selectedOpportunities.clear(); // Clear selected opportunities
                        this.selectedStage = ''; // Reset the selected stage
                        this.uncheckAllCheckboxes();
                        return refreshApex(this.wiredOpportunitiesResult); // Refresh opportunities
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        this.showToast('Error', 'Failed to update opportunities.', 'error');
                    });
            }
         
            uncheckAllCheckboxes() {
                const checkboxes = this.template.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });
            }
         
            showToast(title, message, variant) {
                this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
            }
        }