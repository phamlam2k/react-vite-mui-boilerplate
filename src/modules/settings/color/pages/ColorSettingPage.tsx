import { ColorKeys } from "@core/constants/colors";
import useColorsStore from "@shared/stores/colors.store";
import baseColors from "@themes/colors/base";
import clsx from "clsx";
import { useState } from "react";
import ColorsDemoComp from "../components/ColorsDemoComp";
import Button from "@mui/material/Button";

function ColorSettingPage() {
  const colors = useColorsStore((state) => state.colors);
  const setColors = useColorsStore((state) => state.setColors);

  const [color, setColor] = useState<string>(colors);
  const baseColor = baseColors[color as keyof typeof baseColors][600];

  const handleSaveChanges = () => {
    setColors(color);
    window.location.reload();
  };

  return (
    <div className="p-4">
      <h4>Color Setting</h4>

      <div className="flex flex-wrap gap-2 mt-4">
        {Object.values(ColorKeys).map((key) => (
          <div
            key={key}
            className={clsx(
              "p-2 rounded-md w-10 h-10 flex items-center justify-center",
              "text-white cursor-pointer"
            )}
            style={{
              backgroundColor: baseColors[key as keyof typeof baseColors][600],
            }}
            onClick={() => setColor(key)}
          >
            {color === key && "✓"}
          </div>
        ))}
      </div>

      <div className="my-4">
        <ColorsDemoComp color={baseColor} />
      </div>

      <Button variant="contained" color="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </div>
  );
}

export default ColorSettingPage;
