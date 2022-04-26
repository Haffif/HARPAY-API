const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const ListrikRumah = require("../models/listrikRumah");
const TokenRumah = require("../models/tokenRumah");
const History = require("../models/history");
const Forgot = require("../models/forgot");

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
            if (req.body.konfirmasiPin) {
              if (req.body.pin === req.body.konfirmasiPin) {
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
                      saldo: 0,
                      pin: req.body.pin
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
                res.status(400).json({
                  message: "Pin confirmation failed",
                }); 
              }
            } else {
              res.status(400).json({
                message: "Pin confirmation is required",
              });
            }
          } else {
            res.status(400).json({
              message: "Password confirmation failed",
            });
          }
        } else {
          res.status(400).json({
            message: "Password confirmation is required",
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
            res.status(201).json({
              message: "Pin updated",
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
            });
          });
      } else {
        res.status(400).json({
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

exports.userUpdatePassword = (req, res, next) => {
  const userId = req.userData._id;
  if (req.body.passwordBaru) {
    if (req.body.konfirmasiPasswordBaru) {
      if (req.body.passwordBaru === req.body.konfirmasiPasswordBaru) {
        bcrypt.hash(req.body.passwordBaru, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              message: err,
            });
          } else {
            User.findByIdAndUpdate(userId, { "password": hash }, { new: true })
              .exec()
              .then(result => {
                res.status(201).json({ message: "Password updated" })
              })
              .catch(err => res.status(500).json({ error: err }))
          }
        });
      } else {
        res.status(400).json({
          message: "New password confirmation failed",
        });
      }
    } else {
      res.status(400).json({
        message: "Field konfirmasiPasswordBaru is required",
      });
    }
  } else {
    res.status(400).json({
      message: "Field passwordBaru is required",
    });
  }
}

