'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var AboutSchema = Schema( {
  userId: ObjectId,
  description: String,
} );

module.exports = mongoose.model( 'About', AboutSchema );