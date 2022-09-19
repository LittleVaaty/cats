import { BaseActorSheet } from "./base-sheet.js";

export class CatsActorSheet extends BaseActorSheet {
  /**
   * Define default rendering options for the NPC sheet.
   * @returns {object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cats", "sheet", "actor", "character"],
    });
  }

  _updateSkills(context) {
    this.#updateSkills(context, "chasse", "ronronnement", "vibrisse");
    this.#updateSkill(context, "cultureGeneral", "ronronnement");
    this.#updateSkills(context, "combatGriffu", "griffe", "oeil");
    this.#updateSkills(context, "connaisanceRue", "ronronnement", "cousinet");
    this.#updateSkill(context, "discretion", "queue");
    this.#updateSkills(context, "escalade", "queue", "griffe");
    this.#updateSkills(context, "enerverHumain", "ronronnement", "queue");
    this.#updateSkill(context, "langageHumain", "ronronnement");
    this.#updateSkill(context, "leadership", "caresse");
    this.#updateSkills(context, "odorat", "ronronnement", "vibrisse");
    this.#updateSkill(context, "orientation", "vibrisse");
    this.#updateSkills(context, "persuation", "caresse", "cousinet");
    this.#updateSkills(
      context,
      "psychologieHumaine",
      "ronronnement",
      "vibrisse"
    );
    this.#updateSkill(context, "reclamerManger", "caresse");
    this.#updateSkill(context, "reclamerCaresses", "cousinet");
    this.#updateSkill(context, "saut", "queue", "oeil");
    this.#updateSkill(context, "seduire", "cousinet");
    this.#updateSkills(context, "survie", "ronronnement", "vibrisse");
    this.#updateSkills(context, "repererTrouver", "caresse", "vibrisse");
    this.#updateSkill(context, "coutumesHumaine", "ronronnement");
    this.#updateSkill(context, "utiliserObjet", "oeil");
  }

  #updateSkill(context, skill, ability) {
    context.system.skills[skill].baseValue =
      context.system.abilities[ability].value;
  }

  #updateSkills(context, skill, ability1, ability2) {
    context.system.skills[skill].baseValue = Math.ceil(
      (context.system.abilities[ability1].value +
        context.system.abilities[ability2].value) /
        2
    );
  }
}
