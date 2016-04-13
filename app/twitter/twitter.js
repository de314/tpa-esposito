"use strict";


let Twitter = require('twitter');

let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY || 'AnMuMYyhtLM1phfpR4Z10cv4y',
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'AzYeJanvwoMByYVCvjij0SPSAIfJr2wBzxSKamrQBRGhWf6YJv',
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY || '3094583300-QvHRvs6A912T8ZtFF3MxTd2iqWOTrSerSJinsrI',
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'bbWD6wcvX8jDndnD3TpB1N1FPKOOG4uJNeyZsZV9AOR6r',
});

module.exports = {
	tClient: client
};