import { Search } from "lucide-react";
import { Input } from "../ui/input";

export const SearchBar = () => {
  return (
    <div className="relative md:w-64">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" />
      <Input
        type="search"
        placeholder="Search OVA..."
        className="w-full"
      />
    </div>
  );
};
