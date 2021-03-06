import { useEffect, useState } from "react";
import Player from "../types/Player";
import serverFetch from "../utils/serverFetch";

const usePersistence = (
  roomId: string | undefined,
  setPlayer: (player: Player | null) => void,
) => {
  const [fetching, setFetching] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    const initialFetch = async () => {
      setToken(sessionToken);

      if (sessionToken) {
        const player = (await serverFetch(sessionToken).get<Player>('/current_player')).body;

        if (player.lobby_id !== roomId) {
          sessionStorage.removeItem('token');
          setToken(null);
        } else {
          setPlayer(player);
        }
      }

      setFetching(false);
    }

    setPlayer(null);

    initialFetch();
  }, [roomId, setPlayer]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    }
  }, [token]);

  let tokenFetch;

  if (token) {
    tokenFetch = serverFetch(token);
  }

  return { token, fetching, setFetching, setToken, tokenFetch };
};

export default usePersistence;
