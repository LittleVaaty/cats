import { CATS } from "../config.js";

/**
 * Interface for managing a character's armor calculation.
 * @implements {DocumentSheet}
 */
 export default class TalentConfig extends DocumentSheet {

    constructor(actor, opts) {
      super(actor, opts);
      this._talens = actor.data.data.talents;
    }
  
    /** @override */
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["cats"],
        template: "systems/cats/templates/apps/talent-config.html",
        width: 500,
        height: "auto"
      });
    }
  
    /* -------------------------------------------- */
  
    /** @override */
    get title() {
      //return `${game.i18n.format("DND5E.AbilityConfigureTitle", {ability: CONFIG.DND5E.abilities[this._abilityId]})}: ${this.document.name}`;
      return "test";
    }
  
    /* -------------------------------------------- */
  
    /** @override */
    getData(options) {
      return {
        config: CATS,

      };
    }

      /** @inheritdoc */
  activateListeners(html) {
    html.find(".add-talent-item").click(this._onAddTalent.bind(this));
  }

  _onAddTalent(event) {
    this._talens.push(event.currentTarget.outerText);
  }

  /** @inheritdoc */
  async _updateObject(event, formData) {
    //const ac = foundry.utils.expandObject(formData).ac;
    return this.object.update({"data.talents": this._talens});
  }

  }
  