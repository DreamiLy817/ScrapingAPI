'use strict';

module.exports = function(app) {
    var scraping = require('../controllers/scrapingController');

    // routes

    app.route('/test')
        .get(scraping.getListCloth);

    app.route('/vetements')
        .get(scraping.listAllClothRoute)
        .post(scraping.createCloth);

    app.route('/vetements/:clothId')
        .get(scraping.getCloth)
        .put(scraping.updateCloth)
        .delete(scraping.deleteCloth);

    

};
