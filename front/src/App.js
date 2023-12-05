
import './App.css';
import { Avatar, Card, CardHeader } from '@mui/material';
import BallotIcon from '@mui/icons-material/Ballot';
import AuthProvider from "./provider/AuthProvider";
import Routes from "./routes/Routes";

import { ThemeProvider, createTheme  } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7044a5'
    },
    secondary: {
      main: '#4D7063',
      contrastText: "#fff"
    }
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Card sx={{ maxWidth: "850px", m: "auto", mt: 5 }}>
          {/* <CardMedia
            sx={{ height: 140 }}
            image="https://media.istockphoto.com/id/1439262934/photo/mockup-christmas-card-among-christmas-ornaments-over-a-red-glitter-backdrop.webp?b=1&s=612x612&w=0&k=20&c=J69slOR0BVTmU78ZGrM_HFm48qonorpXr3hJ2_6Y2uM="
            title="mockup christmas card"
          /> */}
          <CardHeader
              avatar={
                <Avatar variant="rounded" sx={{ bgcolor: '#7044a5' }} >
                  <BallotIcon/>
                </Avatar>
              }
              sx={{
                fontFamily: 'Montserrat'
              }}
              title="MiniVote"
              titleTypographyProps={{variant: "h3", fontFamily: 'Montserrat'}}
            />
            <AuthProvider>
              <Routes />
            </AuthProvider>
        </Card>
      </ThemeProvider>
    </div>
  );
}

export default App;
