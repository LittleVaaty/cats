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
}