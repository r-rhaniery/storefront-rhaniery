'use strict';

var HashMap = require('dw/util/HashMap');

var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');

var TemplateRenderHelper = require('*/cartridge/experience/utilities/TemplateRenderHelper.js');

var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');

var Site = require('dw/system/Site');

/**

 * Render logic for the storepage.

 *

 * @param {dw.experience.PageScriptContext} context The page script context object.

 *

 * @returns {string} The template text

 */

module.exports.render = function (context) {

    var model = new HashMap();

    var page = context.page;

    model.page = page;

    model.regions = PageRenderHelper.getRegionModelRegistry(page);



    if (PageRenderHelper.isInEditMode()) {

        var HookManager = require('dw/system/HookMgr');

        HookManager.callHook('app.experience.editmode', 'editmode');

        model.resetEditPDMode = true;

        model.site = Site.current.ID;

        model.cid = request.httpParameterMap.cid.value;

        model.locale = request.locale;

    }

    const rendered = TemplateRenderHelper.conditionalRenderer(model, 'experience/pages/pageBolsa', page);

    if (PageRenderHelper.isInEditMode()) {

        return rendered;

    } else {

        var content = JSON.parse(rendered || '{}');

        if (content && content.main) {

            return JSON.stringify(content.main[0]);

        }

        return '{}';

    }

};