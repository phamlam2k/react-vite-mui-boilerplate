import { ColorKeys } from "@core/constants/colors";
import useColorsStore from "@shared/stores/colors.store";
import baseColors from "@themes/colors/base";
import clsx from "clsx";

function ColorSettingPage() {
  const colors = useColorsStore((state) => state.colors);
  const setColors = useColorsStore((state) => state.setColors);

  return (
    <div className="p-4">
      <h4>Color Setting</h4>

      <div className="flex flex-wrap gap-2">
        {Object.values(ColorKeys).map((key) => (
          <div
            key={key}
            className={clsx(
              "p-2 rounded-md w-10 h-10 flex items-center justify-center",
              "text-white cursor-pointer"
            )}
            style={{
              backgroundColor: baseColors[key as keyof typeof baseColors][500],
            }}
            onClick={() => setColors(key)}
          >
            {colors === key && "✓"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColorSettingPage;
