import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  useTheme,
  Button,
  LinearProgress,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import API from "../api/axiosClient";
import ExpenseForm from "../components/ExpenseForm";

export default function Dashboard() {
  const theme = useTheme();

  const [stats, setStats] = useState({
    totalSpent: 0,
    remainingBudget: 0,
    topCategory: "N/A",
  });

  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [openExpense, setOpenExpense] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await API.get(`/dashboard?month=${month}`);
      const data = res.data;

      const totalSpent = data.reduce((sum, c) => sum + c.spent, 0);
      const remainingBudget = data.reduce(
        (sum, c) => sum + (c.limit - c.spent),
        0
      );
      const topCategory =
        data.reduce((maxCat, c) => (c.spent > maxCat.spent ? c : maxCat), {
          spent: 0,
        }).name || "N/A";

      setStats({ totalSpent, remainingBudget, topCategory });
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [month]);

  const cardStyle = {
    p: 3,
    borderRadius: 3,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: "0.3s",
    height: "100%",
    "&:hover": {
      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
      transform: "translateY(-4px)",
    },
  };

  const iconStyle = {
    width: 48,
    height: 48,
    p: 1,
    borderRadius: 2,
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "error";
    if (percentage >= 70) return "warning";
    return "success";
  };

  const getBudgetStatus = (percentage) => {
    if (percentage >= 90) return { label: "Critical", color: "error" };
    if (percentage >= 70) return { label: "Warning", color: "warning" };
    if (percentage > 0) return { label: "On Track", color: "success" };
    return { label: "Not Started", color: "default" };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenExpense(true)}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={5} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    ...iconStyle,
                    bgcolor: theme.palette.error.light,
                  }}
                >
                  <PaymentsIcon fontSize="large" color="error" />
                </Avatar>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Spent This Month
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{stats.totalSpent.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    ...iconStyle,
                    bgcolor: theme.palette.success.light,
                  }}
                >
                  <AccountBalanceWalletIcon fontSize="large" color="success" />
                </Avatar>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Remaining Budget
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    ₹{stats.remainingBudget.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    ...iconStyle,
                    bgcolor: theme.palette.info.light,
                  }}
                >
                  <CategoryIcon fontSize="large" color="info" />
                </Avatar>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Top Spending Category
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {stats.topCategory}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Breakdown Section */}
      <Card sx={{ ...cardStyle, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <TrendingUpIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Category Breakdown
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {categories.map((category) => {
            const percentage =
              category.limit > 0
                ? Math.round((category.spent / category.limit) * 100)
                : 0;
            const status = getBudgetStatus(percentage);

            return (
              <Grid item xs={12} md={6} key={category._id}>
                <Card
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: `2px solid ${category.color}15`,
                    backgroundColor: `${category.color}05`,
                    height: "100%",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: category.color,
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                    </Box>
                    {category.limit > 0 && (
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Spent: ₹{category.spent.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.limit > 0
                          ? `Limit: ₹${category.limit.toLocaleString()}`
                          : "No Limit"}
                      </Typography>
                    </Box>

                    {category.limit > 0 ? (
                      <>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(percentage, 100)}
                          color={getProgressColor(percentage)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: `${category.color}20`,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {percentage}% used • ₹
                          {category.remaining.toLocaleString()} remaining
                        </Typography>
                      </>
                    ) : (
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: `${category.color}20`,
                          border: `1px dashed ${category.color}50`,
                        }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {categories.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary",
            }}
          >
            <CategoryIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Categories Yet
            </Typography>
            <Typography variant="body2">
              Create your first category to start tracking expenses
            </Typography>
          </Box>
        )}
      </Card>

      <ExpenseForm
        open={openExpense}
        onClose={() => {
          setOpenExpense(false);
          fetchStats();
        }}
      />
    </Box>
  );
}