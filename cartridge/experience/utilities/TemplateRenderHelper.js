'use strict';

var PageRenderHelper = require('*/cartridge/experience/utilities/PageRenderHelper.js');

var Template = require('dw/util/Template');

function getMetaDefinition(container) {

    var containerType;

    if (container && container instanceof dw.experience.Page) { // eslint-disable-line no-undef

        containerType = 'pages';

    } else if (container && container instanceof dw.experience.Component) { // eslint-disable-line no-undef

        containerType = 'components';

    } else {

        return null;

    }

    return require('*/cartridge/experience/' + containerType + '/' + container.typeID.replace(/\./g, '/') + '.json');

}

function getRegionNames(container) {

    var names = [];

    var metadef = getMetaDefinition(container);

    if (metadef && metadef.region_definitions) {

        metadef.region_definitions.forEach(function (regionDefinition) {

            names.push(regionDefinition.id);

        });

    }

    return names;

}

function renderRegions(regions, container) {

    if (!regions) return;

    var result = {};

    var names = getRegionNames(container);

    names.forEach(function (name) {

        var region = regions[name];

        if (region.hasOwnProperty('defaultComponentRenderSettings') && region.hasOwnProperty('regionRenderSettings')) {

            region.defaultComponentRenderSettings.setAttributes({})

            region.regionRenderSettings.setAttributes({});

            region.defaultComponentRenderSettings.setTagName('removethis');

            region.regionRenderSettings.setTagName('jsonregion');

        }

        var json = region.render();

        json = json.replace(/(<jsonregion[^>]+>|<jsonregion>)/gi, '[');

        json = json.replace(/<\/jsonregion>/gi, ']');

        json = json.replace(/<\/removethis><removethis[^>]+>/gi, ',');

        json = json.replace(/(<removethis[^>]+>|<removethis>|<\/removethis>)/gi, '');


        try {

            result[name] = JSON.parse(json);

        } catch (e) {

            result[name] = (json);

        }

    });

    return result;

}

function conditionalRenderer(model, template, container) {

    if (PageRenderHelper.isInEditMode()) {

        return templateRenderer(model, template);

    }

    return jsonRenderer(model, container);

}

function templateRenderer(model, template) {

    return new Template(template).render(model).text;

}

function jsonRenderer(model, container) {

    var cont = container;

    var obj = { entity: cont.typeID.replace(/.*\./g, ''), id: container.ID };



    var keys = model.keySet();

    for (var index = 0; index < keys.length; index++) {

        var key = keys[index];

        var value = model.get(key);

        obj[key] = value;

    }



    if (model.regions) {

        var regions = renderRegions(model.regions, cont);

        delete obj.regions;

        Object.keys(regions).forEach(function (key) {

            obj[key] = regions[key];

        });

    }


    return JSON.stringify(obj);

}

module.exports = {

    conditionalRenderer: conditionalRenderer,

    jsonRenderer: jsonRenderer,

    templateRenderer: templateRenderer

};