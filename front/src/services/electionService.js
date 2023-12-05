import axios from 'axios';

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  localStorage.removeItem('token');
  return Promise.reject(error);
});

const BASE_URL = 'http://127.0.0.1:5000'

const getConfig = (token) =>  {
  return {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }
}

const getElections = (token) => {
  return axios.get(`${BASE_URL}/api/list_elections`, getConfig(token))
};

const getElection = (id, token) => {
  return axios.get(`${BASE_URL}/api/get_election/${id}`, getConfig(token))
};

const getVotes = (id, token) => {
  return axios.get(`${BASE_URL}/api/list_votes/${id}`, getConfig(token))
};

const closeElection = (id, token) => {
  return axios.post(`${BASE_URL}/api/finalize_election/${id}`, {}, getConfig(token))
};

const registerVote = (eleicao_id, identificador_eleitor, voto, r) => {
  return axios.post(`${BASE_URL}/api/register_vote`, {
    voto,
    identificador_eleitor,
    r,
    eleicao_id
  }, getConfig(''))
};

const registerElection = (nome, descricao, token) => {
  return axios.post(`${BASE_URL}/api/create_election`, {
    nome,
    descricao
  }, getConfig(token))
};


export {
  closeElection,
  getElections,
  getElection,
  getVotes,
  registerElection,
  registerVote,
};