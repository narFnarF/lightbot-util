"use strict";

// var logger = require('./logger.js');
const PlayerManager = require("./PlayerManager.js")
const fs = require("fs");

runTests();

function test(left, right, nb) {
	var verbose = false;
	var successful = (left === right);
	if (verbose) {
		console.debug(`Test #${nb} ${successful}  ${left} == ${right}`);
	}

	if (!successful) {
		console.warn(`Test #${nb} Result: ${left} != ${right}` );
	}
	return successful;
}

function runTests() {
	const dbPath = `./db.json`;
	const admin = `${Math.random()}`
	if (fs.existsSync(dbPath)) {
		fs.renameSync(dbPath, "./db_OLD.json");
	}
	
	const pm = require('./PlayerManager.js');
	pm.init(dbPath, admin);

	const bullshitID = `${Math.round(Math.random()*1000000000000000)}bullshit`;
	const bullshitName = "bullshit_name";

	test(pm.exists(`doesn't exist ${Math.random()}`), false, 1);
	var first_bullshit = pm.createPlayer(bullshitID, bullshitName);
	console.debug(`Try to create another identical player. Should display a warning:`)
	var second_bullshit = pm.createPlayer(bullshitID, bullshitName);
	test(pm.exists(bullshitID), true, 2);
	test(first_bullshit, second_bullshit, 2.5);

	test(pm.getPlayer(bullshitID).name, bullshitName, 3);
	test(pm.getPlayer("existe pas"), undefined, 4.5);

	var p = pm.getOrCreatePlayer("123456789123456new", "newName");
	test(p.name, "newName", 5);
	p = pm.getOrCreatePlayer(bullshitID);
	test(p.name, bullshitName, 6);

	p.increaseLevel();
	test(p.level, 2, 7);

	test(p.allowedToPlay(), true, 8);
	p.updateLastPlayed();
	test(p.allowedToPlay(), false, 9);

	test(p.relight, undefined, 10);
	p.increaseRelightCount();
	test(p.relight, 1, 11);

	test( pm.isAdmin(bullshitID), false, 12);
	test( pm.isAdmin(admin), true, 13);


	pm.writeDBFile();
	console.debug(`Try to double write. Should display lots of warning:`);
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();
	pm.writeDBFile();

	pm.exit()
	console.debug(`All tests completed. Est-ce que y'avait des warnings?`);
}
