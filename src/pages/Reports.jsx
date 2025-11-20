import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  CircularProgress,
} from "@mui/material";
import API from "../api/axiosClient";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Reports() {
  const [report, setReport] = useState([]);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // default current month
  );
  const [loading, setLoading] = useState(false);

  // Fetch report data
  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/reports/budget-vs-expense?month=${month}`);

      setReport(res.data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [month]);

  // Chart data
  const pieData = report.map((r) => ({
    name: r.categoryName,
    value: r.spent,
  }));

  const barData = report.map((r) => ({
    category: r.categoryName,
    spent: r.spent,
    budget: r.budget,
  }));

  // Currency formatter
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Monthly Report
      </Typography>

      {/* Month Selector */}
      <TextField
        label="Month"
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : report.length === 0 ? (
        <Typography>No data for selected month.</Typography>
      ) : (
        <>
          {/* Summary Table */}
          <Paper sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Spent</TableCell>
                  <TableCell>Budget</TableCell>
                  <TableCell>Remaining</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {report.map((r) => (
                  <TableRow key={r.categoryId}>
                    <TableCell>{r.categoryName}</TableCell>
                    <TableCell>{formatCurrency(r.spent)}</TableCell>
                    <TableCell>{formatCurrency(r.budget)}</TableCell>
                    <TableCell
                      style={{
                        color:
                          r.remaining < 0
                            ? "red"
                            : r.remaining > 0
                            ? "green"
                            : "black",
                      }}
                    >
                      {formatCurrency(r.remaining)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Charts Row */}
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {/* Pie Chart */}
            <Paper sx={{ p: 2, flex: 1, minWidth: 350 }}>
              <Typography variant="h6">Spending Distribution</Typography>
              <PieChart width={350} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </Paper>

            {/* Bar Chart */}
            <Paper sx={{ p: 2, flex: 1, minWidth: 400 }}>
              <Typography variant="h6">Budget vs Spent</Typography>
              <BarChart width={450} height={300} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Legend />
                <Bar
                  dataKey="spent"
                  name="Spent"
                  fill="#8884d8"
                  >
                  {barData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.spent > entry.budget ? "red" : "#8884d8"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="budget" name="Budget" fill="#82ca9d" />
              </BarChart>
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
}
