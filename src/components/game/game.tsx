/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';

import { fetcher, mainApi } from '../../api/apiService';
import { DeckCard, Game, Player } from './interface';
import {
  Box,
  Button,
  Grid,
  Paper,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import Dialog from '../dialog';
import ReactCardFlip from 'react-card-flip';
import { useLocation, useNavigate } from 'react-router';
import ReturnButton from '../returnButton';
import MulipleButton from '../multipleButton';
const BorderPaper = styled(Paper)({
  borderRadius: 20,
  borderColor: '#000000',
  padding: 50,
});

type MultiOptions =
  | 'ADD_PLAYER'
  | 'SHOW_PLAYER_CARDS'
  | 'SHOW_PLAYERS_CARDS'
  | 'REMAINDING_CARDS'
  | 'REMAINDING_SORTED_CARDS';

function PlayGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const createPlayerContent = () => (
    <div>
      <TextField
        margin='dense'
        id='playerName'
        label="Player's name"
        type='text'
        fullWidth
        value={createPlayer}
        required
        onChange={(e) => setCreatePlayer(e.target.value)}
        variant='standard'
      />
    </div>
  );

  const createPlayerAction = () => (
    <div>
      <Button onClick={() => setModal({ open: false })}>Cancel</Button>
      <Button disabled={!createPlayer?.length} onClick={() => addPlayer()}>
        Add Player
      </Button>
    </div>
  );

  const addPlayer = () => {
    mainApi
      .post('/game' + location.pathname + '/player', {
        playerName: createPlayer,
      })
      .then(fetchGame)
      .then(() => setCreatePlayer(''))
      .then(() => setModal({ open: false }));
  };

  const [game, setGame] = useState<Game>();
  const [shoe, setShoe] = useState<DeckCard[]>([]);

  const [createPlayer, setCreatePlayer] = useState('');

  const [modal, setModal] = useState<{ open: boolean; option?: MultiOptions }>({
    open: false,
  });

  const [isFlipped, setIsFlipped] = useState(false);

  const [currentPlayer, setCurrentPlayer] = useState<Player>();

  const fetchInicialGame = async () => {
    await fetchGame();
    setCurrentPlayer(game?.players[0]);
  };

  const fetchGame = async () => {
    const res = await fetcher('/game' + location.pathname);
    console.log(res);
    setGame(res);
    setShoe(res.shoe);
  };
  const changePlayer = () => {
    const currentPlayerIndex = game?.players.findIndex(
      (player) => player.id === currentPlayer?.id
    );
    if (currentPlayerIndex && currentPlayerIndex + 1 === game?.players.length) {
      setCurrentPlayer(game?.players[0]);
    } else if (currentPlayerIndex) {
      setCurrentPlayer(game?.players[currentPlayerIndex + 1]);
    }
  };
  const handleFlipCardFromShoe = async () => {
    setIsFlipped(true);
    if (shoe?.length) {
      const topCardFromShoe = shoe?.pop();
      mainApi
        .post(
          `/game/${game?.id}/player/${currentPlayer?.id}/card/${topCardFromShoe?.id}`
        )
        .then(changePlayer)
        .then(fetchGame);
    }
  };

  const handleMultiContentOption = () => {
    if (modal.option === 'ADD_PLAYER') return createPlayerContent;
  };

  const handleMultiActionOption = () => {
    if (modal.option === 'ADD_PLAYER') return createPlayerAction;
  };

  useEffect(() => {
    fetchInicialGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box p={5}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography align='center'>
            Cards left: {game?.shoe?.length || 0}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal'>
            <Grid container justifyContent='center' alignItems='center'>
              <img
                height={200}
                width={150}
                src='https://opengameart.org/sites/default/files/card%20back%20black.png'
                onClick={handleFlipCardFromShoe}
              />
            </Grid>

            <Grid container justifyContent='center' alignItems='center'>
              <img
                height={200}
                width={150}
                src='http://localhost:3030/public/2_HEARTS.png'
              />
            </Grid>
          </ReactCardFlip>
        </Grid>
        <Grid item xs={12}>
          <Button></Button>
        </Grid>
        <Grid item xs={12}>
          <BorderPaper square={true} elevation={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h4'>
                  Players
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  {game?.players?.map((player) => (
                    <Grid key={player.id + '_player'} item xs={2}>
                      <img
                        height={200}
                        width={150}
                        src={player.deckCards[-1]?.card?.imageUrl}
                        onClick={() => setIsFlipped(false)}
                      />
                      <Typography
                        color={
                          player.id === currentPlayer?.id ? 'red' : 'black'
                        }
                        variant='body1'
                      >
                        {player.name}: {player.deckCards?.length || 0} cards
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </BorderPaper>
        </Grid>
        <Dialog
          open={modal.open}
          handleClose={() => setModal({ open: false })}
          title='Add a player'
          content={handleMultiContentOption()}
          actions={handleMultiActionOption()}
        />
        <MulipleButton
          onClick={(option) =>
            setModal({ open: true, option: option as MultiOptions })
          }
          options={[
            { name: 'Add Player', value: 'ADD_PLAYER' },
            { name: "Show Player's Cards", value: 'SHOW_PLAYER_CARDS' },
            {
              name: "Show All Player's Game Cards",
              value: 'SHOW_PLAYERS_CARDS',
            },
            { name: 'Show Remainding Game Cards', value: 'REMAINDING_CARDS' },
            {
              name: 'Show Remainding Sorted Game Cards',
              value: 'REMAINDING_SORTED_CARDS',
            },
          ]}
        />
        <ReturnButton onClick={() => navigate('/')} />
      </Grid>
    </Box>
  );
}

export default PlayGame;
