import { EntitySheetHelper } from "../../helper.js";
import { ATTRIBUTE_TYPES } from "../../constants.js";
import { CATS } from "../../config.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class BaseActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/cats/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-navigation", contentSelector: ".sheet-body", initial: "attributes" }],
      scrollY: [".attributes"],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
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

    for (let [a, abl] of Object.entries(actorData.data.abilities)) {
      abl.isPhysique = abl.type === "physique";
      abl.isMental = abl.type === "mental";
    }

    data.items = actorData.items;
    for (let i of data.items) {
      const item = this.actor.items.get(i._id);
      i.labels = item.labels;
    }
    data.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

    data.talents = data.items.filter(item => item.type === "talent");

    if (CATS.debug) console.log("CATS | ActorSheet getData", data);
    return data;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    const inputs = html.find("input");
    // Attribute Management
    html.find(".attributes").on("click", ".attribute-control", EntitySheetHelper.onClickAttributeControl.bind(this));
    html.find(".groups").on("click", ".group-control", EntitySheetHelper.onClickAttributeGroupControl.bind(this));
    html.find(".attributes").on("click", "a.attribute-roll", EntitySheetHelper.onAttributeRoll.bind(this));

    // Item Controls
    html.find(".item-control").click(this._onItemControl.bind(this));
    html.find(".items .rollable").on("click", this._onItemRoll.bind(this));


    // Add draggable for Macro creation
    html.find(".attributes a.attribute-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", ev => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }, false);
    });

    //add listener for min and max abilities
    let arr = document.getElementsByClassName("ability-score");
    for (let i = 0; i < arr.length; i++) {
      arr[i].addEventListener("change", this._onChangeAbility.bind(this));
    };

  }

  _onChangeAbility(event) {
    let value = parseInt(event.target.value);
    if (value < 1) value = 1;
    if (value > 5) value = 5;
    event.target.value = value;
    this._updateSkills(event.target.name);
    
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
    switch (button.dataset.action) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({ name: game.i18n.localize("CATS.ItemNew"), type: "item" }, { parent: this.actor });
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
}
