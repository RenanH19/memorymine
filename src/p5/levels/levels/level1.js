import Player from "../../Player";
import MusicManager from "../../audio/MusicManager";
import mapLoader from "../../maps/mapLoader";
import level1Map from "../../maps/maps/level1Map";

function level1(p5) {
  this.p5 = p5;
  this.musicFile = '/assets/music/moongate.mp3';
  let player = new Player(p5, 100, 100, 800);
  let { loadMusic, playMusic, stopMusic } = MusicManager(p5, this.musicFile);
  let { loadMap, buildMap } = mapLoader(p5, level1Map);

  function loadLevel() {
    loadMap();
    loadMusic();
  }

  function runLevel(){

    player.display();
    player.update();
    buildMap();
    playMusic();
  }

  return{
    loadLevel,
    runLevel,
  };
}

export default level1;