import Axios from 'axios';

import generateRandomString from '../utils/generateRandomString';
import getHashParams from '../utils/getHashParams';
import scopesArray from '../utils/scopesArray';

export default class AuthService {
  login = () => {
    const state = generateRandomString(16);
    localStorage.setItem('auth_state', state);

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string);
    url += '&scope=' + encodeURIComponent(scopesArray.join(' '));
    url +=
      '&redirect_uri=' + encodeURIComponent(process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI as string);
    url += '&state=' + encodeURIComponent(state);

    window.location.href = url;
  };

  logout = () => {
    // clear access token, id token and profile
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
  };

  handleAuthentication = () => {
    return new Promise<string>((resolve, reject) => {
      const { access_token, state } = getHashParams();
      const auth_state = localStorage.getItem('auth_state');

      if (state === null || state !== auth_state) {
        reject(new Error("The state doesn't match"));
      }

      localStorage.removeItem('auth_state');

      if (access_token) {
        this.setSession({ accessToken: access_token, expiresIn: 1000 });
        return resolve(access_token);
      } else {
        return reject(new Error('The token is invalid'));
      }
    }).then((accessToken) => this.handleUserInfo(accessToken));
  };

  setSession = (authResult: { expiresIn: number; accessToken: string }) => {
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('expires_at', expiresAt);
  };

  isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') as string);
    return new Date().getTime() < expiresAt;
  };

  handleUserInfo = (accessToken: string) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    return Axios('https://api.spotify.com/v1/me', { headers }).then(({ data }) => {
      this.setProfile(data);
      return data;
    });
  };

  setProfile = (profile) => {
    localStorage.setItem('profile', JSON.stringify(profile));
  };

  getProfile = () => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(localStorage.profile) : {};
  };
}
