import { LightningElement } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {

    isLoading = false;

    handleLoading() {
        // Displaying a spinner to signal that data is being loaded
        this.isLoading = true;
    }

    handleDoneLoading() {
        this.isLoading = false;
    }

    // Handles search boat event, comes from the boatSearchform -> CustomEvent('search')
    searchBoats(event) { 
        const boatTypeId = event.detail.boatTypeId;
        this.template.querySelector("c-boat-search-results").searchBoats(boatTypeId);
    }
  
    createNewBoat() { 
        this[NavigationMixin.Navigate]({
            type:'standard__objectPage',
            attributes:{
                objectApiName:'Boat__c',
                actionName:'new'
            },
        });
    }
}