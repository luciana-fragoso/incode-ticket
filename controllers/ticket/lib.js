const Ticket = require('../../schema/schemaTicket.js');
const User = require('../../schema/schemaUser.js');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

function create(req, res) {
	
	if (!req.body.title || !req.body.description || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid request"
		})
	} else {
		
		var decoded = jwt.verify(req.session.token, config.secret);
    	var userEmail = decoded.email;
		if (req.body)
		var ticket = {
			title: req.body.title,
			description: req.body.description,
			responsible: req.body.responsible,
			priority: req.body.priority,
			createdBy: userEmail,
			assignedTo: req.body.assignedTo
		}

		if (req.body.assignedTo === ""){
			delete ticket.assignedTo;
		}

		var _t = new Ticket(ticket);
		_t.save(function (err, ticket) {
			if (err) {
				res.status(500).json({
					"text": "Internal error"
				})
			} else {
				res.redirect(`${ticket.getId()}`);
			}
		})
	}
}

async function createForm(req, res) {
	var decoded = jwt.verify(req.session.token, config.secret);
	var userEmail = decoded.email;

	const user = await User.findOne({email:userEmail});
	const users = await User.find();	
	res.status(200).render('ticket/create', {title: 'Create ticket',role:user.role,users:users});
}

function show(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Invalid Request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, async function (err, ticket) {
				if (err) {
					reject(500);
				} else {
					if (ticket) {
						resolve(ticket);
					}
					 else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.status(200).render('ticket/show', {title: `Ticket n°${ticket._id}`, ticket});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal error"
					})
			}
		})
	}
}

function edit(req, res) {
	if (!req.params.id) {
		res.status(400).json({
			"text": "Invalid Request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			Ticket.findById(req.params.id, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						resolve(result)
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(async function (ticket) {
			
			var decoded = jwt.verify(req.session.token, config.secret);
			var userEmail = decoded.email;

			const user = await User.findOne({email:userEmail});
			const users = await User.find();	

			res.status(200).render('ticket/edit', {title: `Edit Ticket n°${ticket._id}`, ticket:ticket,role:user.role,users:users});
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal Error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal error"
					})
			}
		})
	}
}

function update(req, res) {
	
	if (!req.params.id || !req.body.description || !req.body.priority) {
		res.status(400).json({
			"text": "Invalid request"
		})
	} else {
		var findTicket = new Promise(function (resolve, reject) {
			req.body.completed = typeof req.body.completed !== 'undefined' ? true : false;
		
			Ticket.findOneAndUpdate({"_id":req.params.id},{"title":req.body.title,"description":req.body.description,
			"priority":req.body.priority,"completed":req.body.completed,"assignedTo":req.body.assignedTo}
			,{new: true}, function (err, result) {
				if (err) {
					reject(500);
				} else {
					if (result) {
						if (req.body.comment !== ""){
							Ticket.findByIdAndUpdate(req.params.id,{$push:{"comment" : req.body.comment}} , function (err,ticket) {
								resolve(ticket);
							});
						}
						else {
							resolve(result);
						}
						
					} else {
						reject(200)
					}
				}
			})
		})

		findTicket.then(function (ticket) {
			res.redirect(`../${ticket.getId()}`);
		}, function (error) {
			switch (error) {
				case 500:
					res.status(500).json({
						"text": "Internal error"
					})
					break;
				case 200:
					res.status(200).json({
						"text": "The ticket does not exist"
					})
					break;
				default:
					res.status(500).json({
						"text": "Internal error"
					})
			}
		})
	}
}

function list(req, res) {
	var findTicket = new Promise(function (resolve, reject) {
		Ticket.find({}, function (err, tickets) {
			if (err) {
				reject(500);
			} else {
				if (tickets) {
					resolve(tickets)
				} else {
					reject(200)
				}
			}
		})
	})

	findTicket.then(function (tickets) {
		res.status(200).render('ticket/index', {title: 'Ticket list', tickets});
	}, function (error) {
		switch (error) {
			case 500:
				res.status(500).json({
					"text": "Internal error"
				})
				break;
			case 200:
				res.status(200).json({
					"text": "There is no ticket yet"
				})
				break;
			default:
				res.status(500).json({
					"text": "Internal error"
				})
		}
	})
}


function filter(req,res){

	var searchFilter = null;

	if (req.body.isAssigned === "true"){
		searchFilter = {$ne:null};
	}
	
	Ticket.find({"assignedTo" : searchFilter})
	.exec()
	.then(ticket => {
	if (ticket) {
		res.send(ticket);
	} else {
		res.status(404).json({ "text": "No tickets yeet" });
	}
	})
	.catch(err => {
	
	res.status(500).json({ "text" : "Internal error"});
	});



}
exports.create = create;
exports.createForm = createForm;
exports.show = show;
exports.edit = edit;
exports.update = update;
exports.list = list;
exports.filter = filter;