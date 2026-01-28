import React from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { Alert, AlertTitle } from "@mui/material"

interface WorkerErrorDialogProps {
  error: Error | null
  onRetry: () => void
}

export const WorkerErrorDialog: React.FC<WorkerErrorDialogProps> = ({ error, onRetry }) => {
  if (!error) return null

  const isWorkerTimeout = error.message.includes("Network worker") || error.message.includes("Timeout")

  return (
    <Dialog open={!!error} maxWidth="sm" fullWidth>
      <DialogTitle>Worker Initialization Failed</DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Unable to Start Application Worker</AlertTitle>
          The background worker thread failed to initialize. This is required for the wallet to function properly.
        </Alert>

        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Possible causes:</strong>
        </Typography>
        <Typography variant="body2" component="ul" color="text.secondary" sx={{ pl: 2 }}>
          <li>Browser compatibility issues</li>
          <li>JavaScript execution blocked by extensions</li>
          <li>Network issues preventing worker scripts from loading</li>
          <li>Service worker conflicts</li>
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 2 }}>
          <strong>Try these solutions:</strong>
        </Typography>
        <Typography variant="body2" component="ol" color="text.secondary" sx={{ pl: 2 }}>
          <li>Refresh the page (click Retry below)</li>
          <li>Clear your browser cache and reload</li>
          <li>Disable browser extensions temporarily</li>
          <li>Try a different browser (Chrome, Firefox, Edge)</li>
        </Typography>

        {error.message && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption" component="pre" sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
              {error.message}
            </Typography>
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => window.location.reload()} color="primary" variant="contained">
          Retry
        </Button>
        <Button
          onClick={() => {
            console.error("Worker Error Details:", error)
            alert(
              "Error details have been logged to the browser console. Please check the console for more information."
            )
          }}
          color="secondary"
        >
          View Details
        </Button>
      </DialogActions>
    </Dialog>
  )
}
