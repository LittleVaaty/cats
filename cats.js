/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { CatsActor } from "./module/Actor/actor.js";
import { SimpleItem } from "./module/item.js";
import { SimpleItemSheet } from "./module/item-sheet.js";
import { CatsActorSheet } from "./module/Actor/Sheets/cats-sheet.js";
import { BassetActorSheet } from "./module/Actor/Sheets/basset-sheet.js";
import { HumanActorSheet } from "./module/Actor/Sheets/human-sheet.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
import { createcatsMacro } from "./module/macro.js";
import { SimpleToken, SimpleTokenDocument } from "./module/token.js";
import { CATS } from "./module/config.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log(`Initializing Simple cats System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  game.cats = {
    CatsActor,
    createcatsMacro,
    entities: {
      CatsActor,
      SimpleItem,
      SimpleTokenDocument,
      SimpleToken
    },
    config: CATS,
    applications: {
    }
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = CatsActor;
  CONFIG.Item.documentClass = SimpleItem;
  CONFIG.Token.documentClass = SimpleTokenDocument;
  CONFIG.Token.objectClass = SimpleToken;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("cats", CatsActorSheet, { 
    types: ["chat"],
    makeDefault: true ,
    label: "Chat"
  });
  Actors.registerSheet("cats", BassetActorSheet, { 
    types: ["basset"],
    makeDefault: true ,
    label: "Basset"
  });
  Actors.registerSheet("cats", HumanActorSheet, { 
    types: ["humain"],
    makeDefault: true ,
    label: "Humain"
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cats", SimpleItemSheet, { makeDefault: true });

  // Register system settings
  game.settings.register("cats", "macroShorthand", {
    name: "SETTINGS.SimpleMacroShorthandN",
    hint: "SETTINGS.SimpleMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  // Register initiative setting.
  game.settings.register("cats", "initFormula", {
    name: "SETTINGS.SimpleInitFormulaN",
    hint: "SETTINGS.SimpleInitFormulaL",
    scope: "world",
    type: String,
    default: "1d20",
    config: true,
    onChange: formula => _simpleUpdateInit(formula, true)
  });

  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("cats", "initFormula");
  _simpleUpdateInit(initFormula);

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _simpleUpdateInit(formula, notify = false) {
    const isValid = Roll.validate(formula);
    if ( !isValid ) {
      if ( notify ) ui.notifications.error(`${game.i18n.localize("CATS.NotifyInitFormulaInvalid")}: ${formula}`);
      return;
    }
    CONFIG.Combat.initiative.formula = formula;
  }

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function(value) {
    return value.slugify({strict: true});
  });

  // Preload template partials
  await preloadHandlebarsTemplates();
});

/**
 * Macrobar hook.
 */
Hooks.on("hotbarDrop", (bar, data, slot) => createcatsMacro(data, slot));

/**
 * Adds the actor template context menu.
 */
Hooks.on("getActorDirectoryEntryContext", (html, options) => {
  const idAttr = game.cats.useEntity ? "entityId" : "documentId";
  // Define an actor as a template.
  options.push({
    name: game.i18n.localize("CATS.DefineTemplate"),
    icon: '<i class="fas fa-stamp"></i>',
    condition: li => {
      const actor = game.actors.get(li.data(idAttr));
      return !actor.isTemplate;
    },
    callback: li => {
      const actor = game.actors.get(li.data(idAttr));
      actor.setFlag("cats", "isTemplate", true);
    }
  });

  // Undefine an actor as a template.
  options.push({
    name: game.i18n.localize("CATS.UnsetTemplate"),
    icon: '<i class="fas fa-times"></i>',
    condition: li => {
      const actor = game.actors.get(li.data(idAttr));
      return actor.isTemplate;
    },
    callback: li => {
      const actor = game.actors.get(li.data(idAttr));
      actor.setFlag("cats", "isTemplate", false);
    }
  });
});

/**
 * Adds the item template context menu.
 */
Hooks.on("getItemDirectoryEntryContext", (html, options) => {
  const idAttr = game.cats.useEntity ? "entityId" : "documentId";
  // Define an item as a template.
  options.push({
    name: game.i18n.localize("CATS.DefineTemplate"),
    icon: '<i class="fas fa-stamp"></i>',
    condition: li => {
      const item = game.items.get(li.data(idAttr));
      return !item.isTemplate;
    },
    callback: li => {
      const item = game.items.get(li.data(idAttr));
      item.setFlag("cats", "isTemplate", true);
    }
  });

  // Undefine an item as a template.
  options.push({
    name: game.i18n.localize("CATS.UnsetTemplate"),
    icon: '<i class="fas fa-times"></i>',
    condition: li => {
      const item = game.items.get(li.data(idAttr));
      return item.isTemplate;
    },
    callback: li => {
      const item = game.items.get(li.data(idAttr));
      item.setFlag("cats", "isTemplate", false);
    }
  });
});
