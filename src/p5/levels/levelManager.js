function levelManager(p5, level, player, enemy, item){
    this.preload = function(p5) {
        level.preload()
        player.preload();
        enemy.preload();
        item.preload();
    };
    this.draw = function() {
        level.draw();
        player.update();
        player.display();
        enemy.update();
        enemy.display();
        item.update();
        item.display();
    };

}



export default levelManager;
// This class is responsible for managing the levels, including loading the level data, initializing the player, enemy, and item objects, and updating the game state as the player progresses through the level.
// It can also handle level transitions, such as moving to the next level when the player reaches a certain point or completes a specific objective.