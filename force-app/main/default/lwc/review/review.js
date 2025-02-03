import { LightningElement,track } from 'lwc';
import Avatar from '@salesforce/resourceUrl/Avatar';
export default class Review extends LightningElement {
    // suresh js
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
    
        handleClick(event) {
            const card = event.target.closest('article');
            const planId = this.pricingPlans.find(plan => 
                card.querySelector('h2').textContent === plan.name
            )?.id;
            
        }
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
    
        openModal() {
            this.isModalOpen = true;
        }
    
        closeModal() {
            this.isModalOpen = false;
        }
    
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
    
    // get stars() {
    //     return Array(5).fill({ iconName: 'utility:favorite', altText: 'Star Icon', size: 'small' });
    // }

    get stars() {
        return Array.from({ length: 5 }, (_, index) => ({ id: index }));
    }
}