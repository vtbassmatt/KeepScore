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
	}
	
	global.KeepScore = new keepscoreViewModel();

})(window);