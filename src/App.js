import {useState} from "react";
import Canvas from "./Canvas";
import * as Tone from "tone";
import IconButton from "@mui/material/IconButton";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import useBall from "./useBall";

const App = () => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [velocity, setVelocity] = useState(200);

  const {draw} = useBall({radius: 12, color: "blue"});

  const synth = new Tone.PolySynth().toDestination();
  isMuted ? (Tone.Destination.mute = true) : (Tone.Destination.mute = false);

  const handleMuteButtonClick = async () => {
    if (!isAudioReady) {
      await Tone.start();
      setIsAudioReady(true);
    }
    setIsMuted((prevState) => !prevState);
  };

  const renderFrame = (canvas, elapsedTime) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(canvas, ctx, elapsedTime, velocity, synth, isAudioReady);
  };

  return (
    <>
      <Canvas renderFrame={renderFrame} />
      <IconButton onClick={handleMuteButtonClick}>
        {isMuted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
    </>
  );
};

export default App;
