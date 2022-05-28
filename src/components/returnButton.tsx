import { Fab, Tooltip, styled } from '@mui/material';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
type ReturnButtonProps = {
  onClick?: () => void;
  title?: string;
};

export const BottomRightFab = styled(Fab)({
  position: 'fixed',
  top: 24,
  right: 24,
});

export default function ReturnButton({
  onClick,

  title,
}: ReturnButtonProps) {
  return (
    <Tooltip title={title || 'quit'}>
      <BottomRightFab onClick={onClick} color='error' aria-label='add'>
        <NotInterestedIcon />
      </BottomRightFab>
    </Tooltip>
  );
}
