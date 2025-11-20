import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import API from "../api/axiosClient";

export default function ExpenseForm({ open, onClose }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    categoryId: "",
  });

  useEffect(() => {
    if (open) {
      API.get("/categories").then((res) => setCategories(res.data));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", form);
      onClose();
      setForm({ amount: "", description: "", categoryId: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            select
            label="Category"
            margin="normal"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            {categories.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            label="Amount"
            type="number"
            margin="normal"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />


          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Add Expense
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
