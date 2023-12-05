import { useState, useEffect } from 'react';
import { useNavigate , useParams } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {
  Box,
} from '@mui/material';


import { closeElection, getElection, getVotes } from '../services/electionService';
import { useAuth } from "../provider/AuthProvider";
import RegisterVote from './RegisterVote';
import ElectionResults from './ElectionResults';


export default function AdminElections () {
    const [election, setElection] = useState({});
    const [votes, setVotes] = useState([]);
    const { token } = useAuth();
    const routeParams = useParams();
    const navigate = useNavigate();

    const loadElectionDetails = () => {
      getElection(routeParams.id, token)
        .then(async res => {
          const votesResponse = await getVotes(routeParams.id, token);
          setElection(res.data);
          setVotes(votesResponse.data.votos);
        })
        .catch(error => {
        })
    };

    const endElection = () => {
      closeElection(routeParams.id, token)
        .then(loadElectionDetails)
        .catch(error => {
        })
    }

    useEffect(loadElectionDetails, []);

    return <Card>
      <CardContent>
        {election &&
          <Typography color="text.primary" fontFamily="Montserrat" margin="10px" >
            Eleição: {election.nome}
          </Typography>
        }
        {
          !token && election && !election.finalizada && <RegisterVote election={election} />
        }
        { (!!token || (election && election.finalizada)) &&
          <Box>
            {election && election.resultados && <ElectionResults election={election} />}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} aria-label="caption table">
                <caption>
                  Votos da eleição.
                </caption>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={1}>Hash do Voto</TableCell>
                    <TableCell>R Gerado do Voto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {votes && votes.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row" colSpan={1} className='wrap-text'>
                        {row.hash_identificador_voto}
                      </TableCell>
                      <TableCell className='wrap-text'>
                        {row.r} 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        }
        <CardActions sx={{
              display: 'flex',
              justifyContent: 'space-around',
              p: 1,
              m: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}>
          {token && <Button onClick={() => navigate('/admin/elections')} variant="contained">Voltar</Button>}
          <Button onClick={loadElectionDetails} variant="contained" color="primary">Atualizar</Button>
          {token && election &&
            <Button onClick={endElection} variant="contained" color="secondary" disabled={election.finalizada}>Encerrar</Button>
          }
        </CardActions>
      </CardContent>
    </Card>;
}