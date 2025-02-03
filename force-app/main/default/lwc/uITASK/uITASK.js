import { LightningElement } from 'lwc';
import FONT_AWESOME from '@salesforce/resourceUrl/fontAwesome';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class Pricing extends LightningElement {
    pricingPlans = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            description: 'Explore the free version of Union UI.',
            buttonLabel: 'Coming Soon',
            buttonVariant: 'brand',
            features: [
                'Single user license',
                'Free lifetime updates',
                'Auto Layout',
                '1k+ components',
                '50+ global styles',
                '5 page examples',
                '250+ icons and logos',
                'Use on unlimited projects',
                'Desktop & Mobile Layouts',
                'Dark and Light Themes'
            ]
        },
        {
            id: 'solo',
            name: 'Solo',
            price: '$30',
            description: 'Best for solo designers, developers, and freelancers.',
            buttonLabel: 'Buy Now',
            buttonVariant: 'brand',
            features: [
                'Single user license',
                'Free lifetime updates',
                'Auto Layout',
                '5K+ components',
                '270+ global styles',
                '50+ page examples',
                '4K+ icons and logos',
                'Use on unlimited projects',
                'Desktop & Mobile Layouts',
                'Dark and Light Themes'
            ]
        }
    ];

    socialLinks = [
        { 
            platform: 'Dribbble', 
            url: '#', 
            iconClass: 'fab fa-dribbble'
        },
        { 
            platform: 'Behance', 
            url: '#', 
            iconClass: 'fab fa-behance'
        },
        { 
            platform: 'X (Twitter)', 
            url: '#', 
            iconClass: 'fab fa-twitter'
        }
    ];

    isModalOpen = false;

    connectedCallback() {
        loadStyle(this, FONT_AWESOME + '/css/all.min.css')
            .catch(error => {
                console.error('Error loading Font Awesome', error);
            });
    }

    handlePlanSelection(event) {
        const planId = event.currentTarget.dataset.planId;
        console.log(`Selected plan: ${planId}`);
        // Add your purchase or preview logic here
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    sendEmail(event) {
        event.preventDefault();
        window.location.href = 'mailto:info@maddesign.io';
    }
}