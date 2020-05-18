# Lightbot-util (Library)
The Library that generates the pictures for Lightbot, and also manage the player database.



## Used by:

* [Lightbot for Mastodon](https://github.com/narFnarF/lightbot-mastodon)
* and soon by [Lightbot for Discord](https://github.com/narFnarF/lightbot)

## Installation:

`npm install git://github.com/narFnarF/lightbot-util.git#v0.1.1`

## Usage:

### Initialize:

```javascript
const pm = require('lightbot-util').PlayerManager;
pm.init("path/to/file.json", "admin id"); //
```



#### PlayerManager.getOrCreatePlayer()

Will get the player if it exists or create a new one if it doesn't.

args:

* userID: string
* name : string

Returns: Player

```javascript
const player = pm.getOrCreatePlayer("123456", "Toto");
console.log(`Player name:${player.name}.`); // Player name: Toto
console.log(`Player level: ${player.level}.`); // Player level: 1
console.log(player.allowedToPlay()); //true
```



#### Player.allowedToPlay()

As the player waited long enough to play again?

Returns : boolean

