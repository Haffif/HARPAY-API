const mongoose = require("mongoose");

const ListrikRumah = require("../models/listrikRumah");
const TokenRumah = require("../models/tokenRumah");

exports.getListrikRumah = (req, res, next) => {
	ListrikRumah.find()
		.exec()
		.then(docs => {
			if (docs.length > 0) {
				res.status(200).json({
					count: docs.length,
					data: docs
				});
			} else {
				res.status(404).json({
		          	message: "No listrikRumah data yet",
		        });
			}
		})
		.catch(err => res.status(500).json({ error: err }))
}

exports.createListrikRumah = (req, res, next) => {
	const listrikRumah = new ListrikRumah({
		_id: new mongoose.Types.ObjectId(),
		namaPemilik: req.body.namaPemilik,
		alamatRumah: req.body.alamatRumah,
	});

	listrikRumah
		.save()
		.then(result => {
			res.status(201).json({
				message: "ListrikRumah data succesfully added"
			});
		})
		.catch(err => res.status(500).json({ error: err }))
}

exports.getTokenRumah = (req, res, next) => {
	TokenRumah.find()
		.exec()
		.then(docs => {
			if (docs.length > 0) {
				res.status(200).json({
					count: docs.length,
					data: docs
				});
			} else {
				res.status(404).json({
		          	message: "No tokenRumah data yet",
		        });
			}
		})
		.catch(err => res.status(500).json({ error: err }))
}

exports.createTokenRumah = (req, res, next) => {
	const tokenRumah = new TokenRumah({
		_id: new mongoose.Types.ObjectId(),
		namaPemilik: req.body.namaPemilik,
		alamatRumah: req.body.alamatRumah,
	});

	tokenRumah
		.save()
		.then(result => {
			res.status(201).json({
				message: "TokenRumah data succesfully added"
			});
		})
		.catch(err => res.status(500).json({ error: err }))
}
