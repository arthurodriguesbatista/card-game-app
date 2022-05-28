import * as React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Fab, styled, Tooltip } from '@mui/material';

const ITEM_HEIGHT = 48;

export const StyledFab = styled(Fab)({
  position: 'fixed',
  bottom: 24,
  right: 24,
});

export default function MulipleButton({
  options,
  onClick,
}: {
  options: { name: string; value: string }[];
  onClick: (option: string) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Tooltip title='Options'>
      <div>
        <StyledFab
          aria-label='more'
          id='long-button'
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleClick}
        >
          <MoreVertIcon />
        </StyledFab>
        <Menu
          id='long-menu'
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => {
                handleClose();
                onClick(option.value);
              }}
            >
              {option.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </Tooltip>
  );
}
