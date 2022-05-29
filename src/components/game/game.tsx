/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react';
import Badge from '@mui/material/Badge';
import { fetcher, mainApi } from '../../api/apiService';
import { DeckCard, Game, Player } from './interface';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import Dialog from '../dialog';
import ReactCardFlip from 'react-card-flip';
import { useLocation, useNavigate } from 'react-router';
import ReturnButton from '../returnButton';
import MulipleButton from '../multipleButton';
import {
  ShowPlayerCardsContent,
  ShowPlayersCardsContent,
  UndealtCardsContent,
} from './gameOptions';
const BorderPaper = styled(Paper)({
  borderRadius: 20,
  borderColor: '#000000',
  padding: 50,
  overflow: 'scroll',
  maxHeight: '100%',
  display: 'block',
});

type MultiOptions =
  | 'ADD_PLAYER'
  | 'SHOW_PLAYER_CARDS'
  | 'SHOW_PLAYERS_CARDS'
  | 'REMAINDING_SORTED_CARDS'
  | 'ADD_DECK';

const modalTitiles = {
  ADD_PLAYER: 'Choose a name',
  SHOW_PLAYER_CARDS: 'Choose a player',
  SHOW_PLAYERS_CARDS: 'Player ranking',
  REMAINDING_SORTED_CARDS: 'Remaining cards from shoe',
  ADD_DECK: '',
};

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
      <Button
        disabled={!createPlayer?.length}
        onClick={async () => {
          await addPlayer();
          setModal({ open: false });
        }}
      >
        Add Player
      </Button>
    </div>
  );

  const addPlayer = async () => {
    await mainApi.post('/game' + location.pathname + '/player', {
      playerName: createPlayer,
    });
    await fetchGame();
  };

  const addDeck = async () => {
    await mainApi.post('/game' + location.pathname + '/deck');
    await fetchGame();
  };

  const deletePlayer = async (playerId: number) => {
    if (
      game?.players?.length &&
      game?.players?.length > 1 &&
      currentPlayer?.id === playerId
    ) {
      changePlayer();
    } else if (game?.players?.length && game?.players?.length === 1) {
      setCurrentPlayer(undefined);
    }
    await mainApi.delete('/game' + location.pathname + '/player/' + playerId);

    await fetchGame();
  };

  const [game, setGame] = useState<Game>();
  const [shoe, setShoe] = useState<DeckCard[]>([]);

  const [createPlayer, setCreatePlayer] = useState('');

  const [modal, setModal] = useState<{ open: boolean; option?: MultiOptions }>({
    open: false,
  });

  const [isFlipped, setIsFlipped] = useState(false);

  const [currentPlayer, setCurrentPlayer] = useState<Player>();

  const fetchGame = async () => {
    const res = await fetcher('/game' + location.pathname);
    setGame(res);
    setShoe(res.shoe);
    if (!currentPlayer && res) {
      setCurrentPlayer(res?.players[0]);
    }
  };
  const changePlayer = () => {
    const currentPlayerIndex = game?.players.findIndex(
      (player) => player.id === currentPlayer?.id
    );
    if (
      currentPlayerIndex !== undefined &&
      currentPlayerIndex + 1 === game?.players.length
    ) {
      setCurrentPlayer(game?.players[0]);
    } else if (currentPlayerIndex !== undefined) {
      setCurrentPlayer(game?.players[currentPlayerIndex + 1]);
    } else {
      setCurrentPlayer(undefined);
    }
  };
  const handleFlipCardFromShoe = async () => {
    if (currentPlayer && game?.shoe?.length) {
      setIsFlipped(true);
      return setTimeout(async () => {
        setIsFlipped(false);
        if (shoe?.length && currentPlayer) {
          const topCardFromShoe = shoe[shoe?.length - 1];
          await mainApi.post(
            `/game/${game?.id}/player/${currentPlayer?.id}/card/${topCardFromShoe?.id}`
          );
          changePlayer();
          await fetchGame();
        }
      }, 1000);
    }
  };

  const handleMultiContentOption = () => {
    if (modal.option === 'ADD_PLAYER') return createPlayerContent;
    if (modal.option === 'SHOW_PLAYER_CARDS')
      return () => ShowPlayerCardsContent(game);
    if (modal.option === 'SHOW_PLAYERS_CARDS')
      return () => ShowPlayersCardsContent(game);
    if (modal.option === 'REMAINDING_SORTED_CARDS')
      return () => UndealtCardsContent(shoe);
  };

  const handleMultiActionOption = () => {
    if (modal.option === 'ADD_PLAYER') return createPlayerAction;
  };

  const shuffle = async () => {
    await mainApi.post(`/game/${game?.id}/suffle`);
    await fetchGame();
  };

  useEffect(() => {
    fetchGame();
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
                style={
                  currentPlayer && game?.shoe?.length
                    ? { cursor: 'pointer' }
                    : undefined
                }
                src='https://opengameart.org/sites/default/files/card%20back%20black.png'
                onClick={handleFlipCardFromShoe}
              />
            </Grid>

            <Grid container justifyContent='center' alignItems='center'>
              <img
                height={200}
                width={150}
                src={
                  shoe?.length
                    ? `${shoe[shoe?.length - 1]?.card?.face}_${
                        shoe[shoe?.length - 1]?.card?.suit
                      }.png`
                    : ''
                }
              />
            </Grid>
          </ReactCardFlip>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent='center' alignItems='center'>
            <Button
              disabled={!game?.shoe?.length}
              onClick={shuffle}
              variant='outlined'
            >
              Shuffle
            </Button>
          </Grid>
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
                      <Grid
                        container
                        justifyContent='center'
                        alignItems='center'
                      >
                        <Badge
                          onClick={() => deletePlayer(player.id)}
                          color='error'
                          badgeContent='X'
                          style={{ cursor: 'pointer' }}
                        >
                          <img
                            height={200}
                            width={150}
                            src={
                              player?.playerCards?.length
                                ? player?.playerCards[
                                    player?.playerCards?.length - 1
                                  ]?.deckCard?.card?.face +
                                  '_' +
                                  player?.playerCards[
                                    player?.playerCards?.length - 1
                                  ]?.deckCard?.card?.suit +
                                  '.png'
                                : 'https://opengameart.org/sites/default/files/card%20back%20black.png'
                            }
                          />
                        </Badge>
                        <Typography
                          color={
                            player.id === currentPlayer?.id ? 'red' : 'black'
                          }
                          variant='body1'
                          align='center'
                        >
                          {player.name}: {player.playerCards?.length || 0} cards
                        </Typography>
                      </Grid>
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
          title={modal.option ? modalTitiles[modal.option] : ''}
          content={handleMultiContentOption()}
          actions={handleMultiActionOption()}
        />
        <MulipleButton
          onClick={async (option) => {
            if ((option as MultiOptions) === 'ADD_DECK') {
              await addDeck();
            } else {
              setModal({ open: true, option: option as MultiOptions });
            }
          }}
          options={[
            { name: 'Add Player', value: 'ADD_PLAYER' },
            { name: 'Add Deck', value: 'ADD_DECK' },
            { name: "Player's Cards", value: 'SHOW_PLAYER_CARDS' },
            {
              name: 'Player Ranking',
              value: 'SHOW_PLAYERS_CARDS',
            },
            {
              name: 'Undealt Cards from shoe',
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
