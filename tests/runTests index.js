"use strict";

const util = require('../index.js');

const LightPicture = require('../index.js').LightPicture;

console.log(util.LightPicture);

const lp = new LightPicture(2, "tests/output/yo.png", ()=>{
    console.log(lp);
    
});