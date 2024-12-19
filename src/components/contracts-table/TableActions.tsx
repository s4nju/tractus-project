import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const TableActions = ({ onClickDelete, onClickEdit }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <MoreVerticalIcon className="text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onClickEdit}>
          <PencilIcon /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onClickDelete}>
          <TrashIcon className="text-red-500" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
