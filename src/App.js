import {useState} from "react";
import Canvas from "./Canvas";
import * as Tone from "tone";
import IconButton from "@mui/material/IconButton";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";

const App = () => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleMuteButtonClick = async () => {
    if (!isAudioReady) {
      await Tone.start();
      setIsAudioReady(true);
    }
    setIsMuted((prevState) => !prevState);
  };

  const synth = new Tone.PolySynth().toDestination();
  isMuted ? (Tone.Destination.mute = true) : (Tone.Destination.mute = false);

  return (
    <>
      <Canvas synth={synth} isAudioReady={isAudioReady} />
      <IconButton onClick={handleMuteButtonClick}>
        {isMuted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
    </>
  );
};

export default App;
