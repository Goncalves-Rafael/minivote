import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


import { getElections } from '../services/electionService'
import { useAuth } from "../provider/AuthProvider";


export default function AdminElections () {
    const [elections, setElections] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    const loadAdminElections = () => {
      getElections(token)
        .then(res => {
          setElections(res.data.eleicoes)
        })
        .catch(error => {
          setMessage(error.response.data.message)
          setIsError(true)
        })
    }

    useEffect(loadAdminElections, []);
  
    const toClipBoard = (text) => {navigator.clipboard.writeText(text)}
    
    const baseUrl = window.location.href.split('/#/')[0]
    const voteLink = (id) => `${baseUrl}/#/vote/${id}`

    return <Card>
      <CardContent>
        <TableContainer component={Paper}>
          <Typography color="text.primary" fontFamily="Montserrat" margin="10px" >
            Eleições criadas
          </Typography>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <caption>
              Lista das eleições criadas, clique no olho para mais detalhes.
            </caption>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3}>Nome</TableCell>
                <TableCell>Finalizada</TableCell>
                <TableCell>URL para Votar</TableCell>
                <TableCell>Detalhes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {elections && elections.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row" colSpan={3}>
                    {row.nome}
                  </TableCell>
                  <TableCell>
                    <Checkbox disabled checked={row.finalizada} />  
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" aria-label="detalhes" onClick={() => toClipBoard(voteLink(row.id))}>
                      <ContentCopyIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" aria-label="detalhes" onClick={() => navigate(`/admin/elections/${row.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CardActions sx={{
              display: 'flex',
              justifyContent: 'space-around',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}>
          <Button onClick={loadAdminElections} variant="contained" color="primary">Atualizar</Button>
          <Button onClick={() => navigate('/admin/elections/new')} variant="contained" color="secondary">Nova</Button>
        </CardActions>
      </CardContent>
    </Card>;
}