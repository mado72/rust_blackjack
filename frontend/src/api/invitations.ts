import axios from 'axios';
import { Invitation } from '../types/api';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Update with your API base URL

export const createInvitation = async (gameId: string, inviteeEmail: string): Promise<Invitation> => {
    const response = await axios.post(`${API_BASE_URL}/games/${gameId}/invitations`, { invitee_email: inviteeEmail });
    return response.data;
};

export const getInvitations = async (userId: string): Promise<Invitation[]> => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/invitations`);
    return response.data;
};

export const acceptInvitation = async (invitationId: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/invitations/${invitationId}/accept`);
};

export const declineInvitation = async (invitationId: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/invitations/${invitationId}/decline`);
};