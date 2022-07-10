import { LightningElement, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement {

    @api boat;
    @api selectedBoatId;

    selectBoat(){
        this.selectedBoatId = boat.Id;
        const searchEvent = new CustomEvent('boatselect', {
            detail: {
                boatId: this.selectedBoatId
            }
        });
        this.dispatchEvent(searchEvent);
    }

    get backgroundStyle() {
        return "background-image:url(${this.boat.Picture__c})";
    }

    get tileClass() {
        return this.selectedBoatId == this.boat.Id ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS; 
    }
}