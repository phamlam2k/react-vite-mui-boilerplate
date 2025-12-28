import ThemeToggle from "@shared/components/ThemeToggle";

const Header = () => {
  return (
    <div className="h-14 px-5 bg-primary flex items-center justify-between">
      <div></div>

      <ThemeToggle className="relative right-0 top-0" />
    </div>
  );
};

export default Header;
