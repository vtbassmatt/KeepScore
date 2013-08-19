(function (global) {

	var STORAGE_KEY = "KEEP_SCORE_0000";

	function keepscoreViewModel() {
		var self = this;
		
		self.players = ko.observableArray([]);
		
		self.incrementScore = function(player) {
			player.score(player.score() + 1);
			self.save();
		}
		
		self.decrementScore = function(player) {
			player.score(player.score() - 1);
			self.save();
		}
		
		self.addPlayer = function() {
			var newName = prompt("New player's name:","");
			if (newName!=null && newName!="") {
				self.players.push({
					name: ko.observable(newName),
					score: ko.observable(0)
				});
			}
			self.save();
		}
		
		self.editPlayer = function(player) {
			var newName = prompt("Change name (or blank to delete):",player.name());
			if (newName != null && newName != "") {
				player.name(newName);
			} else {
				if(confirm("Really delete player '"+player.name()+"'?")) {
					self.players.remove(player);
				}
			}
			self.save();
		}
		
		self.zeroScores = function() {
			if(confirm("Really zero scores?")) {
				for(var idx in self.players()) {
					self.players()[idx].score(0);
				}
				self.save();
			}
		}
		
		self.removeEveryone = function() {
			if(confirm("Really remove everyone?")) {
				self.players.removeAll();
				try {
					$.jStorage.deleteKey(STORAGE_KEY);
				} catch(e) { }
				self.save();
			}
		}
		
		self.save = function() {
			var jString = ko.toJSON(self);
			$.jStorage.set(STORAGE_KEY, jString);
		}
	}
	
	global.KeepScore = new keepscoreViewModel();

	var value = $.jStorage.get(STORAGE_KEY);
	if(value) {
		global.KeepScore.players.removeAll();
		var database = JSON.parse(value);
		for(var idx in database.players) {
			global.KeepScore.players.push({
				name: ko.observable(database.players[idx].name),
				score: ko.observable(database.players[idx].score)
			});
		}
	}

})(window);