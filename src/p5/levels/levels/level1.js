import Player from "../../Player";
import MusicManager from "../../audio/MusicManager";
import mapLoader from "../../maps/mapLoader";
import level1Map from "../../maps/maps/level1Map";
import mist from "../../maps/mist";

function level1(p5) {
  let mapBuilt = false;
  let musicFile = '/assets/music/moongate.mp3'
  let player = new Player(p5, 0, 0, 800);
  let { loadMusic, playMusic, stopMusic } = MusicManager(p5, musicFile);
  let { loadMap, buildMap } = mapLoader(p5, level1Map);
  let mistInstance = new mist(p5, 800, 640);

  function loadLevel() {
    player.loadPlayer();
    loadMap();
    loadMusic();
    mistInstance.loadMist();
  }

  function runLevel(){

  
    buildMap();
    player.getPlayerSprites();
    player.display();
    player.update();
    mistInstance.buildMist();
    playMusic();
    
  }

  return{
    loadLevel,
    runLevel,
  };
}

export default level1;