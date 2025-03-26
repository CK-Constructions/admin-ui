import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Select, MenuItem, Card, CardContent, CardHeader, Tabs, Tab } from "@mui/material";

const monthlyData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 280 },
    { name: "May", value: 590 },
    { name: "Jun", value: 320 },
];

const weeklyData = [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 45 },
    { name: "Thu", value: 50 },
    { name: "Fri", value: 70 },
    { name: "Sat", value: 90 },
    { name: "Sun", value: 60 },
];

export default function OrdersAnalyticsPage() {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [chartType, setChartType] = useState<"bar" | "line">("bar");
    const [timeRange, setTimeRange] = useState<string>("thisMonth");

    return (
        <div className="flex flex-col h-full bg-white p-4">
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar className="flex justify-between">
                    <Typography variant="h6" color="primary">
                        Orders Analytics
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="outlined">Export Report</Button>
                        <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                            <MenuItem value="thisWeek">This Week</MenuItem>
                            <MenuItem value="thisMonth">This Month</MenuItem>
                            <MenuItem value="lastMonth">Last Month</MenuItem>
                            <MenuItem value="thisYear">This Year</MenuItem>
                        </Select>
                    </div>
                </Toolbar>
            </AppBar>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                {["Total Orders", "Revenue", "Avg Order Value", "Conversion Rate"].map((title, index) => (
                    <Card key={index} variant="outlined">
                        <CardHeader title={title} />
                        <CardContent>
                            <Typography variant="h5" color="primary">
                                {index * 1000 + 1200}
                            </Typography>
                            <Typography variant="caption" color={index % 2 === 0 ? "green" : "red"}>
                                {index % 2 === 0 ? "+12.5%" : "-2.3%"} from last month
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)} className="mt-6">
                <Tab label="Orders" />
                <Tab label="Revenue" />
            </Tabs>

            <Card variant="outlined" className="mt-6">
                <CardHeader title={selectedTab === 0 ? "Orders Over Time" : "Revenue Over Time"} />
                <CardContent></CardContent>
            </Card>
        </div>
    );
}
