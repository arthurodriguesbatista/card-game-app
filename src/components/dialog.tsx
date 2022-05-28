import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Paper, styled } from '@mui/material';

const CustomPaper = styled(Paper)(() => ({
  position: 'absolute',
  overflow: 'scroll',
  maxHeight: '100%',
  width: 500,
  display: 'block',
}));
export default function FormDialog({
  title,
  open,
  handleClose,
  content,
  actions,
}: {
  title: string;
  open: boolean;
  handleClose: () => void;
  content?: () => React.ReactNode;
  actions?: () => React.ReactNode;
}) {
  const defaultAction = () => (
    <div>
      <Button onClick={handleClose}>Cancel</Button>
    </div>
  );
  return (
    <Dialog PaperComponent={CustomPaper} open={open} onClose={handleClose}>
      <DialogTitle align='center'>{title}</DialogTitle>
      <DialogContent>{content && content()}</DialogContent>
      <DialogActions>{actions ? actions() : defaultAction()}</DialogActions>
    </Dialog>
  );
}
