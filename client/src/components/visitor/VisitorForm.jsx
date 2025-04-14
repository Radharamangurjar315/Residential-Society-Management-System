import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { createVisitor } from '../../components/utils/visitorApi';

const validationSchema = Yup.object({
  visitorName: Yup.string().required('Visitor name is required'),
  flatNumber: Yup.string().required('Flat number is required'),
  purpose: Yup.string().required('Purpose is required')
});

export default function VisitorForm({ societyId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      visitorName: '',
      flatNumber: '',
      purpose: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await createVisitor({ 
          ...values, 
          societyId 
        });
        onSuccess();
        handleClose();
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Add Visitor
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="bg-gray-50 text-gray-800">
          Register New Visitor
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent className="space-y-4">
            <TextField
              fullWidth
              id="visitorName"
              name="visitorName"
              label="Visitor Name"
              variant="outlined"
              value={formik.values.visitorName}
              onChange={formik.handleChange}
              error={formik.touched.visitorName && Boolean(formik.errors.visitorName)}
              helperText={formik.touched.visitorName && formik.errors.visitorName}
            />
            
            <TextField
              fullWidth
              id="flatNumber"
              name="flatNumber"
              label="Flat Number"
              variant="outlined"
              value={formik.values.flatNumber}
              onChange={formik.handleChange}
              error={formik.touched.flatNumber && Boolean(formik.errors.flatNumber)}
              helperText={formik.touched.flatNumber && formik.errors.flatNumber}
            />
            
            <TextField
              fullWidth
              id="purpose"
              name="purpose"
              label="Visit Purpose"
              variant="outlined"
              multiline
              rows={3}
              value={formik.values.purpose}
              onChange={formik.handleChange}
              error={formik.touched.purpose && Boolean(formik.errors.purpose)}
              helperText={formik.touched.purpose && formik.errors.purpose}
            />
          </DialogContent>
          <DialogActions className="bg-gray-50 px-6 py-4">
            <Button onClick={handleClose} className="text-gray-600">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}