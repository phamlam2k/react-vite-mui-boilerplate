import { useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Home from "@mui/icons-material/Home";
import SearchOff from "@mui/icons-material/SearchOff";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center gap-12 p-12"
      style={{ backgroundColor: "var(--mui-palette-background-default)" }}
    >
      <div className="flex flex-col items-center gap-8 text-center max-w-[500px]">
        <div
          className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: "var(--mui-palette-warning-lightOpacity)" }}
        >
          <SearchOff
            style={{
              fontSize: 64,
              color: "var(--mui-palette-warning-main)",
            }}
          />
        </div>

        <Typography
          variant="h1"
          className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-bold leading-tight"
          style={{ color: "var(--mui-palette-text-primary)" }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          className="font-semibold mb-4"
          style={{ color: "var(--mui-palette-text-primary)" }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          className="mb-8 leading-relaxed"
          style={{ color: "var(--mui-palette-text-secondary)" }}
        >
          The page you're looking for doesn't exist or has been moved. Please
          check the URL or return to the homepage.
        </Typography>

        <div className="flex gap-8 flex-wrap justify-center mt-8">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            size="large"
            startIcon={<Home />}
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGoBack}
            size="large"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
