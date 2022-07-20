/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    // Attribute list partial.
    "systems/cats/templates/parts/sheet-attributes.html",
    "systems/cats/templates/parts/sheet-groups.html",
    "systems/cats/templates/parts/sheet-competence.html",
  "systems/cats/templates/parts/sheet-talent.html"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};