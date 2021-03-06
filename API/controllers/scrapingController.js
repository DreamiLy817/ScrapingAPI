
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
  idItem: el.find('.product-wrapper').data('product-id'),
  title: el.find('.product-name h3').text().trim(),
  url: el.find('.img-link').attr('href'),
  image: el.find('.img-link img').attr('src'),
  priceD: [
    [
      { prix: el.find('.price').text().trim(), currentDate }
    ]
  ]
});

const listAllClothRoute = function (req, res) {
  Cloth.find({}, (function (err, cloth) {
    if (err)
      return res.send(err);
    res.json(cloth);
  }))
};

const createCloth = function (req, res) {
  var item = new Cloth(req.body);
  item.save(function (err, cloth) {
    if (err)
      return rres.send(err);
    res.json(cloth);
  });
};

const getCloth = function (req, res) {
  Cloth.find(req.params.idItem, function (err, cloth) {
    if (err)
      return res.send(err);
    res.json(cloth);
  });
};


const updateCloth = function (req, res) {
  Cloth.findOneAndUpdate({ _id: req.params.idItem}, req.body, { new: true }, function (err, cloth) {
    if (err)
      return res.send(err);
    res.json(cloth);
  });
};

const addManyCloths = function (cloths,req,res) {
  Cloth.insertMany(cloths, function(err) {
    if (err)
      return res.send(err);
    res.json({ message: 'Cloths successfully added' });
  });
}

const deleteCloth = function (req, res) {
  Cloth.remove({
    _id: req.params.clothId
  }, function (err, cloth) {
    if (err)
      return res.send(err);
    res.json({ message: 'Cloth successfully deleted' });
  });
};

const getListCloth = async function (req, res) {
  //recuperer les pulls sur le site 
  const response = await axios.get('https://www.jennyfer.com/fr-fr/vetements/pulls-et-gilets/').catch(logError);
  if (response.status !== 200) return;

  //transformation en DOM qui p-e parcouru comme en Jquery $
  const $ = cheerio.load(response.data);
  //récuperer tous les pulls avec le selecteur ('#search-result-items .list-tile'), $ represente les données récuperées 
  const listFromRequest = $('#search-result-items .list-tile').map((i, elem) => getProductInfos($(elem))).get().filter(n => n);
  
  const cb = (err, data) => console.log(err, data);
  const getCloths = async cb => Cloth.find({}, cb);

  const cloths = await getCloths(cb);
  const newListCloth = [];

  //si le fichier de pull stocké est vide, il récupère tout ce qu'il y a sur la page
  if (!cloths) 
    //stocke le liste json en base de donnée,
    return addManyCloths(listFromRequest, req, res);
  
  //sinon on met à jour la liste  
  //pour chaque pull de la liste à jour...
  listFromRequest.forEach(item => {
    const byId = item.idItem;
    // probleme ici
    const currentItem = cloths.findById(byId);
    //si l'article est égale à null, c'est qu'il n'a pas été trouvé dans la liste, donc on l'ajoute
    const a = 'e ';
    if (!currentItem) {
      //console.log(" je passe car l'article n'-existe pas");
      var newItem = new Cloth(
        {
        idItem: item.idItem,
        title: item.title,
        url: item.url,
        image: item.image,
        priceD: [
          [{ 
            prix: item.priceD[0][0].prix,
          }]
        ]
      }
      );
      // Nous récupérons les données reçues pour les ajouter à l'objet Piscine
        //newItem.idItem = item.idItem;
        //newItem.title = item.title;
        //newItem.url = item.url;
        //newItem.image = "de la merde";
        //newItem.priceD[0][0].currentDate =  item.priceD[0][0].prix;
        //newItem.priceD.currentDate = item.priceD[0][0].currentDate;
       
        newListCloth.push(newItem);
    }

    
    const oldPrice = currentItem.priceD[currentItem.priceD.length - 1].prix;
    const newPrice = item.priceD[0].prix;
    // si le prix du pull stocké est différent du nouveau prix récupérer on met à jour l'objet 
    if (oldPrice != newPrice)
      currentItem.priceD.push({ prix: newPrice, currentDate: new Date() });
    else 
    cloths.push(item);
  });

  if(newListCloth) {
    addManyCloths(newListCloth, req, res);
    return;
  }
 
  
  //res.json(cloths);
}

module.exports = { listAllClothRoute, createCloth, addManyCloths, getListCloth, getCloth, updateCloth, deleteCloth};