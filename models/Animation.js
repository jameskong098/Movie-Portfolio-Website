'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var AnimationSchema = Schema( {
  userId: ObjectId,
  title: String,
  description:String,
  createdAt: Date,
} );

module.exports = mongoose.model( 'Animation', AnimationSchema );