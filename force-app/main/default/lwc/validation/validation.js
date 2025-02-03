import { LightningElement } from 'lwc';

export default class SimpleForm extends LightningElement {
  formDetails = {};
  errors = {};

  validations = {
    fullName: (value) => (value.trim() !== '' ? true : 'Full Name is required'),
    userEmail: (value) =>
      (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Invalid Email Address'),
    userPhone: (value) =>
      (/^\d{10}$/.test(value.trim()) ? true : 'Phone Number must be a 10-digit number'),
    userRegistration: (value) =>
      (/^[a-zA-Z0-9]+$/.test(value.trim()) ? true : 'Registration ID must be alphanumeric'),
    userBio: (value) =>
      (value.trim().length >= 10 ? true : 'Bio must be at least 10 characters long'),
    gender: () => this.getCheckedValue('gender') !== null ? true : 'Gender is required',
    interests: () =>
      this.getCheckedValues('interests').length > 0 ? true : 'At least one interest must be selected',
  };

  handleInputChange(event) {
    const { name, value, type } = event.target;
  
    if (type === 'radio') {
      // Update the formDetails object with the selected value for radio buttons
      this.formDetails = { ...this.formDetails, [name]: value };
    } else if (type === 'checkbox') {
      // Handle checkbox group updates
      const checkedValues = this.getCheckedValues(name);
      this.formDetails = { ...this.formDetails, [name]: checkedValues };
    } else {
      // Handle other input types
      const fieldValue = value.trim();
      this.formDetails = { ...this.formDetails, [name]: fieldValue };
    }
  
    const validationFunction = this.validations[name];
    if (validationFunction) {
      const validationResult =
        name === 'gender' || name === 'interests'
          ? validationFunction()
          : validationFunction(this.formDetails[name]);
  
      this.errors = {
        ...this.errors,
        [name]: validationResult === true ? '' : validationResult,
      };
    }
  }
  
  getCheckedValue(groupName) {
    return [...this.template.querySelectorAll(`input[name="${groupName}"]`)].find(
      (input) => input.checked
    )?.value || null;
  }

  getCheckedValues(groupName) {
    return [...this.template.querySelectorAll(`input[name="${groupName}"]`)]
      .filter((input) => input.checked)
      .map((input) => input.value);
  }

  validateForm() {
    let isValid = true;

    Object.keys(this.validations).forEach((field) => {
      const validate = this.validations[field];
      const fieldValue =
        field === 'gender' || field === 'interests'
          ? validate()
          : this.template.querySelector(`[name="${field}"]`)?.value.trim() || '';

      const validationResult = field === 'gender' || field === 'interests'
        ? validate()
        : validate(fieldValue);

      this.errors = {
        ...this.errors,
        [field]: validationResult === true ? '' : validationResult,
      };

      if (validationResult !== true) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleSubmit() {
    if (this.validateForm()) {
      // Log the entire formDetails object, including gender and interests
      console.log('Form Submitted:', JSON.stringify(this.formDetails));
    } else {
      console.log('Form contains errors:', { ...this.errors });
    }
  }
  
}
