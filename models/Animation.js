'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var AnimationSchema = Schema( {
  userId: ObjectId,
  hrefLink: String,
  description:String,
} );

module.exports = mongoose.model( 'Animation', AnimationSchema );