'use strict';

var mongoose = require('mongoose');

var Cloth = mongoose.model('Vetements');

exports.listAllCloths = function(req, res) {
    Cloth.find({}, function(err,cloth) {
        if(err)
            res.send(err);
        res.json(cloth);
    });
};

exports.createCloth = function(req, res) {
    var item = new Cloth(req.body);
    item.save(function(err,cloth) {
        if(err)
            res.send(err);
        res.json(cloth);
    });
};

exports.getCloth = function(req, res) {
    Task.findById(req.params.clothId, function(err, cloth) {
      if (err)
        res.send(err);
      res.json(cloth);
    });
  };
  
  
  exports.updateCloth = function(req, res) {
    Cloth.findOneAndUpdate({_id: req.params.clothId}, req.body, {new: true}, function(err, cloth) {
      if (err)
        res.send(err);
      res.json(cloth);
    });
  };
  
  
  exports.deleteCloth = function(req, res) {
    Cloth.remove({
      _id: req.params.clothId
    }, function(err, cloth) {
      if (err)
        res.send(err);
      res.json({ message: 'Cloth successfully deleted' });
    });
  };
  