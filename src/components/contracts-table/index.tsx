import { useState } from "react";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { type ContractType } from "../../store/store";
import { Input } from "../ui/input";
import TableActions from "./TableActions";
import FilterAction from "./FilterAction";
import DeleteConfirmation from "./DeleteConfirmation";
import AddEditContactModal from "./AddEditContactModal";
import { ACTIONS } from "@/constants";

export type Status = "active" | "inactive" | "pending";

const allStatuses: Status[] = ["active", "inactive", "pending"];

const TableComponent = ({
  contracts,
  sendMessage,
}: {
  contracts: ContractType[];
  sendMessage: (message: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"clientName" | "status" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [selectedStatuses, setSelectedStatuses] =
    useState<Status[]>(allStatuses);

  const handleSort = (column: "clientName" | "status") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedContracts = contracts
    .filter(
      (contract) =>
        (contract.clientName.toLowerCase().includes(search.toLowerCase()) ||
          contract.id.toLowerCase().includes(search.toLowerCase())) &&
        selectedStatuses.includes(contract.status)
    )
    .sort((a, b) => {
      if (!sortBy) return 0;

      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleDeleteConfirmation = () => {
    sendMessage(
      JSON.stringify({
        type: ACTIONS.DELETE_CONTRACT,
        data: { id: selectedContractId },
      })
    );
    setShowDeleteDialog(false);
  };

  const handleDelete = (id: string) => {
    setSelectedContractId(id);
    setShowDeleteDialog(true);
  };

  const handleEdit = (id: string) => {
    setSelectedContractId(id);
    setShowEditModal(true);
  };

  const toggleStatus = (status: Status) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status]
    );
  };

  return (
    <div className="w-full space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1 mr-auto">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Contracts
          </h2>
          <p className="text-sm text-muted-foreground">
            Connection status:{" "}
            <span className="text-emerald-400 font-medium">Open</span>
          </p>
        </div>
        <div className="mr-2">
          <Button
            className="mr-2"
            variant="outline"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate New Contract
          </Button>
          <FilterAction
            selectedStatuses={selectedStatuses}
            allStatuses={allStatuses}
            toggleStatus={toggleStatus}
            setSelectedStatuses={setSelectedStatuses}
          />
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter id or name..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px] text-foreground">
                Contract ID
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("clientName")}
                  className="text-foreground hover:text-foreground"
                >
                  Client Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="text-foreground hover:text-foreground"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedContracts.length > 0 ? (
              filteredAndSortedContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-mono text-xs text-foreground">
                    {contract.id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {contract.clientName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        contract.status === "active"
                          ? "success"
                          : contract.status === "pending"
                            ? "warning"
                            : "destructive"
                      }
                      className="capitalize"
                    >
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TableActions
                      onClickDelete={() => handleDelete(contract.id)}
                      onClickEdit={() => handleEdit(contract.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-foreground">
                  No contracts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DeleteConfirmation
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        onDelete={handleDeleteConfirmation}
      />
      {showAddModal || (showEditModal && selectedContractId) ? (
        <AddEditContactModal
          sendMessage={sendMessage}
          formData={
            selectedContractId
              ? contracts.find((c) => c.id === selectedContractId)
              : undefined
          }
          modalMode={showEditModal ? "edit" : "add"}
          showAddModal={showAddModal || showEditModal}
          allStatuses={allStatuses}
          setShowAddModal={setShowAddModal}
          setShowEditModal={setShowEditModal}
          setSelectedContractId={setSelectedContractId}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TableComponent;
