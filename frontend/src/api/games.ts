import axios from 'axios';
import { Game, GameResult, PlayerState } from '../types/game';

const API_BASE_URL = 'http://localhost:8080/api/v1/games';

export const createGame = async (emails: string[]): Promise<string> => {
    const response = await axios.post(`${API_BASE_URL}`, { emails });
    return response.data.game_id;
};

export const getGameState = async (gameId: string): Promise<Game> => {
    const response = await axios.get(`${API_BASE_URL}/${gameId}`);
    return response.data;
};

export const drawCard = async (gameId: string, email: string): Promise<{ card: string; currentPoints: number; busted: boolean }> => {
    const response = await axios.post(`${API_BASE_URL}/${gameId}/draw`, { email });
    return response.data;
};

export const setAceValue = async (gameId: string, email: string, cardId: string, asEleven: boolean): Promise<PlayerState> => {
    const response = await axios.put(`${API_BASE_URL}/${gameId}/ace`, { email, cardId, asEleven });
    return response.data;
};

export const finishGame = async (gameId: string): Promise<GameResult> => {
    const response = await axios.post(`${API_BASE_URL}/${gameId}/finish`);
    return response.data;
};

export const getGameResults = async (gameId: string): Promise<GameResult> => {
    const response = await axios.get(`${API_BASE_URL}/${gameId}/results`);
    return response.data;
};