import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  Input,
  FormHelperText,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";

export default function ConfirmationDialog({
  open,
  title,
  message,
  onClose,
  actionType,
}) {
  const [comment, setComment] = React.useState("");

  const handleDialogClose = (event, reason, isConfirmed) => {
    if (reason === "backdropClick") {
      return;
    }
    if (!isConfirmed || !(actionType === "Reject" && comment === "")) {
      let returnMessage = comment;
      setComment("");
      onClose(isConfirmed, returnMessage);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleDialogClose} fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
          <FormControl
            fullWidth
            error={actionType === "Reject" && comment === ""}
          >
            <Input
              autoFocus
              id="comment"
              value={comment}
              autoComplete="off"
              onChange={(e) => setComment(e.target.value)}
            />
            <FormHelperText id="comment-helper">
              Please enter any comments you would like to submit
              {actionType === "Reject" ? " (Required)" : ""}
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDialogClose(null, null, false);
            }}
            variant="text"
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDialogClose(null, null, true);
            }}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={actionType === "Reject" && comment === ""}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
