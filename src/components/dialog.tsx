import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle align='center'>{title}</DialogTitle>
      <DialogContent>{content && content()}</DialogContent>
      <DialogActions>{actions && actions()}</DialogActions>
    </Dialog>
  );
}
