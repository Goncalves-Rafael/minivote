import * as React from 'react';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
  Box,
  Card
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toast';

import { useAuth } from "../provider/AuthProvider";
import { adminLogin, adminRegister } from '../services/loginService';

const Login = () => {
  const [ login, setLogin ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    adminLogin(login, password)
      .then(res => {
        toast.success("Logado com sucesso!")
        setToken(res.data.access_token);
        navigate("/admin/elections", { replace: true });
      }).catch(err => {
        toast.error(err.response.data.error)
      });
  };

  const handleRegister = () => {
    adminRegister(login, password)
      .then(res => {
        toast.success("Registrado com sucesso! Realize seu login!")
        setLogin('');
        setPassword('');
      })
      .catch(err => {
        toast.error(err.response.data.error)
      });
  };

  return <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      p: 1,
      m: 1,
      bgcolor: 'background.paper',
      borderRadius: 1,
    }}
  >
    <Card sx={{ m: "auto", mt: 3, width: "100%" }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField sx={{ maxWidth: "80%", m: "auto", mt: 3 }} id="standard-basic" label="Login" variant="standard" 
          onInput={e => setLogin(e.target.value)}
          value={login}
        />

        <TextField sx={{ maxWidth: "80%", m: "auto", mt: 3 }} id="standard-basic" label="Senha" variant="standard"  type="password"
          onInput={e => setPassword(e.target.value)}
          value={password}
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
        <Button onClick={handleRegister} disabled={login.length == 0 || password.length == 0} variant="contained" color="secondary">Register</Button>
        <Button onClick={handleLogin} disabled={login.length == 0 || password.length == 0} variant="contained" color="primary">Login</Button>
      </CardActions>
    </Card>
  </Box>;
};

export default Login;