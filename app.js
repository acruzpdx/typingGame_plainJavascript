var app = (function(){

    function init() {
        controller.setView(view);
        controller.setModel(model)
        view.setController(controller);
        model.setController(controller);
    }
    function startGame() {
        controller.startGame();
    }

    return {
        init : init,
        startGame : startGame
    };
})();
window.addEventListener("load",function(){
	app.init();
	app.startGame();
});

