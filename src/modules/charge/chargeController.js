'use strict'

const httpStatus = require('http-status-codes')
const Charge = require('./chargeModel')

/**
 * get charge detail
 * 
 * get 
 */



 /**
  * get charges
  * get /charge?owner=<user_id>
  * @param req
  * @param res
  */
module.exports.getItems = function(req,res) {
  const query = {}
  if (req.query.owner) {
    query.owner = req.query.owner
  }
  Charge
    .find(query)
    .sort('created_at')
    .exec((err,items) => {
      if(err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error:err})
      }
      return res.status(httpStatus.OK).json(items)
    })
}

/**
 * Get charge Detail.
 *
 * GET /charge/:id
 *
 * @param req
 * @param res
 */
module.exports.getItem = function(req,res) {
  if(!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).send({error: 'ID is required'})
  }

  Charge.findById(
    req.params.id,
    (err,item) => {
      if(err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: err})        
      }
      if(!item) {
        return res.status(httpStatus.NOT_FOUND).send({error: 'charge Not Found'})        
      }
      return res.status(httpStatus.OK).json(item)
    }
  )
}

/**
 * Create a charge.
 *
 * POST /charge
 *
 * @param req
 * @param res
 */
module.exports.postItem = function(req,res) {
  const newItem = new Charge({
    name: req.body.name,
    owner: req.body.user_id,
    using: req.body.using,
    power: req.body.power,
    voltage: req.body.voltage,
    booking: req.body.booking,
    location: req.body.location
  })
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
 * Edit charge.
 *
 * PUT /charge/:id
 *
 * @param req
 * @param res
 */
module.exports.putItem = function (req, res) {
  let update = req.body
  const option = {
    new: true
  }
  Charge.findByIdAndUpdate(
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
 * Delete a charge.
 *
 * DELETE /charge/:id
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
