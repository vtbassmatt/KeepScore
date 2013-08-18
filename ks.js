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
	}
	
	global.KeepScore = new keepscoreViewModel();

})(window);