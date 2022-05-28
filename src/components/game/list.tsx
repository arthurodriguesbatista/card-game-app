import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
} from '@mui/x-data-grid';
import { fetcher, mainApi } from '../../api/apiService';
import { CreateGame, Game } from './interface';
import {
  Button,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import NewEntityButton from '../newEntityButton';
import Dialog from '../dialog';
import { useNavigate } from 'react-router';
export type DataGridColumnType = (GridActionsColDef | GridColDef)[];
function GameList() {
  const navigate = useNavigate();
  const columns: DataGridColumnType = [
    {
      field: 'name',
      headerName: 'Game',
      minWidth: 160,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'players',
      headerName: 'Players',
      minWidth: 160,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) =>
        params.row.players?.map((player: any) => player.name)?.join(),
    },
    {
      field: 'actions',
      headerName: 'Delete',
      type: 'actions',
      minWidth: 160,
      headerAlign: 'center',
      align: 'center',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Tooltip title='Delete'>{<Delete />}</Tooltip>}
          onClick={() => handleDelete(params.row.id)}
          label='Delete'
        />,
      ],
    },
  ];

  const createGameContent = () => (
    <div>
      <TextField
        autoFocus
        margin='dense'
        id='gameName'
        label='Game name'
        fullWidth
        required
        value={createGame.name}
        onChange={(e) =>
          setCreateGame({ ...createGame, name: e.target?.value })
        }
        type='text'
        variant='standard'
      />
      <TextField
        margin='dense'
        id='playerName'
        label="Player's name"
        type='text'
        fullWidth
        value={createGame.playerName}
        required
        onChange={(e) =>
          setCreateGame({ ...createGame, playerName: e.target?.value })
        }
        variant='standard'
      />
    </div>
  );

  const createGameAction = () => (
    <div>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button
        disabled={!createGame.name && !createGame.playerName}
        onClick={handleCreate}
      >
        Play
      </Button>
    </div>
  );

  const handleDelete = async (id: number) => {
    mainApi.delete(`/game/${id}`).then(fetchGames);
  };

  const handleCreate = async () => {
    mainApi
      .post('/game', {
        name: createGame.name,
        playerName: createGame.playerName,
      })
      .then(() => setOpen(false))
      .then(fetchGames)
      .then(() =>
        setCreateGame({
          name: '',
          playerName: '',
        })
      );
  };

  const [rows, setRows] = useState<Game[]>([]);

  const [createGame, setCreateGame] = useState<CreateGame>({
    name: '',
    playerName: '',
  });

  const [open, setOpen] = useState(false);

  const fetchGames = async () => {
    fetcher('/game', {
      params: { include: JSON.stringify({ players: true }) },
    }).then((res) => setRows(res.data));
  };

  useEffect(() => {
    fetchGames();
  }, []);
  return (
    <Grid container height='100vh' justifyContent='center' alignItems='center'>
      <Grid item xs={12}>
        <Paper
          elevation={0}
          sx={{ width: '60vh', height: '50vh', margin: 'auto' }}
        >
          <Typography variant='h4' align='center' component='div' gutterBottom>
            Choose your game
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            rowsPerPageOptions={[5]}
            onRowClick={(row) => navigate(`../${row.id}`)}
            localeText={{ noRowsLabel: 'No games created' }}
          />
          <Dialog
            open={open}
            handleClose={() => setOpen(false)}
            title='Create your game'
            content={createGameContent}
            actions={createGameAction}
          />
          <NewEntityButton onClick={() => setOpen(true)} />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default GameList;
