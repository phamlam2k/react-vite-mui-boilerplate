import Button from "@mui/material/Button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button variant="contained">Click me</Button>
    </div>
  );
}