exports.userGetSaldo = (req, res, next) => {
  const userId = req.userData._id;
  User.findById(userId)
    .select("name saldo")
    .exec()
    .then(docs => {
      res.status(200).json(docs)
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
}

const jenisTransaksi = ["Top-up", "Pembayaran Listrik", "Pembelian Token", "Transfer Saldo"];

exports.userTopup = (req, res, next) => {
  const userId = req.userData._id;
  if (req.body.nominal) {
    if (isNaN(req.body.nominal)) {
      res.status(400).json({
        message: "Field nominal must be a number",
      }); 
    } else {
      if (req.body.nominal > 0) {
        User.findById(userId)
        .select("saldo name")
        .exec()
        .then(docs => {
          const saldo = docs.saldo + parseInt(req.body.nominal);
          User.findByIdAndUpdate(userId, { "saldo": saldo }, { new: true })
            .exec()
            .then((result) => {
              const history = new History({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                userNama: docs.name,
                jenisTransaksi: jenisTransaksi[0],
                jumlahTopup: parseInt(req.body.nominal),
                nominalPengeluaran: 0,
                idPelanggan: "-",
                akunTujuanTransfer: 0
              });

              history
                .save()
                .then(final => {
                  res.status(201).json({
                    message: "Topup successfully!",
                  })
                })
                .catch(err => res.status(500).json({ error: err }))
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        })
        .catch(err => res.status(500).json({ error: err }))
      } else {
        res.status(400).json({
          message: "Field nominal must be a positive number and non zero",
        }); 
      }
    }
  } else {
    res.status(400).json({
      message: "Field nominal is required",
    });
  }
}

exports.userCekBayarListrik = (req, res, next) => {
  if (req.body.idPelanggan) {
    ListrikRumah.findById(req.body.idPelanggan)
      .select("namaPemilik alamatRumah pembayaranBulan jumlahBayarBulan")
      .exec()
      .then(listrikRumah => {
        if (listrikRumah != null) {
          if (!listrikRumah.pembayaranBulan) {
            res.status(200).json({
              message: "Please do a payment for this month",
              data: listrikRumah
            })
          } else {
            res.status(200).json({ message: "ID pelanggan already made payment for this month" });
          }
        } else {
          res.status(404).json({ message: "idPelanggan not found" });
        }
      })
      .catch(err => res.status(500).json({ error: err }))
  } else {
    res.status(400).json({
      message: "Field idPelanggan is required",
    });
  }
}

exports.userBayarListrik = (req, res, next) => {
  const userId = req.userData._id;

  if (req.body.idPelanggan) {
    if (req.body.pin) {
      User.findById(userId)
        .exec()
        .then(user => {
          ListrikRumah.findById(req.body.idPelanggan)
            .exec()
            .then(result => {
              if (result) {
                if (!result.pembayaranBulan) {
                  const tagihan = result.jumlahBayarBulan;
                  let saldoUser = user.saldo;
                  if (saldoUser >= tagihan) {
                    if (req.body.pin == user.pin) {
                      saldoUser = saldoUser - tagihan;
                      ListrikRumah.findByIdAndUpdate(req.body.idPelanggan, { "pembayaranBulan": true, "jumlahBayarBulan": 0 }, { new: true })
                        .exec()
                        .then((result2) => {
                          User.findByIdAndUpdate(userId, { "saldo": saldoUser }, { new: true })
                            .exec()
                            .then(result3 => {
                              const history = new History({
                                _id: new mongoose.Types.ObjectId(),
                                userId: userId,
                                userNama: user.name,
                                jenisTransaksi: jenisTransaksi[1],
                                jumlahTopup: 0,
                                nominalPengeluaran: tagihan,
                                idPelanggan: req.body.idPelanggan,
                                akunTujuanTransfer: 0
                              });

                              history
                                .save()
                                .then(final => {
                                  res.status(201).json({
                                    message: "Payment for pembayaran listrik successfully",
                                  });
                                })
                                .catch(err => res.status(500).json({ error: err }))
                            })
                            .catch(err => res.status(500).json({ error: err }))
                        })
                        .catch((err) => {
                          res.status(500).json({
                            error: err,
                          });
                        });
                    } else {
                      res.status(400).json({ message: "Pin confirmation failed" });
                    }
                  } else {
                    res.status(400).json({ message: "Your balance is not enough, please topup for do this transaction" });
                  }
                } else {
                  res.status(400).json({ message: "ID pelanggan already made payment for this month" });
                }
              } else {
                res.status(404).json({ message: "No valid entry found for that ID pelanggan" });
              }
            })
            .catch(err => res.status(500).json({ error: err }))
        })
        .catch(err => res.status(500).json({ message: "Something error", error: err }))
    } else {
      res.status(400).json({
        message: "Field pin is required",
      });
    }
  } else {
    res.status(400).json({
      message: "Field idPelanggan is required",
    });
  }
}

exports.userCekToken = (req, res, next) => {
  if (req.body.idPelanggan) {
    TokenRumah.findById(req.body.idPelanggan)
      .select("namaPemilik alamatRumah sisaToken")
      .exec()
      .then(tokenRumah => {
        if (tokenRumah != null) {
          if (tokenRumah.sisaToken < 8000) {
            res.status(200).json({
              message: "Please refill this token!",
              notes: "Nominal purchase of tokens that can be purchased: 20000, 50000, 100000",
              data: tokenRumah,
            });
          } else {
            res.status(200).json({
              notes: "Nominal purchase of tokens that can be purchased: 20000, 50000, 100000",
              data: tokenRumah
            });
          }
        } else {
          res.status(404).json({ message: "idPelanggan not found" });
        }
      })
      .catch(err => res.status(500).json({ error: err }))
  } else {
    res.status(400).json({
      message: "Field idPelanggan is required",
    });
  }
};

const nominalTokenTopup = [20000, 50000, 100000];

exports.userBeliToken = (req, res, next) => {
  const userId = req.userData._id;

  if (req.body.idPelanggan && req.body.pin && req.body.nominal) {
    const isNominalTrue = nominalTokenTopup.includes(parseInt(req.body.nominal));
    if (isNominalTrue) {
      User.findById(userId)
        .exec()
        .then(user => {
          TokenRumah.findById(req.body.idPelanggan)
            .exec()
            .then(tokenRumah => {
              if (tokenRumah) {
                let saldoUser = user.saldo;
                if (saldoUser >= req.body.nominal) {
                  if (req.body.pin == user.pin) {
                    let tokenBaru = tokenRumah.sisaToken + parseInt(req.body.nominal)
                    TokenRumah.findByIdAndUpdate(req.body.idPelanggan, { "sisaToken": tokenBaru }, { new: true })
                      .exec()
                      .then(result => {
                        saldoUser = saldoUser - parseInt(req.body.nominal);
                        User.findByIdAndUpdate(userId, { "saldo": saldoUser }, { new: true })
                          .exec()
                          .then(final => {
                            const history = new History({
                              _id: new mongoose.Types.ObjectId(),
                              userId: userId,
                              userNama: user.name,
                              jenisTransaksi: jenisTransaksi[2],
                              jumlahTopup: 0,
                              nominalPengeluaran: req.body.nominal,
                              idPelanggan: req.body.idPelanggan,
                              akunTujuanTransfer: 0
                            });

                            history
                              .save()
                              .then(finish => {
                                res.status(201).json({
                                  message: "Payment for token listrik is successfully",
                                });
                              })
                              .catch(err => res.status(500).json({ error: err }))
                          })
                          .catch(err => res.status(500).json({ error: err }))
                      })
                      .catch(err => res.status(500).json({ error: err }))
                  } else {
                    res.status(400).json({ message: "Pin confirmation failed" });
                  }
                } else {
                  res.status(400).json({ message: "Your balance is not enough, please topup for do this transaction" }); 
                }
              } else {
                res.status(404).json({ message: "No valid entry found for that ID pelanggan" });
              }
            })
        })
        .catch(err => {
          res.status(500).json({ error: err })
        })
    } else {
      res.status(400).json({
        message: "Field nominal can only contain one of 20000, 50000, 100000",
      });  
    }
  } else {
    res.status(400).json({
      message: "Field idPelanggan, pin, nominal is required",
    });
  }
};

exports.userTransfer = (req, res, next) => {
  const userId = req.userData._id;

  if (req.body.noTelp && req.body.nominal && req.body.pin) {
    User.findById(userId)
      .exec()
      .then(user => {
        if (user.noTelp != req.body.noTelp) {
          let saldoUser = user.saldo;
          if (saldoUser >= req.body.nominal) {
            if (user.pin == req.body.pin) {
              User.find({ noTelp: req.body.noTelp })
                .exec()
                .then(people => {
                  if (people.length > 0) {
                    let saldoBaruPeople = people[0].saldo + parseInt(req.body.nominal);
                    saldoUser = saldoUser - parseInt(req.body.nominal);
                    User.findByIdAndUpdate(people[0]._id, { "saldo": saldoBaruPeople }, { new: true })
                      .exec()
                      .then(result => {
                        User.findByIdAndUpdate(user._id, { "saldo": saldoUser }, { new: true })
                          .exec()
                          .then(finish => {
                            const history = new History({
                              _id: new mongoose.Types.ObjectId(),
                              userId: userId,
                              userNama: user.name,
                              jenisTransaksi: jenisTransaksi[3],
                              jumlahTopup: 0,
                              nominalPengeluaran: req.body.nominal,
                              idPelanggan: "-",
                              akunTujuanTransfer: req.body.noTelp
                            });

                            history
                              .save()
                              .then(last => {
                                res.status(201).json({
                                  message: "Successfully payment for transfer saldo"
                                });
                              })
                              .catch(err => res.status(500).json({ error: err }))
                          })
                          .catch(err => res.status(500).json({ error: err }))
                    })
                    .catch(err => res.status(500).json({ error: err }))
                  } else {
                    res.status(404).json({ message: "No telp not found" });
                  }
                })
                .catch(err => res.status(500).json({ error: err }))
            } else {
              res.status(400).json({ message: "Pin confirmation failed" });
            }
          } else {
            res.status(400).json({ message: "Your balance is not enough, please topup for do this transaction" }); 
          }
        } else {
          res.status(400).json({ message: "Can't transfer to yourself" })
        }
      })
      .catch(err => res.status(500).json({ error: err }))
  } else {
    res.status(400).json({
      message: "Field noTelp, nominal, pin is required",
    });
  }
}

exports.userCekHistory = (req, res, next) => {
  const userId = req.userData._id;

  History.find({ userId: userId })
    .exec()
    .then(histories => {
      if (histories.length > 0) {
        let totalTopup = totalPengeluaran = 0;
        histories.forEach(history => {
          totalTopup += history.jumlahTopup;
          totalPengeluaran += history.nominalPengeluaran;
        });
        res.status(200).json({
          totalTransaksi: histories.length,
          totalTopup: totalTopup,
          totalPengeluaran: totalPengeluaran,
          data: histories
        });
      } else {
        res.status(404).json({ message: "You never made a transaction" })
      }
    })
    .catch(err => res.status(500).json({ error: err }))
}

const sendEmail = (email, pin) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: "harpayapi@gmail.com",
      pass: "H4rpaynibos123#"
    }
  });
  let mailOptions = {
    from: 'harpayapi@gmail.com',
    to: "rmurshal@gmail.com",
    subject: '[PIN Confirmation for Forgot Password]',
    text: `Hi, this is your pin: ${pin}, please use that immediately because its only availabel in 3 minutes.`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
    else {
      console.log("Mail sending!");
    }
  });
}

