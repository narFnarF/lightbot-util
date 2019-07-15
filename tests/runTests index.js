"use strict";

const util = require('../index.js');

console.log(util.LightPicture);

const LightPicture = util.LightPicture;
const lp = new LightPicture(5, "yo.png", ()=>{
    console.log(lp);
    
});