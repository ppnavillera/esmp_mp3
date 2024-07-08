// src/Mp3Player.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Mp3Player = () => {
  const [mp3Links, setMp3Links] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchMp3Links();
  }, []);

  const fetchMp3Links = async () => {
    const notionDatabaseId = process.env.REACT_APP_NOTION_DATABASE_ID;
    const notionToken = process.env.REACT_APP_NOTION_TOKEN;

    try {
      const response = await axios.post(
        `/api/v1/databases/${notionDatabaseId}/query`,
        {},
        {
          headers: {
            Authorization: `Bearer ${notionToken}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
        }
      );
      const songs = response.data.results.map((page) => {
        console.log(page.properties.Link.url);
        return {
          name: page.properties.Song.title[0].text.content,
          url: page.properties.Link.url,
        };
      });

      setMp3Links(songs);
    } catch (error) {
      console.error("Error fetching data from Notion:", error);
    }
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleUrlChange = (url) => {
    setCurrentUrl(url);
    setPlaying(false);
  };

  return (
    <div>
      <h1>MP3 플레이어</h1>
      {true ? (
        <div>
          <select onChange={(e) => handleUrlChange(e.target.value)}>
            <option value="">MP3 파일을 선택하세요</option>
            {mp3Links.map((link, index) => (
              <option key={index} value={link.url}>
                {link.name}
              </option>
            ))}
          </select>
          {currentUrl && (
            <div>
              <audio controls src={currentUrl} autoPlay={playing}>
                Your browser does not support the audio element.
              </audio>
              <button onClick={handlePlay}>재생</button>
              <button onClick={handlePause}>일시정지</button>
            </div>
          )}
        </div>
      ) : (
        <p>노션에서 데이터를 불러오는 중...</p>
      )}
    </div>
  );
};

export default Mp3Player;
