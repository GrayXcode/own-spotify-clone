import React from "react";
import { useEffect } from "react";
import "./App.css";
import Login from "./Login";
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./Player";
import { useDataLayerValue } from "./DataLayer";

const spotify = new SpotifyWebApi();

function App() {
  const [{ token }, dispatch] = useDataLayerValue();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";

    const _token = hash["#access_token"]; //Temporary token

    if (_token) {
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      spotify.setAccessToken(_token); // Giving access token to spotify API let me have control

      spotify.getMe().then((currentUser) => {
        dispatch({
          type: "SET_USER",
          user: currentUser,
        });
      });

      spotify.getMyTopArtists().then((res) => {
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: res,
        });
      });

      dispatch({
        type: "SET_SPOTIFY",
        spotify: spotify,
      });

      spotify.getUserPlaylists().then((userPlaylists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: userPlaylists,
        });
      });

      spotify.getPlaylist("6nhAztfj5zsLo2OFeHyTF5").then((response) =>
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        })
      );
    }
  }, [token, dispatch]);

  return (
    <div className="app">
      {/*JSX */}
      {token ? <Player spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;

//Focus
