import React, { Component } from 'react';
import axios from 'axios';

export class NowPlaying extends Component {
    state = {
        recentTracks: [],
        nowplaying: {},
        isPlaying: false,
        artist: null,
        song: null,
        image: null
    }

    componentDidMount() {
        this.interval = setInterval(this.getData, 10000);
        this.getData();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getData = async () => {
        const key = process.env.REACT_APP_API_KEY;
        const username = process.env.REACT_APP_USERNAME;
        if (key)
            axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${key}&format=json&limit=15`)
                .then(res => {
                    const recentTracks = res.data.recenttracks;
                    this.setState({ recentTracks });
                    const nowplaying = recentTracks.track[0];
                    const image = nowplaying.image[2]["#text"];
                    this.setState({ image });

                    if (nowplaying["@attr"] && nowplaying["@attr"].nowplaying === "true") {
                        const artist = nowplaying.artist["#text"];
                        const song = nowplaying.name;
                        this.setState({ artist });
                        this.setState({ song });
                        this.setState({ nowplaying });
                        console.log(nowplaying);
                        this.setState({ isPlaying: true });
                    } else {
                        this.setState({ isPlaying: false });
                        this.setState({ artist: null });
                        this.setState({ song: null });
                        this.setState({ nowplaying: null });
                    }
                });
    }

    renderRecentlyPlayedSongs = (songs) => {
        if (songs && songs.track) {
            if (this.state.isPlaying) {
                return (
                    <>
                        <text x="170" y="20" fontSize="15" fontWeight="bold" fill="black">Now listening...</text>
                        {
                            songs.track.slice(1, songs.track.length)
                                .map((track, index) => <text key={index} x="170" y={80 + (20 * index)} fontSize="10" fill="gray">{track.artist["#text"]} - {track.name}</text>)
                        }
                    </>
                )
            } else {
                return (
                    <>
                        <text x="170" y="20" fontSize="15" fontWeight="bold" fill="black">Recently listened...</text>
                        {
                            songs.track.map((track, index) => <text key={index} x="170" y={40 + (20 * index)} fontSize="10" fill="gray">{track.artist["#text"]} - {track.name}</text>)
                        }
                    </>
                )
            }
        }
    }

    render() {
        const renderNowPlaying = () => {
            if (this.state.isPlaying) {
                return (
                    <>
                        <text x="170" y="45" fontSize="25" fontWeight="bold" fill="black">{this.state.artist}</text>
                        <text x="170" y="65" fontSize="15" fill="#2f80ed">{this.state.song}
                            <animate attributeName="x" begin="4;id1.end+4" from="50%" to="100%" dur="7s" keyTimes="0;1" repeatCount="indefinite" fill="freeze" />
                        </text>
                    </>)
            }
        }
        return (

            <svg
                width="400"
                height="170"
                viewBox="0 0 400 170"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g data-testid="main-card-body">
                    <rect
                        data-testid="card-bg"
                        x="0.5"
                        y="0.5"
                        rx="4.5"
                        height="99%"
                        stroke="#E4E2E2"
                        width="399"
                        strokeOpacity="1"
                    />
                    <defs>
                        <clipPath id="circleView">
                            <circle cx="250" cy="125" r="125" fill="#FFFFFF" />
                        </clipPath>
                    </defs>


                    {renderNowPlaying()}
                    <image x="10" y="10" width="150" height="150" href={this.state.image} ></image>
                    {this.renderRecentlyPlayedSongs(this.state.recentTracks)}
                </g>
            </svg >
        );
    }
}
