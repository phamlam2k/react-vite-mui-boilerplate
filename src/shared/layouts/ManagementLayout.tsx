import { createContext, useState } from "react";

const ManagementLayoutContext = createContext({});

const ManagementLayout = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <ManagementLayoutContext.Provider
      value={{ filters, setFilters, selectedItems, setSelectedItems }}
    >
      {children}
    </ManagementLayoutContext.Provider>
  );
};

ManagementLayout.Header = function Header() {
  return <div>Header</div>;
};

ManagementLayout.Filters = function Filters() {
  return <div>Filters</div>;
};

export default ManagementLayout;
