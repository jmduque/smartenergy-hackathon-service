'use strict'

const httpStatus = require('http-status-codes')
const Battery = require('./batteryModel')

/**
 * Get Battery Detail.
 *
 * GET /battery/:id
 *
 * @param req
 * @param res
 */
module.exports.getItem = function (req, res) {
    // Check if ID was provided
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).send({error: 'ID is required'})
  }

  Battery.findById(
        req.params.id,
        (err, item) => {
          if (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
          }
          if (!item) {
            return res.status(httpStatus.NOT_FOUND).send({error: 'Battery Not Found'})
          }
          return res.status(httpStatus.OK).json(item)
        })
}

/**
 * Get Batteries
 *
 * GET /battery?owner=<user_id>
 *
 * @param req
 * @param res
 */
module.exports.getItems = function (req, res) {
  const query = {}

  if (req.query.owner) {
    query.owner = req.query.owner
  }

  Battery
    .find(query)
    .sort('-created_at')
    .exec((err, items) => {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})
      }
      return res.status(httpStatus.OK).json(items)
    })
}

/**
 * Create a Battery.
 *
 * POST /battery
 *
 * @param req
 * @param res
 */
module.exports.postItem = function (req, res) {
    // Create the new battery
  const newItem = new Battery({
    name: req.body.name,
    type: req.body.type,
    status: req.body.status,
    capacity: req.body.capacity,
    charge: req.body.charge,
    location: req.body.location,
    owner: req.user._id
  })

  // Attempt to save the battery
  newItem.save(function (err) {
    if (err) {
      res.status(httpStatus.BAD_REQUEST)
      return res.json(
                {error: err}
            )
    }
    return res.status(httpStatus.CREATED).json(newItem)
  })
}

/**
 * Edit Battery.
 *
 * PUT /battery/:id
 *
 * @param req
 * @param res
 */
module.exports.putItem = function (req, res) {
  let update = req.body
  const option = {
    new: true
  }
  Battery.findByIdAndUpdate(
        req.params.id,
        {$set: update},
        option,
        (err, item) => {
          if (err) {
            return res.send({ error: err })
          }
          return res.status(httpStatus.OK).json(item)
        })
}

/**
 * Delete a battery.
 *
 * DELETE /battery/:id
 *
 * @param req
 * @param res
 */
module.exports.deleteItem = function (req, res) {
  Battery.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return res.send({ error: err })
    }

    return res.status(httpStatus.NO_CONTENT).json()
  })
}
