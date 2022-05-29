import {
  SelectChangeEvent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { DeckCard, Game, Player } from './interface';

export const ShowPlayerCardsContent = (game?: Game) => {
  const [player, setPlayer] = useState<Player>();
  const handleChange = (event: SelectChangeEvent) => {
    setPlayer(
      game?.players?.find((p) => p.id?.toString() === event.target.value)
    );
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Player</InputLabel>
          <Select
            label='playerSelect'
            id='playerSelect'
            value={player?.id?.toString()}
            variant='standard'
            onChange={handleChange}
          >
            {game?.players?.map((player) => (
              <MenuItem value={player.id.toString()}>{player.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {player?.playerCards?.map((playerCard) => (
            <Grid item xs={3}>
              <Grid container justifyContent='center' alignItems='center'>
                <img
                  height={100}
                  width={70}
                  alt='game_card'
                  src={
                    playerCard?.deckCard?.card?.face +
                    '_' +
                    playerCard?.deckCard?.card?.suit +
                    '.png'
                  }
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export const ShowPlayersCardsContent = (game?: Game) => {
  const playersCardsValue = game?.players?.map((player) => ({
    player,
    value: player.playerCards.reduce(
      (pv, cv) => cv.deckCard.card.value + pv,
      0
    ),
  }));
  const sortedPlayersByValue = playersCardsValue?.sort(
    (a, b) => b.value - a.value
  );
  return (
    <Grid container spacing={2}>
      {sortedPlayersByValue?.map((rankedPlayer, index) => (
        <Grid item xs={12}>
          <Typography fontWeight='bold' align='center' variant='body2'>
            Rank {index + 1}: {rankedPlayer.player.name} with{' '}
            {rankedPlayer.value} points
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export const UndealtCardsContent = (shoe: DeckCard[]) => {
  const suitsPerUndealtCards = ['HEARTS', 'SPADES', 'CLUBS', 'DIAMONDS']
    ?.map((suit) => ({
      name: suit,
      amountCards: shoe.reduce(
        (pv, cv) => (cv.card.suit === suit ? 1 : 0) + pv,
        0
      ),
    }))
    ?.concat(
      [
        'KING',
        'QUEEN',
        'JACK',
        '10',
        '9',
        '8',
        '7',
        '6',
        '5',
        '4',
        '3',
        '2',
        'ACE',
      ]?.map((face) => ({
        name: face,
        amountCards: shoe.reduce(
          (pv, cv) => (cv.card.face === face ? 1 : 0) + pv,
          0
        ),
      }))
    );

  return (
    <Grid container spacing={2}>
      {suitsPerUndealtCards?.map((sortedSuit) => (
        <Grid item xs={12}>
          <Typography fontWeight='bold' align='center' variant='body2'>
            {sortedSuit.name} remaining: {sortedSuit.amountCards}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
