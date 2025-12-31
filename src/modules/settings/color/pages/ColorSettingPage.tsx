import useColorsStore from "@shared/stores/colors.store";
import baseColors from "@themes/colors/base";
import clsx from "clsx";
import { useState } from "react";
import ColorsDemoComp from "../components/ColorsDemoComp";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const PrimaryComp = styled("div")(({ color }: { color: string }) => ({
  backgroundColor: color,
}));

function ColorSettingPage() {
  const colorKey = useColorsStore((state) => state.colorKey);
  const setColor = useColorsStore((state) => state.setColor);

  const [colorState, setColorState] = useState<string>(colorKey);
  const baseColor = baseColors?.[colorState as keyof typeof baseColors][600];

  const handleSaveChanges = () => {
    setColor(colorState);
  };

  return (
    <div className="p-4">
      <h4>Color Setting</h4>

      <PrimaryComp
        color={baseColor}
        className="py-2 px-4 rounded-full text-white w-fit my-4"
      >
        Theming
      </PrimaryComp>

      <div className="flex flex-col gap-2">
        <p>Primary Color</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(baseColors).map((key: string) => {
            return (
              <div
                key={key}
                className="p-1 rounded-md"
                style={{
                  border: `1px solid ${
                    colorState === key ? baseColor : baseColors["gray"][300]
                  }`,
                }}
              >
                <PrimaryComp
                  color={baseColors[key as keyof typeof baseColors][600]}
                  className={clsx(
                    "rounded-md w-10 h-10 flex items-center justify-center",
                    "text-white cursor-pointer"
                  )}
                  onClick={() => setColorState(key)}
                >
                  {colorState === key && "✓"}
                </PrimaryComp>
              </div>
            );
          })}
        </div>
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
