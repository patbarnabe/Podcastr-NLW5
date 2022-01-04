import { createContext } from "react";

type Episode = {
    title: string, 
    thumbnail: string,
    members: string,
    duration: number,
    url: string,
};

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    play: (episode: Episode) => void,
};

export const PlayerContext = createContext({} as PlayerContextData); // Formato dos dados que o contexto irá iniciar.