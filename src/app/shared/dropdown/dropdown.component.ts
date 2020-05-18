import { Component, EventEmitter, HostBinding, Input, OnChanges, Output } from '@angular/core';
import { dropdownAnimations } from './dropdown.animations';

@Component({
   selector: 'app-dropdown',
   templateUrl: './dropdown.component.html',
   styleUrls: [ './dropdown.component.scss' ],
   animations: [ dropdownAnimations ],
})
export class DropdownComponent implements OnChanges {
   @HostBinding('class.open') isOpen = false;

   @Input() items: any[] = [];
   @Input() selectedId: number;
   @Output() itemSelected: EventEmitter<number> = new EventEmitter();
   public selectedLabel;

   ngOnChanges() {
      if (this.items.length) {
         this.selectedId = this.selectedId != null ? this.selectedId : this.items[ 0 ].id;
         this.selectedLabel = this.items.find(i => i.id === this.selectedId).label;
      }
   }

   onItemSelected(item) {
      if (this.selectedId !== item.id) {
         this.selectedId = item.id;
         this.selectedLabel = item.label;
         this.itemSelected.emit(item.id);
      }
      this.isOpen = false;
   }

   toggleOpen() {
      this.isOpen = !this.isOpen;
   }

}
