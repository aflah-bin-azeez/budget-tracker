import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import API from "../api/axiosClient";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [catId, setCatId] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#1976d2");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = () => {
    setEditMode(false);
    setName("");
    setColor("#1976d2");
    setOpen(true);
  };

  const handleEdit = (cat) => {
    setEditMode(true);
    setCatId(cat._id);
    setName(cat.name);
    setColor(cat.color || "#1976d2");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Category name cannot be empty");

    const duplicate = categories.find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c._id !== catId
    );
    if (duplicate) return toast.error("Category name already exists");

    try {
      if (editMode) {
        await API.put(`/categories/${catId}`, { name: name.trim(), color });
        toast.success("Category updated successfully");
      } else {
        await API.post("/categories", { name: name.trim(), color });
        toast.success("Category added successfully");
      }
      setOpen(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await API.delete(`/categories/${id}`);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const handleCancelEdit = () => {
    setOpen(false);
    setEditMode(false);
    setName("");
    setColor("#1976d2");
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        spacing={{ xs: 2, sm: 0 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Categories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ borderRadius: 2, px: { xs: 2, sm: 3 }, width: { xs: "100%", sm: "auto" } }}
        >
          Add Category
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>Color</TableCell>
                <TableCell>Name</TableCell>
                <TableCell width="140">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow
                  key={cat._id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" }, transition: "0.2s" }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "4px",
                        background: cat.color || "#1976d2",
                        border: "1px solid #ccc",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{cat.name}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton onClick={() => handleEdit(cat)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(cat._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={open} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
          {editMode ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              fullWidth
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Box>
              <Typography sx={{ mb: 1 }}>Color</Typography>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ px: 4 }}>
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
