'use strict';

var HashMap = require('dw/util/HashMap');
var TemplateRenderHelper = require('*/cartridge/experience/utilities/TemplateRenderHelper.js');

const URLUtils = require('dw/web/URLUtils');

const Template = require('dw/util/Template');

/**

 * Render logic for the storefront.howToMultipleItems component

 * @param {dw.experience.ComponentScriptContext} context The Component script context object.

 * @returns {object} The model

 */
module.exports.render = function(context) {
    const content = context.content;
    const model = new HashMap()
    const component = context.component
    model.name = content.name;
    model.image = content.image;
    return TemplateRenderHelper.conditionalRenderer(model, 'experience/components/commerce_assets/test', component);
}
