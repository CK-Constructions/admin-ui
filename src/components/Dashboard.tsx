import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Stack, Paper, styled, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  CheckCircle as CompletedIcon,
  Verified as ConfirmedIcon,
  AccountCircle as ClientIcon,
  HourglassEmpty as PendingIcon,
  PersonAdd as SellerVerificationIcon,
  PersonRemove as UserDeletionIcon,
} from "@mui/icons-material";

// Styled components
const StatCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  borderRadius: "12px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const StatIconWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const RequestTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: "12px",
  overflow: "hidden",
})) as typeof TableContainer;

// Types
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Request {
  id: string;
  type: "order" | "seller" | "deletion";
  name: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

// Mock data
const mockRequests: Request[] = [
  { id: "#ORD-001", type: "order", name: "John Doe", date: "2023-05-15 10:30", status: "pending" },
  { id: "#SEL-005", type: "seller", name: "Acme Corp", date: "2023-05-15 09:15", status: "pending" },
  { id: "#DEL-002", type: "deletion", name: "Jane Smith", date: "2023-05-14 16:45", status: "pending" },
  { id: "#ORD-002", type: "order", name: "Mike Johnson", date: "2023-05-14 14:20", status: "approved" },
  { id: "#SEL-006", type: "seller", name: "Global Goods", date: "2023-05-14 11:10", status: "rejected" },
];

// Tab panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const [value, setValue] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Filter requests by type
  const orderRequests = mockRequests.filter((req) => req.type === "order");
  const sellerRequests = mockRequests.filter((req) => req.type === "seller");
  const deletionRequests = mockRequests.filter((req) => req.type === "deletion");

  // Update current time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 3, backgroundColor: "white" }}>
      {/* Date and Time */}
      <Typography variant="h5" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {currentDateTime}
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{ my: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          <StatCard>
            <StatCardContent>
              <StatIconWrapper sx={{ bgcolor: "primary.light" }}>
                <PeopleIcon color="primary" />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Sellers
                </Typography>
                <Typography variant="h4">1,248</Typography>
              </Box>
            </StatCardContent>
          </StatCard>

          <StatCard>
            <StatCardContent>
              <StatIconWrapper sx={{ bgcolor: "secondary.light" }}>
                <OrdersIcon color="secondary" />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
                <Typography variant="h4">5,672</Typography>
              </Box>
            </StatCardContent>
          </StatCard>

          <StatCard>
            <StatCardContent>
              <StatIconWrapper sx={{ bgcolor: "success.light" }}>
                <CompletedIcon color="success" />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Completed Orders
                </Typography>
                <Typography variant="h4">4,189</Typography>
              </Box>
            </StatCardContent>
          </StatCard>

          <StatCard>
            <StatCardContent>
              <StatIconWrapper sx={{ bgcolor: "info.light" }}>
                <ConfirmedIcon color="info" />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Confirmed Orders
                </Typography>
                <Typography variant="h4">4,853</Typography>
              </Box>
            </StatCardContent>
          </StatCard>

          <StatCard>
            <StatCardContent>
              <StatIconWrapper sx={{ bgcolor: "warning.light" }}>
                <ClientIcon color="warning" />
              </StatIconWrapper>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Clients
                </Typography>
                <Typography variant="h4">8,742</Typography>
              </Box>
            </StatCardContent>
          </StatCard>
        </Stack>
      </Box>

      {/* Requests Tabs */}
      <Paper sx={{ p: 3, borderRadius: "12px" }}>
        <Typography variant="h6" gutterBottom>
          Pending Requests
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="request tabs">
            <Tab label="Order Confirmations" icon={<PendingIcon />} {...a11yProps(0)} />
            <Tab label="Seller Verifications" icon={<SellerVerificationIcon />} {...a11yProps(1)} />
            <Tab label="Account Deletions" icon={<UserDeletionIcon />} {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <RequestTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Chip label={request.status} color={request.status === "approved" ? "success" : request.status === "rejected" ? "error" : "warning"} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </RequestTableContainer>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <RequestTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Seller ID</TableCell>
                  <TableCell>Business Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sellerRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Chip label={request.status} color={request.status === "approved" ? "success" : request.status === "rejected" ? "error" : "warning"} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </RequestTableContainer>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <RequestTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deletionRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Chip label={request.status} color={request.status === "approved" ? "success" : request.status === "rejected" ? "error" : "warning"} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </RequestTableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Dashboard;
