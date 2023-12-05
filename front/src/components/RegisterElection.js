import * as React from 'react';
import { useNavigate } from "react-router-dom";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import {
  Box,
  Card,
} from '@mui/material';
import { toast } from 'react-toast';

import { registerElection } from '../services/electionService'
import { useAuth } from "../provider/AuthProvider";

export default function RegisterElection() {
  const [ nome, setNome ] = React.useState('');
  const [ descricao, setDescricao ] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/admin/elections');
  };

  const registerNewElection = (ev) => {
    ev.preventDefault();
    setLoading(true);
    registerElection(nome, descricao, token)
      .then(() => {
        toast.success("Eleição cadastrada com sucesso.");
        goBack();
      })
      .catch(err => {
        toast.error(err.response.data.error);
        setLoading(false);
      });
  };

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
      <Modal
        open={loading}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CircularProgress
          size={48}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      </Modal>
      <Card sx={{ m: "auto", mt: 3, width: "100%" }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" color="text.secondary">
            Insira o nome e descrição para a nova eleição:
          </Typography>
          <TextField sx={{ maxWidth: "80%", m: "auto", mt: 3 }} id="standard-basic" label="Nome" variant="standard" 
            onInput={e => setNome(e.target.value)}
            value={nome}
          />
          <TextField sx={{ maxWidth: "80%", m: "auto", mt: 3 }} id="standard-basic" label="Descrição" variant="standard" 
            onInput={e => setDescricao(e.target.value)}
            value={descricao}
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
          <Button onClick={goBack} variant="contained" color="secondary">Voltar</Button>
          <Button onClick={registerNewElection}
            disabled={descricao.length == 0 || nome.length == 0 || loading} variant="contained" color="primary">Cadastrar</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
