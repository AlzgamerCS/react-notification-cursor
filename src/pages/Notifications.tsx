import { Box, Typography, Paper } from "@mui/material";
import { Description as DocumentIcon } from "@mui/icons-material";

interface Notification {
  id: number;
  date: string;
  title: string;
  department: string;
}

let NotificationsList: Notification[] = [
  {
    id: 1,
    date: "Friday, 28 March 2025",
    title:
      "Dormitory Agreement of an International Student Martin Walter Johnson",
    department: "Department of Housing and Student Services",
  },
  {
    id: 2,
    date: "Sunday, 30 March 2025",
    title: "Microsoft Office Subscription",
    department: "Department of Computer Science and Data Science",
  },
  {
    id: 3,
    date: "Wednesday, 2 April 2025",
    title:
      "Dormitory Agreement of an International Student Martin Walter Johnson",
    department: "Department of Housing and Student Services",
  },
  {
    id: 4,
    date: "Friday, 4 April 2025",
    title:
      "Dormitory Agreement of an International Student Martin Walter Johnson",
    department: "Department of Housing and Student Services",
  },
];

NotificationsList = NotificationsList.concat(NotificationsList);

const Notifications = () => {
  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", pt: 60 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 4 }}>
        Your Notifications
      </Typography>

      {NotificationsList.map((notification) => (
        <Paper
          key={notification.id}
          sx={{
            mb: 2,
            p: 2,
            "&:hover": {
              boxShadow: 3,
              cursor: "pointer",
              bgcolor: "rgba(251, 148, 85, 0.04)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <DocumentIcon
              sx={{
                color: "text.secondary",
                bgcolor: "background.paper",
                p: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {notification.date}
              </Typography>
              <Typography variant="subtitle1" component="h2" gutterBottom>
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notification.department}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default Notifications;
