import { EntitySheetHelper } from "../../helper.js";
import {ATTRIBUTE_TYPES} from "../../constants.js";
import {CATS} from "../../config.js";
import TalentConfig from "../../apps/talent-config.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BaseActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["cats", "sheet", "actor"],
      template: "systems/cats/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes"}],
      scrollY: [".attributes"],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData(options = {}) {
    let isOwner = this.actor.isOwner;
    const data = {
      owner: isOwner,
      limited: this.actor.limited,
      options: this.options,
      editable: this.isEditable,
      cssClass: isOwner ? "editable" : "locked",
      config: CATS,
      rollData: this.actor.getRollData.bind(this.actor)
    };

    // The Actor's data
    const actorData = this.actor.data.toObject(false);
    const source = this.actor.data._source.data;
    data.actor = actorData;
    data.data = actorData.data;
  
    for ( let [a, abl] of Object.entries(actorData.data.abilities)) {
      abl.isPhysique = abl.type === "physique";
      abl.isMental =  abl.type === "mental";
    }


    if (CATS.debug) console.log("CATS | ActorSheet getData", data);
    return data;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Attribute Management
    html.find(".attributes").on("click", ".attribute-control", EntitySheetHelper.onClickAttributeControl.bind(this));
    html.find(".groups").on("click", ".group-control", EntitySheetHelper.onClickAttributeGroupControl.bind(this));
    html.find(".attributes").on("click", "a.attribute-roll", EntitySheetHelper.onAttributeRoll.bind(this));

    // Item Controls
    html.find(".item-control").click(this._onItemControl.bind(this));
    html.find(".items .rollable").on("click", this._onItemRoll.bind(this));


    html.find(".add-talent").click(this._onAddTalent.bind(this));
    html.find(".remove-talent").click(this._onRemoveTalent.bind(this));

    // Add draggable for Macro creation
    html.find(".attributes a.attribute-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", ev => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }, false);
    });
  }

  /* -------------------------------------------- */

  /**
   * Handle click events for Item control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("CATS.ItemNew"), type: "item"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }

  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   */
  _onItemRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data('roll'), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }

  _onAddTalent(event) {
    event.preventDefault();
    const button = event.currentTarget;
    let app;
    app = new TalentConfig(this.object, null);
    app?.render(true);
 }
 _onRemoveTalent(event) {
  event.preventDefault();
  const talentIndex = event.currentTarget.getAttribute("data-talent");
  var talents = this.actor.data.data.talents;
  talents.splice(talentIndex, 1);
  this.object.update({"data.talents": talents});
 }
}
