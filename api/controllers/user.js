const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.userSignup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        res.status(409).json({
          message: "Email already exist",
        });
      } else {
        if (req.body.konfirmasiPassword) {
          if (req.body.password === req.body.konfirmasiPassword) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                res.status(500).json({
                  message: err,
                });
              } else {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  name: req.body.name,
                  email: req.body.email,
                  noTelp: req.body.noTelp,
                  password: hash,
                  saldo: 0
                });

                user
                  .save()
                  .then((result) => {
                    res.status(201).json({
                      message: "User created",
                    });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      error: err,
                    });
                  });
              }
            });
          } else {
            res.status(401).json({
              message: "Password confirmation failed",
            });
          }
        } else {
          res.status(404).json({
            message: "Please insert password confirmation",
          });
        }
      }
    });
};

exports.userLogin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({
          message: "Auth failed",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          res.status(401).json({
            message: "Auth failed",
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              _id: user[0]._id,
              name: user[0].name,
              email: user[0].email,
              noTelp: user[0].noTelp,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );

          return res.status(200).json({
            message: "Auth success",
            token: token,
          });
        }

        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.userUpdatePin = (req, res, next) => {
  const userId = req.userData._id;
  if (req.body.pin) {
    if (req.body.konfirmasiPin) {
      if (req.body.pin === req.body.konfirmasiPin) {
        User.findByIdAndUpdate(userId, { $set: req.body }, { new: true })
          .exec()
          .then((result) => {
            res.status(200).json({
              message: "Pin updated",
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(401).json({
          message: "Pin confirmation failed",
        });
      }
    } else {
      res.status(400).json({
        message: "Field konfirmasiPin is required",
      });
    }
  } else {
    res.status(400).json({
      message: "Field pin is required",
    });
  }
};

exports.userGetSaldo = (req, res, next) => {
  const userId = req.userData._id;
  User.findById(userId)
    .select("name saldo")
    .exec()
    .then(docs => {
      res.status(404).json(docs)
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
}

exports.userTopup = (req, res, next) => {
  const userId = req.userData._id;
  if (req.body.nominal) {
    if (isNaN(req.body.nominal)) {
      res.status(400).json({
        message: "Field nominal must be a number",
      }); 
    } else {
      User.findById(userId)
        .select("saldo")
        .exec()
        .then(docs => {
          const saldo = docs.saldo + parseInt(req.body.nominal);
          User.findByIdAndUpdate(userId, { "saldo": saldo }, { new: true })
            .exec()
            .then((result) => {
              res.status(200).json({
                message: "Topup successfully!",
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        })
        .catch(err => res.status(500).json({ error: err }))
    }
  } else {
    res.status(400).json({
      message: "Field nominal is required",
    });
  }
}
