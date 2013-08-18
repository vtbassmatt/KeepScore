(function (global) {

	var keepscoreViewModel = {
		players: ko.observableArray([
			{
				name: ko.observable('Matt'),
				score: ko.observable(15)
			},
			{
				name: ko.observable('Marshall'),
				score: ko.observable(16)
			}
		])
	};
	
	global.KeepScore = keepscoreViewModel;

})(window);