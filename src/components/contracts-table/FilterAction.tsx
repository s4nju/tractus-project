import { Filter } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Status } from "./index";

const FilterAction = ({
  selectedStatuses,
  allStatuses,
  toggleStatus,
  setSelectedStatuses,
}: {
  selectedStatuses: string[];
  allStatuses: Status[];
  toggleStatus: (status: string) => void;
  setSelectedStatuses: (statuses: Status[]) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-foreground">
          <Filter className="mr-2 h-4 w-4" />
          Filter Status
          {selectedStatuses.length < allStatuses.length && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1">
              {selectedStatuses.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {allStatuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={selectedStatuses.includes(status)}
            onCheckedChange={() => toggleStatus(status)}
          >
            <Badge
              variant={
                status === "active"
                  ? "success"
                  : status === "pending"
                    ? "warning"
                    : "destructive"
              }
              className="mr-2 capitalize"
            >
              {status}
            </Badge>
            {selectedStatuses.includes(status) ? "Shown" : "Hidden"}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setSelectedStatuses(allStatuses)}>
          Show All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedStatuses([])}>
          Hide All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterAction;
