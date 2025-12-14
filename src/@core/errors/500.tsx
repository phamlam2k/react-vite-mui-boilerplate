import { useNavigate, type RouteObject } from "react-router";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ErrorOutline, Home, Refresh } from "@mui/icons-material";

export const internalServerErrorRoute: RouteObject = {
  path: "/500",
  element: <InternalServerErrorPage />,
};

function InternalServerErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center gap-12 p-12"
      style={{ backgroundColor: "var(--mui-palette-background-default)" }}
    >
      <div className="flex flex-col items-center gap-8 text-center max-w-[500px]">
        <div
          className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: "var(--mui-palette-error-lightOpacity)" }}
        >
          <ErrorOutline
            style={{
              fontSize: 64,
              color: "var(--mui-palette-error-main)",
            }}
          />
        </div>

        <Typography
          variant="h1"
          className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-bold leading-tight"
          style={{ color: "var(--mui-palette-text-primary)" }}
        >
          500
        </Typography>

        <Typography
          variant="h5"
          className="font-semibold mb-4"
          style={{ color: "var(--mui-palette-text-primary)" }}
        >
          Internal Server Error
        </Typography>

        <Typography
          variant="body1"
          className="mb-8 leading-relaxed"
          style={{ color: "var(--mui-palette-text-secondary)" }}
        >
          Something went wrong on our end. We're working to fix the issue.
          Please try again later or contact support if the problem persists.
        </Typography>

        <div className="flex gap-8 flex-wrap justify-center mt-8">
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            size="large"
            startIcon={<Refresh />}
          >
            Refresh Page
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleGoHome}
            size="large"
            startIcon={<Home />}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InternalServerErrorPage;
