(function (global) {

	var STORAGE_KEY = "KEEP_SCORE_0000";
	
	function promptViewModel() {
		var self = this;
		
		self.continuePromptSubmit = null;
		self.continuePromptCancel = null;	

		self.prompting = ko.observable(false);
		self.promptQ = ko.observable(null);
		self.promptA = ko.observable(null);
		self.answerHasFocus = ko.observable(false);
		self.promptSubmit = function() {
			if(self.continuePromptSubmit) {
				self.continuePromptSubmit(self.promptA());
			}
			self.cleanup();
		}
		self.promptCancel = function() {
			if(self.continuePromptCancel) {
				self.continuePromptCancel(self.promptA());
			}
			self.cleanup();
		}
		self.onPress = function(data, event) {
			if(event.charCode == 13) {
				// defer submitting until after Knockout updates the "promptA" observable
				setTimeout(function () {
					self.promptSubmit();
				}, 0);
			}
			// allow the keypress default action (i.e. add to the text box)
			return true;
		};
		self.prompt = function(question, defaultText, submit, cancel) {
			if(self.prompting()) {
				throw "Cannot raise another prompt while this one is open";
			}
			self.promptQ(question);
			self.promptA(defaultText);
			self.prompting(true);
			self.continuePromptSubmit = submit;
			self.continuePromptCancel = cancel;
			self.answerHasFocus(true);
		};
		self.cleanup = function() {
			continuePromptSubmit = continuePromptCancel = null;
			self.prompting(false);
		};
	}
	
	global.Prompt = new promptViewModel();

	function keepscoreViewModel() {
		var self = this;
		
		self.players = ko.observableArray([]);
		
		self.incrementScore = function(player) {
			player.score(player.score() + 1);
			self.save();
		}
		
		self.decrementScore = function(player,event) {
			if(event.detail > 1 && event.screenY < -32000)
			{
				// workaround for WP8 bug where hitting Enter in the prompt
				// triggers a phantom double-click of the first player's decrement
				return;
			}
			player.score(player.score() - 1);
			self.save();
		}
		
		self.addPlayer = function() {
			global.Prompt.prompt("New player's name:","", function (newName) {
				self.players.push({
					name: ko.observable(newName),
					score: ko.observable(0)
				});
				self.save();
			});
		}
		
		self.editPlayer = function(player) {
			global.Prompt.prompt("Change name (or blank to delete):",player.name(), function (newName) {
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