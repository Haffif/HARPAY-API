const mongoose = require("mongoose");

const Feature = require("../models/feature");

exports.getAllFeature = (req, res, next) => {
  Feature.find()
    .exec()
    .then((docs) => {
      if (docs.length > 0) {
        const response = {
          count: docs.length,
          features: docs,
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No features yet",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.featuresAddFeature = (req, res, next) => {
  const feature = new Feature({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
  });

  feature.save().then((result) => {
    res
      .status(201)
      .json({
        message: "Feature successfully created",
        createdProduct: {
          _id: result._id,
          title: result.title,
          description: result.description,
          request: {
            type: "GET",
            url: "http://localhost:3000/fitur",
          },
        },
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
};

exports.getSpecificFeature = (req, res, next) => {
  const id = req.params.featureId;
  Feature.findById(id)
    .exec()
    .then((feature) => {
      if (feature) {
        res.status(200).json({
          feature: feature,
        });
      } else {
        res.status(404).json({ message: "Feature ID is invalid" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
