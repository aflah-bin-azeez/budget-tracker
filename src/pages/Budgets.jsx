import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import API from "../api/axiosClient";

export default function Budgets() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("");
  const [limit, setLimit] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [editingId, setEditingId] = useState(null);
  const [editLimit, setEditLimit] = useState("");

  const loadAll = async () => {
    try {
      setLoading(true);
      const [catRes, budgetRes] = await Promise.all([
        API.get("/categories"),
        API.get(`/budgets?month=${month}`),
      ]);
      setCategories(catRes.data);
      setBudgets(budgetRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [month]);

  const handleAddOpen = () => {
    setSelectedCat("");
    setLimit("");
    setOpen(true);
  };

  const handleAdd = async () => {
    if (!selectedCat) return toast.error("Please select a category");
    if (!limit || limit <= 0) return toast.error("Please enter a valid positive limit");
    if (!month) return toast.error("Please select a month");

    const exists = budgets.find((b) => b.categoryId?._id === selectedCat && b.month === month);
    if (exists) return toast.error("Budget for this category already exists this month");

    try {
      await API.post("/budgets", { categoryId: selectedCat, limit, month });
      toast.success("Budget added successfully");
      setOpen(false);
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add budget");
    }
  };

  const handleSave = async (id) => {
    if (!editLimit || editLimit <= 0) return toast.error("Enter a valid positive limit");
    try {
      await API.put(`/budgets/${id}`, { limit: editLimit });
      toast.success("Budget updated successfully");
      setEditingId(null);
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update budget");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditLimit("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await API.delete(`/budgets/${id}`);
      toast.success("Budget deleted successfully");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete budget");
    }
  };

  const formatCurrency = (num) => `₹${Number(num).toLocaleString()}`;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        spacing={{ xs: 2, sm: 0 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Monthly Budgets
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width={{ xs: "100%", sm: "auto" }}>
          <TextField
            label="Select Month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            size="small"
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
            sx={{ borderRadius: 2, width: "100%" }}
            className="w-full"
          >
            Add Budget
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 320 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Category</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Limit (₹)</TableCell>
                <TableCell width="180">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets?.map((b) => (
                <TableRow
                  key={b._id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" }, transition: "0.2s" }}
                >
                  <TableCell>{b.categoryId?.name || "Deleted Category"}</TableCell>
                  <TableCell>{b.month}</TableCell>
                  <TableCell>
                    {editingId === b._id ? (
                      <TextField
                        type="number"
                        size="small"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        fullWidth
                      />
                    ) : (
                      formatCurrency(b.limit)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === b._id ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <IconButton color="success" onClick={() => handleSave(b._id)}>
                          <SaveIcon />
                        </IconButton>
                        <Button variant="outlined" color="secondary" size="small" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <IconButton onClick={() => { setEditingId(b._id); setEditLimit(b.limit); }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(b._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>Add Budget</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              select
              label="Category"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              fullWidth
            >
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Monthly Limit (₹)"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              fullWidth
            />
            <TextField
              label="Month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: "wrap", gap: 1 }}>
          <Button onClick={() => setOpen(false)} fullWidth={{ xs: true, sm: false }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleAdd} sx={{ px: 4, flexGrow: { xs: 1, sm: 0 } }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
