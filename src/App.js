import {useState} from "react";
import Canvas from "./Canvas";
import * as Tone from "tone";
import IconButton from "@mui/material/IconButton";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import useBall from "./useBall/useBall";
import Slider from "@mui/material/Slider";

const synth = new Tone.PolySynth().toDestination();

const App = () => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [speed, setSpeed] = useState(200);

  const {step} = useBall({radius: 12, color: "blue"});

  isMuted ? (Tone.Destination.mute = true) : (Tone.Destination.mute = false);

  const handleMuteButtonClick = async () => {
    if (!isAudioReady) {
      await Tone.start();
      setIsAudioReady(true);
    }
    setIsMuted((prevState) => !prevState);
  };

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
  };

  const renderFrame = (canvas, elapsedTime) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    step(canvas, ctx, elapsedTime, speed, synth, isAudioReady);
  };

  return (
    <>
      <Canvas renderFrame={renderFrame} />
      <IconButton
        onClick={handleMuteButtonClick}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeOff /> : <VolumeUp />}
      </IconButton>
      <Slider
        aria-label="Speed"
        value={speed}
        onChange={handleSpeedChange}
        min={100}
        max={1000}
        defaultValue={200}
      />
    </>
  );
};

export default App;
