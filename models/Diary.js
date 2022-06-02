'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var DiaryEntrySchema = Schema( {
  userId: ObjectId,
  title: String,
  rating: Number,
  description:String,
  createdAt: Date,
} );

module.exports = mongoose.model( 'Diary', DiaryEntrySchema );