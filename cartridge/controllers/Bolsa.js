'use strict';

var server = require('server');

server.get('ShowJson', function (req, res, next) {

    var PageMgr = require('dw/experience/PageMgr');

    var page = PageMgr.getPage(req.querystring.cid);

    res.base.addHttpHeader("Access-Control-Allow-Origin", "*")

    res.setContentType('application/json');

    if (page != null && page.isVisible()) {

        var useCache = !req.querystring.hasOwnProperty('nocache');

        if (!page.hasVisibilityRules() && useCache) {

            res.cachePeriod = 168; // eslint-disable-line no-param-reassign

            res.cachePeriodUnit = 'hours'; // eslint-disable-line no-param-reassign

        }

        res.page(page.ID, {});

    } else {

        res.json({

            "error": "Page not found or not published"

        })

    }

    return next();

});



module.exports = server.exports();