exports.userSendForgotPassword = (req, res, next) => {
  if (req.body.email) {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length <= 0) {
          res.status(400).json({ message: "User for that email not found" })
        } else {
          Forgot.find({ email: req.body.email })
            .exec()
            .then(user2 => {
              // generate expired date
              const currentDate = new Date();
              const futureDate = new Date(currentDate.getTime() + 3*60000); // 3 minutes to to expired!!

              // generate a 6 digit number pin confirmation
              const pin = Math.floor(100000 + Math.random() * 900000);

              if (user2.length > 0) {
                Forgot.findByIdAndUpdate(user2[0]._id, { "pin": pin, "expired": futureDate }, { new: true })
                  .exec()
                  .then(result => {
                    sendEmail(req.body.email, pin);
                    res.status(200).json({
                      message: "Pin confirmation is sending to your email"
                    })
                  })
                  .catch(err => res.status(500).json({ error: err }))
              } else {
                // insert data to db
                const forgot = new Forgot({
                  _id: new mongoose.Types.ObjectId(),
                  email: req.body.email,
                  pin: pin,
                  expired: futureDate
                });

                forgot
                  .save()
                  .then(result => {
                    sendEmail(req.body.email, pin);
                    res.status(200).json({
                      message: "Pin confirmation is sending to your email"
                    });
                  })
                  .catch(err => res.status(500).json({ error: err }))
              }
            })
            .catch(err => res.status(500).json({ error: err }))
        }
      })
      .catch(err => res.status(500).json({ error: err }))
  } else {
    res.status(400).json({
      message: "Field email is required",
    });
  }
}
