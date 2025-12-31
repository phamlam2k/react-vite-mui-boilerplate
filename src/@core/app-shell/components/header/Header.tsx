import ThemeToggle from "@shared/components/ThemeToggle";

const Header = () => {
  console.log("render header");
  return (
    <div className="pt-2 sticky top-0 z-10 bg-(--mui-palette-background-default) opacity-95">
      <div className="flex items-center gap-2 h-10 py-6 bg-(--mui-palette-background-paper) w-full justify-between rounded-md">
        <div></div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="relative right-0 top-0" />
        </div>
      </div>
    </div>
  );
};

export default Header;
