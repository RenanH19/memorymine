import Player from "../../Player";
import MusicManager from "../../audio/MusicManager";
import mapLoader from "../../maps/mapLoader";
import level2Map from "../../maps/maps/level2Map";
import mist from "../../maps/mist";

function level2(p5) {
  let mapBuilt = false;
  let musicFile = '/assets/music/moongate.mp3'
  let player = new Player(p5, 0, 0, 800);
  let { loadMusic, playMusic, stopMusic } = MusicManager(p5, musicFile);
  let { loadMap, buildMap } = mapLoader(p5, level2Map);
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

export default level2;