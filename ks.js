(function (global) {

	var STORAGE_KEY = "KEEP_SCORE_0000";
	
	function promptViewModel(rootElementSelector) {
		var self = this;
		
		self.rootElementSelector = rootElementSelector;
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
		self.onPress = function(event) {
			if(event.charCode == 13) {
				// defer pressing the submit key until after Knockout updates
				// the "promptA" observable
				setTimeout(function () {
					document.querySelector(self.rootElementSelector).querySelector("button.prompt-save-button").click();
				}, 0);
			}
		};
		self.prompt = function(question, defaultText, submit, cancel) {
			if(self.prompting()) {
				throw "Cannot raise another prompt while this one is open";
			}
			var root = document.querySelector(self.rootElementSelector);
			
			if(!root.getAttribute("data-bind")) {
				root.setAttribute("data-bind", "if: prompting");
				root.innerHTML = "<span data-bind=\"text: promptQ\"></span>\n"
								+ "<input class=\"prompt-answerbox\" type=\"text\" data-bind=\"hasFocus: answerHasFocus, value: promptA\"></input>"
								+ "<button class=\"prompt-save-button\" data-bind=\"click: promptSubmit\">Save</button>"
								+ "<button class=\"prompt-cancel-button\" data-bind=\"click: promptCancel\">Cancel</button>";
				ko.applyBindings(self, root);
			}
			
			self.promptQ(question);
			self.promptA(defaultText);
			self.prompting(true);
			self.continuePromptSubmit = submit;
			self.continuePromptCancel = cancel;
			self.answerHasFocus(true);
			root.querySelector(".prompt-answerbox").addEventListener("keypress", self.onPress);
		};
		self.cleanup = function() {
			continuePromptSubmit = continuePromptCancel = null;
			self.prompting(false);
		};
	}
	
	function keepscoreViewModel() {
		var self = this;
		
		self.players = ko.observableArray([]);
		
		self.prompt = new promptViewModel("#prompt-root");
		
		self.incrementScore = function(player) {
			player.score(player.score() + 1);
			self.save();
		}
		
		self.decrementScore = function(player) {
			player.score(player.score() - 1);
			self.save();
		}
		
		self.addPlayer = function() {
			self.prompt.prompt("New player's name:","", function (newName) {
				self.players.push({
					name: ko.observable(newName),
					score: ko.observable(0)
				});
				self.save();
			});
		}
		
		self.editPlayer = function(player) {
			self.prompt.prompt("Change name (or blank to delete):",player.name(), function (newName) {
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