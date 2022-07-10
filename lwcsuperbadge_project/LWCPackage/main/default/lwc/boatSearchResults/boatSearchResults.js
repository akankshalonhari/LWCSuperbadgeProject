import { LightningElement, wire, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { updateRecord, getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoats from  '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from  '@salesforce/apex/BoatDataService.updateBoatList';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const CONST_ERROR = 'Error on saving the changes';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    columns = [
      { label: 'Name', fieldName: 'Name', type: 'text', editable: 'true'  },
      { label: 'Length', fieldName: 'Length__c', type: 'number', editable: 'true' },
      { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: 'true' },
      { label: 'Description', fieldName: 'Description__c', type: 'text', editable: 'true' }
    ];
    @api boatTypeId = '';
    boats;
    isLoading = false;
    draftValues = [];

    @wire(MessageContext)
    messageContext;

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(result) { 
      this.boats = result;
      if (result.error) {
        this.boats = undefined;
      }
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
    }

    @api
    searchBoats(boatTypeId) { 
      this.boatTypeId = boatTypeId;
      this.isLoading = true;
      this.notifyLoading(this.isLoading);
    }

    @api
    async refresh() {
      this.isLoading = true;
      this.notifyLoading(this.isLoading);
      await refreshApex(this.boats);
      this.isLoading = false;
      this.notifyLoading(this.isLoading);
     }

    updateSelectedTile(event) { 
       this.selectedBoatId = event.detail.boatId;
       this.sendMessageService(this.selectedBoatId);
    }

    sendMessageService(boatId) { 
      const payload = {recordId: boatId};
      publish(this.messageContext, BOATMC, payload);     // Publishes the selected boat Id on the BoatMC.
    }

    // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
      this.isLoading = true;
      this.notifyLoading(this.isLoading);
      const updatedFields = event.detail.draftValues;
      // Update the records via Apex
      updateBoatList({data: updatedFields})
      .then(result => {
        const successevent = new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT
        });
        this.dispatchEvent(successevent);
        this.draftValues = [];
        this.refresh();
      })
      .catch(error => {
        const errorevent = new ShowToastEvent({
          title: ERROR_TITLE,
          message: CONST_ERROR,
          variant: ERROR_VARIANT
        });
        this.dispatchEvent(errorevent);
      })
      .finally(() => {
        this.draftValues = [];
      });
    }

    notifyLoading(isLoading) { 
      if (isLoading) {
        const loadingEvent = new CustomEvent('loading');
        this.dispatchEvent(loadingEvent);
      } else {
        const doneLoadingEvent = new CustomEvent('doneloading');
        this.dispatchEvent(doneLoadingEvent);
      }
    }
}