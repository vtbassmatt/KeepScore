(function (global) {

	function keepscoreViewModel() {
		var self = this;
		
		self.players = ko.observableArray([
			{
				name: ko.observable('Matt'),
				score: ko.observable(15)
			},
			{
				name: ko.observable('Marshall'),
				score: ko.observable(16)
			}
		]);
		
		self.incrementScore = function(player) {
			player.score(player.score() + 1);
		}
		
		self.decrementScore = function(player) {
			player.score(player.score() - 1);
		}
		
		self.addPlayer = function() {
			var newName = prompt("New player's name:","");
			if (newName!=null && newName!="") {
				self.players.push({
					name: ko.observable(newName),
					score: ko.observable(0)
				});
			}
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
		}
		
		self.zeroScores = function() {
			if(confirm("Really zero scores?")) {
				for(var idx in self.players()) {
					self.players()[idx].score(0);
				}
			}
		}
		
		self.removeEveryone = function() {
			if(confirm("Really remove everyone?")) {
				self.players.removeAll();
			}
		}
	}
	
	global.KeepScore = new keepscoreViewModel();

})(window);