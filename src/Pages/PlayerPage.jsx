import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FiHeart, FiShare2, FiArrowLeft } from "react-icons/fi";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("background-image.jpg") center center / cover no-repeat;
  background-size: cover;
`;

const Container = styled.div`
  width: 90%;
  max-width: 400px;
  padding: 20px;
  text-align: center;
  color: #fff;
  border-radius: 25px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #f4a261;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Avatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  border: 3px solid #fff;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const AudioControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TimeBar = styled.input`
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }
`;

const TimeDisplay = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
`;

const PlaybackControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 10px;
`;

const PlayerButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #f4a261;
  }
`;

const PlayerPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Background>
      <Container>
        <Header>
          <IconButton>
            <FiArrowLeft />
          </IconButton>
          <IconButton>
            <FiHeart />
          </IconButton>
          <IconButton>
            <FiShare2 />
          </IconButton>
        </Header>

        <Profile>
          <Avatar>
            <AvatarImage
              src="https://via.placeholder.com/70"
              alt="Profile"
            />
          </Avatar>
          <ProfileName>Александра Астахова</ProfileName>
        </Profile>

        <AudioControls>
          <TimeBar
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
          <TimeDisplay>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeDisplay>

          <PlaybackControls>
            <PlayerButton onClick={() => (audioRef.current.currentTime -= 15)}>
              ⏪ 15 с
            </PlayerButton>
            <PlayerButton onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶️"}
            </PlayerButton>
            <PlayerButton onClick={() => (audioRef.current.currentTime += 15)}>
              15 с ⏩
            </PlayerButton>
          </PlaybackControls>
        </AudioControls>

        <audio
          ref={audioRef}
          src="your-audio-file.mp3"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </Container>
    </Background>
  );
};

export default PlayerPage;
