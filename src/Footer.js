import React from "react";
import "./Footer.css";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatIcon from "@material-ui/icons/Repeat";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import { Slider, Grid } from "@material-ui/core";
import { useDataLayerValue } from "./DataLayer";
import { useEffect } from "react";

function Footer({spotify}) {
  const [{ item, playing }, dispatch] = useDataLayerValue();

  useEffect(() => {
    spotify.getMyCurrentPlaybackState().then((response) => {
      dispatch({
        type: "SET_PLAYING",
        playing: response.is_playing,
      });

      dispatch({
        type: "SET_ITEM",
        item: response.item,
      })
    })
  }, [spotify]);

  const handlePlayPause = () => {
    if (playing) {
      spotify.pause();
      dispatch({
        type: "SET_PLAYING",
        playing: false,
      })
    } else {
      spotify.play();
      dispatch({
        type: "SET_PLAYING",
        playing: true,
      })
    }
  }

  const skipNext = () => {
    spotify.skipToNext();
    spotify.getMyCurrentPlayingTrack().then((res) => {
      dispatch({
        type: "SET_ITEM",
        item: res.item,
      });

      dispatch({
        type: "SET_PLAYING",
        playing: true,
      })
    })
  }

  const skipPrevious = () => {
    spotify.skipToPrevious();
    spotify.getMyCurrentPlayingTrack().then((res) => {
      dispatch({
        type: "SET_ITEM",
        item: res.item,
      });
      dispatch({
        type: "SET_PLAYING",
        playing: true,
      })
    })
  };

  console.log('🪁', item);

  return (
    <div className="footer">
      <div className="footer__left">
        <img
          src={item?.album.images[0].url}
          className="footer__albumLogo"
          alt={item?.name}
        />

        {
          item ? (
        <div className="footer__songInfo">
              <h4>{item.name}</h4>
              <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
        </div>
          ) : (
              <div className="footer__songInfo">
                <h4>No song is playing</h4>
                <p>...</p>
              </div>
          )
        }
      </div>

      <div className="footer__center">
        <ShuffleIcon className="footer__green" />
        <SkipPreviousIcon className="footer__icon" onClick={skipNext} />

        {
          playing ? (
          <PauseCircleOutlineIcon fontSize="large" className="footer__icon" onClick={handlePlayPause}/>
        ) : (
            <PlayCircleOutlineIcon fontSize="large" className="footer__icon" onClick={handlePlayPause} />
        )
        }

        <SkipNextIcon className="footer__icon" onClick={skipPrevious}/>
        <RepeatIcon className="footer__green" />
      </div>

      <div className="footer__right">
        <Grid container spacing={2}>
          <Grid item>
            <PlaylistPlayIcon />
          </Grid>
          <Grid item>
            <VolumeDownIcon />
          </Grid>
          <Grid item xs>
            <Slider aria-labelledby="continuous-slider"/>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Footer;
