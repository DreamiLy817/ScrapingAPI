
const Cloth = require('../models/scrapingModel');

const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { promisify } = require('util');

// Helpers function
const readFileAsync = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const logError = err => console.log(err);

// Utils functions
const currentDate = Date(Date.now());
const getProductInfos = el => ({
  id: el.find('.product-wrapper').data('product-id'),
  title: el.find('.product-name h3').text().trim(),
  url: el.find('.img-link').attr('href'),
  image: el.find('.img-link img').attr('src'),
  priceD: [
    [
      { prix: el.find('.price').text().trim(), currentDate }
    ]
  ]
});

const listAllCloths = function (req, res) {
  Cloth.find({}, function (err, cloth) {
    if (err)
      res.send(err);
     res.json(cloth);
     return cloth;
  });
};

const createCloth = function (req, res) {
  var item = new Cloth(req.body);
  item.save(function (err, cloth) {
    if (err)
      res.send(err);
    res.json(cloth);
  });
};

const getCloth = function (req, res) {
  Cloth.find(req.params.idItem, function (err, cloth) {
    if (err)
      res.send(err);
    res.json(cloth);
  });
};


const updateCloth = function (req, res) {
  Cloth.findOneAndUpdate({ _id: req.params.idItem}, req.body, { new: true }, function (err, cloth) {
    if (err)
      res.send(err);
    res.json(cloth);
  });
};

const addManyCloths = function (cloths,req,res) {
  Cloth.insertMany(cloths, function(err) {
    if (err)
      res.send(err);
    res.json({ message: 'Cloths successfully added' });
  });
}

const deleteCloth = function (req, res) {
  Cloth.remove({
    _id: req.params.clothId
  }, function (err, cloth) {
    if (err)
      res.send(err);
    res.json({ message: 'Cloth successfully deleted' });
  });
};

module.exports = {listAllCloths, createCloth, addManyCloths, getCloth, updateCloth, deleteCloth};