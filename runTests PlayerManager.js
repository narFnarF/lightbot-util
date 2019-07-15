"use strict";

// var logger = require('./logger.js');
const PlayerManager = require("./PlayerManager.js")
const fs = require("fs");

var allTestsSuccessful = true;

var result = runTests();
if (result) {
	console.log("All tests were good! ✌️ ");
} else {
	console.log("One or more tests failed. Check the logs. ❌");
}

function test(left, right, nb) {
	var verbose = true;
	var successful = (left === right);
	if (verbose) {
		console.debug(`Test #${nb} ${successful}  ${left} == ${right}`);
	}

	if (!successful) {
		console.warn(`❌Test #${nb} Result: ${left} != ${right}` );
		allTestsSuccessful = false;
	}
	return successful;
}

function runTests() {
	// ----------------------- 1st batch of tests: without initialisation  ---------------------
	const pmNotInit = require('./PlayerManager.js');
	
	try {
		pmNotInit.getPlayer("whatever");
		test("always", "fail", 101); // This always fail, but it should not run because the line before should throw an error and go to catch.
	} catch(error){
		test(error.name, "PLAYER_MANAGER_NOT_INIT", 101.5);
	}

	try {
		pmNotInit.getOrCreatePlayer("whatever");
		test("always", "fail", 102); // This always fail, but it should not run. That's the point! 
	} catch(error) {
		test(error.name, "PLAYER_MANAGER_NOT_INIT", 102.5);
	}
	
	try {
		pmNotInit.exists("whatever");
		test("always", "fail", 103); // This always fail, but it should not run. That's the point! 
	} catch(error){
		test(error.name, "PLAYER_MANAGER_NOT_INIT", 103.5);
	}
	

	// ------------ Test on a DB that is completely blank (by removing the existing one)
	const dbPath = `./db.json`;
	const admin = `${Math.random()}`
	if (fs.existsSync(dbPath)) {
		fs.renameSync(dbPath, "./db_OLD.json");
	}
	
	const pm = require('./PlayerManager.js');
	pm.init(dbPath, admin);


	// ---------------------  Test all functions--------------------------------------------
	const bullshitID = `${Math.round(Math.random()*1000000000000000)}bullshit`;
	const bullshitName = "bullshit_name";

	test(pm.exists(`doesn't exist ${Math.random()}`), false, 201);
	var first_bullshit = pm.createPlayer(bullshitID, bullshitName);
	console.debug(`Try to create another identical player. Should display a warning:`)
	var second_bullshit = pm.createPlayer(bullshitID, bullshitName);
	test(pm.exists(bullshitID), true, 202);
	test(first_bullshit, second_bullshit, 202.5);

	test(pm.getPlayer(bullshitID).name, bullshitName, 203);
	test(pm.getPlayer("existe pas"), undefined, 204.5);

	var p = pm.getOrCreatePlayer("123456789123456new", "newName");
	test(p.name, "newName", 205);
	p = pm.getOrCreatePlayer(bullshitID);
	test(p.name, bullshitName, 206);

	p.increaseLevel();
	test(p.level, 2, 207);

	test(p.allowedToPlay(), true, 208);
	p.updateLastPlayed();
	test(p.allowedToPlay(), false, 209);

	test(p.relight, undefined, 210);
	p.increaseRelightCount();
	test(p.relight, 1, 211);

	test( pm.isAdmin(bullshitID), false, 212);
	test( pm.isAdmin(admin), true, 213);


	pm.writeDBFile();
	console.debug(`Try to double write. Should display lots of warning:`);
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();

	pm.exit()
	
	// ----------------------- 2ème batch de tests: Utiliser une DB qui existe déjà ----------
	
	const pm2 = require('./PlayerManager.js');
	const dbPath2 = `./testDB.json`;
	const admin2 = `${Math.random()}`;
	
	pm2.init(dbPath2, admin2);

	test(pm2.exists(`id which doesn't exist for sure ${Math.random()}`), false, 301);
	test(pm2.exists(`214593608727355393x`), true, 302);
	test(pm2.exists(`230367418756087809x`), true, 302.5);

	test( pm2.getOrCreatePlayer("214593608727355393x", "narF").name, "narF", 303 );
	test( pm2.getOrCreatePlayer("214593608727355393x", "narF").level, 16, 304 );

	var pl = pm2.getPlayer("214593608727355393x");
	test( pl.allowedToPlay(), true, 305)

	test( pm2.isAdmin("bullshitID"), false, 306);
	
	pm2.exit()

	

	// ------------------------
	console.debug(`All tests completed. Est-ce que y'avait des warnings?`);

	return allTestsSuccessful;
}
