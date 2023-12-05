import * as React from 'react';
import { useEffect } from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Card,
  FormControl,
  FormHelperText,
  InputLabel,
  Input,
  IconButton,
  InputAdornment
} from '@mui/material';
import { toast } from 'react-toast';

import { registerVote } from '../services/electionService'
import VoteModal from './VoteModal';
import crypto from 'crypto';

function gerarNumeroAleatorio(primoString) {
  if (!primoString || primoString.length == 0)
    return 0

  const primoP = BigInt(primoString);
  // Gera um buffer aleatório com o mesmo comprimento em bytes que P
  const buffer = crypto.randomBytes(Math.ceil(primoString.length / 8));

  // Converte o buffer para um número inteiro
  const numeroAleatorio = BigInt(`0x${buffer.toString('hex')}`);

  // Calcula o número aleatório no intervalo [1, P-1]
  const resultado = numeroAleatorio % (primoP - BigInt(1)) + BigInt(1);

  return resultado;
}

export default function RegisterVote({ election }) {

  const [ identity, setIdentity ] = React.useState('');
  const [ vote, setVote ] = React.useState('');
  const [ r, setR ] = React.useState('');
  const [ registered, setRegistered ] = React.useState(false);

  const registerVoteIntoElection = (ev) => {
    ev.preventDefault();
    registerVote(election.id, identity, vote, r)
      .then(() => {
        setRegistered(true);
      }).catch(err => {
        toast.error(err.response.data.error)
      });
  }

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const toClipBoard = (text) => {navigator.clipboard.writeText(text)}
  const baseUrl = window.location.href.split('/#/')[0]
  const checkElectionLink = (id) => `${baseUrl}/#/vote/${id}`

  useEffect(() => {
    const numeroAleatorio = gerarNumeroAleatorio(election.p);
    setR(numeroAleatorio.toString());
  }, [election]);

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <VoteModal r={r} voto={vote} registered={registered} />
      <Card sx={{ m: "auto", mt: 3, width: "100%" }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" color="text.secondary">
            Insira sua identificação e voto abaixo para registrar seu voto:
          </Typography>
          <TextField sx={{ mt: 3 }} id="standard-basic" label="Identificação como eleitor" variant="standard" 
            onInput={e => setIdentity(e.target.value)}
            value={identity}
          />
          <TextField sx={{ mt: 3 }} id="standard-basic" label="Seu voto" variant="standard" 
            onInput={e => setVote(e.target.value)}
            value={vote}
          />
          <TextField sx={{ mt: 3 }} id="standard-basic" label="R aleatório" variant="standard" 
            value={r} disabled type='textarea'
          />
        </CardContent>
        <CardActions sx={{
              display: 'flex',
              justifyContent: 'space-around',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}>
          <Button onClick={registerVoteIntoElection}
            disabled={registered || vote.length == 0 || identity.length == 0} variant="contained" color="primary">Votar</Button>
        </CardActions>
      </Card>

      <Card sx={{ m: "auto", mt: 3, width: "100%" }} >
        <CardContent>
          {/* URL para o participante acompanhar o sorteio do amigo oculto */}
          <FormControl sx={{ m: 1, width: "100%" }} variant="outlined" disabled >
            <InputLabel htmlFor="outlined-adornment-password">URL do Eleitor</InputLabel>
            <Input
              type='text'
              variant="standard"
              disabled
              value={checkElectionLink(election.id)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="copy url"
                    onClick={() => toClipBoard(checkElectionLink(election.id))}
                    onMouseDown={handleMouseDown}
                    edge="end"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>
              Copie e salve essa URL para acompanhar o resultado da eleição
            </FormHelperText>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );
}
