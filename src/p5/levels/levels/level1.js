import Player from "../../Player";
import MusicManager from "../../audio/MusicManager";
import mapLoader from "../../maps/mapLoader";
import level1Map from "../../maps/maps/level1Map";

function level1(p5) {
  let musicFile = '/assets/music/moongate.mp3'
  let player = new Player(p5, 0, 0, 800);
  let { loadMusic, playMusic, stopMusic } = MusicManager(p5, musicFile);
  let { loadMap, buildMap } = mapLoader(p5, level1Map);

  function loadLevel() {
    player.loadPlayer();
    loadMap();
    loadMusic();
  }

  function runLevel(){

    buildMap();
    player.display();
    player.update();
    playMusic();
  }

  return{
    loadLevel,
    runLevel,
  };
}

export default level1;