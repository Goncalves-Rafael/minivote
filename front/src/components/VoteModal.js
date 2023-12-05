import * as React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Card, CardHeader, CardContent } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function VoteModal({voto, r, registered}) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(registered);
  }, [registered])

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={style}>
          <CardHeader
              avatar={
                <InfoIcon/>
              }
              sx={{
                fontFamily: 'Montserrat'
              }}
              title="Salvar dados"
              titleTypographyProps={{variant: "h5", fontFamily: 'Montserrat'}}
            />
          <CardContent>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Voto realizado com sucesso! <br />Salve os dados abaixo para conseguir validar os resultados ao final da eleição:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`Voto: ${voto}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText className='wrap-text'
                  primary={`R: ${r}`}
                />
              </ListItem>
            </List>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Salve essa URL para verificar os resultados mais tarde, por enquanto já pode fechar essa janela!
            </Typography>
          </CardContent>
        </Card>
      </Modal>
    </div>
  );
}