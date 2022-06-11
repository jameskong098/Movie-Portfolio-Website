'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var FilmSchema = Schema( {
  userId: ObjectId,
  hrefLink: String,
  description:String,
} );

module.exports = mongoose.model( 'Film', FilmSchema );