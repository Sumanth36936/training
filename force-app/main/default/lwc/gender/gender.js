import { LightningElement } from 'lwc';

export default class GenderDropdown extends LightningElement {
    defaultGender = 'male';

    genderOptions = [
        { label: '-- Select Gender --', value: '' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer Not to Say', value: 'prefer_not_to_say' }
    ];

    handleGenderChange(event) {
        this.defaultGender = event.target.value;
        console.log('Selected Gender:', this.defaultGender);
    }
}
