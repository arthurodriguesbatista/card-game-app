import AddIcon from '@mui/icons-material/Add';
import { Fab, Tooltip, styled } from '@mui/material';

type NewEntityButtonProps = {
  onClick?: () => void;
  title?: string;
};

export const BottomRightFab = styled(Fab)({
  position: 'fixed',
  bottom: 24,
  right: 24,
});

export default function NewEntityButton({
  onClick,

  title,
}: NewEntityButtonProps) {
  return (
    <Tooltip title={title || 'add'}>
      <BottomRightFab onClick={onClick} color='primary' aria-label='add'>
        <AddIcon />
      </BottomRightFab>
    </Tooltip>
  );
}
