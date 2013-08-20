(function (global) {

	var STORAGE_KEY = "KEEP_SCORE_0000";
	
	var continuePromptSubmit = null;
	var continuePromptCancel = null;
	
	function keepscoreViewModel() {
		var self = this;
		
		self.players = ko.observableArray([]);
		
		self.prompting = ko.observable(false);
		self.promptQ = ko.observable(null);
		self.promptA = ko.observable(null);
		self.promptSubmit = function() {
			if(continuePromptSubmit) {
				continuePromptSubmit(self.promptA());
			}
			continuePromptSubmit = continuePromptCancel = null;
			self.prompting(false);
		}
		self.promptCancel = function() {
			if(continuePromptCancel) {
				continuePromptCancel(self.promptA());
			}
			continuePromptSubmit = continuePromptCancel = null;
			self.prompting(false);
		}
		
		self.incrementScore = function(player) {
			player.score(player.score() + 1);
			self.save();
		}
		
		self.decrementScore = function(player) {
			player.score(player.score() - 1);
			self.save();
		}
		
		self.addPlayer = function() {
			ksPrompt("New player's name:","", function (newName) {
				self.players.push({
					name: ko.observable(newName),
					score: ko.observable(0)
				});
				self.save();
			});
		}
		
		self.editPlayer = function(player) {
			ksPrompt("Change name (or blank to delete):",player.name(), function (newName) {
				if (newName != "") {
					player.name(newName);
				} else {
					if(confirm("Really delete player '"+player.name()+"'?")) {
						self.players.remove(player);
					}
				}
				self.save();
			});
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

	var ksOnPress = function(event) {
		if(event.charCode == 13) {
			// defer pressing the submit key until after Knockout updates
			// the "promptA" observable
			setTimeout(function () {
				document.getElementById("save").click();
			}, 0);
		}
	};
	var ksPrompt = function(question, defaultText, submit, cancel) {
		if(global.KeepScore.prompting()) {
			throw "Cannot raise another prompt while one is open";
		}
		global.KeepScore.promptQ(question);
		global.KeepScore.promptA(defaultText);
		global.KeepScore.prompting(true);
		continuePromptSubmit = submit;
		continuePromptCancel = cancel;
		document.getElementById("prompt-answerbox").focus();
		document.getElementById("prompt-answerbox").addEventListener("keypress", ksOnPress);
	};

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