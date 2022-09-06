import { BaseActorSheet } from "./base-sheet.js";

export class CatsActorSheet extends BaseActorSheet {
    /**
   * Define default rendering options for the NPC sheet.
   * @returns {object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cats", "sheet", "actor", "character"]
    });
  }

  _updateSkills(name){
    switch (name) {
      case 'poil':
        break;
      case 'griffe':
        this.actor.data.skills["combatGriffu"].baseValue = Math.ceil((this.actor.data.abilities["griffe"].value + this.actor.data.abilities["oeil"].value) / 2);
        break;
      case 'oeil':
        this.actor.data.skills["combatGriffu"].baseValue = Math.ceil((this.actor.data.abilities["griffe"].value + this.actor.data.abilities["oeil"].value) / 2);
        break;
    }
  }
}