import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

type HighlightItem = {
  title: string;
  description: string;
};

type HighlightsProps = {
  items: HighlightItem[];
};

const Highlights = ({ items }: HighlightsProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={1}>
          Highlights
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          }}
        >
          {items.map((item) => (
            <Box key={item.title}>
              <Typography variant="subtitle1" fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export type { HighlightItem, HighlightsProps };
export default Highlights;
