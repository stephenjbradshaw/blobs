import {useState} from "react";
import Canvas from "./Canvas";
import * as Tone from "tone";
import IconButton from "@mui/material/IconButton";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import AddIcon from "@mui/icons-material/Add";
import useCirclesAnimation from "./useCirclesAnimation/useCirclesAnimation";
import Slider from "@mui/material/Slider";

const synth = new Tone.PolySynth().toDestination();

const App = () => {
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [speed, setSpeed] = useState(200);
  const [numberOfCircles, setNumberOfCircles] = useState(1);

  const {step} = useCirclesAnimation({
    color: "blue",
    radius: 12,
    numberOfCircles,
  });

  isMuted ? (Tone.Destination.mute = true) : (Tone.Destination.mute = false);

  const handleMuteButtonClick = async () => {
    if (!isAudioReady) {
      await Tone.start();
      setIsAudioReady(true);
    }
    setIsMuted((prevState) => !prevState);
  };

  const handleAddCircleButtonClick = () => {
    setNumberOfCircles((prevState) => prevState + 1);
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
      <IconButton
        onClick={handleAddCircleButtonClick}
        aria-label={"Add circle"}
      >
        <AddIcon />
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
