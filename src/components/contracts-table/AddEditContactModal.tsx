import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import * as z from "zod";
import { Status } from ".";
import { ACTIONS } from "@/constants";

const formSchema = z.object({
  id: z.string(),
  clientName: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  status: z.enum(["active", "inactive", "pending"]),
});

const AddEditContactModal = ({
  sendMessage,
  formData = {
    id: "",
    clientName: "",
    status: "active",
  },
  modalMode,
  showAddModal,
  allStatuses,
  setShowAddModal,
  setShowEditModal,
  setSelectedContractId,
}: {
  sendMessage: (message: string) => void;
  formData?: {
    id: string;
    clientName: string;
    status: Status;
  };
  modalMode: "edit" | "add";
  showAddModal: boolean;
  allStatuses: Status[];
  setShowAddModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setSelectedContractId: (id: string) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    sendMessage(JSON.stringify({ type: ACTIONS.ADD_CONTRACT, data: values }));
    setShowAddModal(false);
    setSelectedContractId("");
    form.reset();
  };

  const onEdit = (values: z.infer<typeof formSchema>) => {
    sendMessage(JSON.stringify({ type: ACTIONS.EDIT_CONTRACT, data: values }));
    setShowEditModal(false);
    setSelectedContractId("");
    form.reset();
  };

  return (
    <Dialog
      open={showAddModal}
      onOpenChange={modalMode === "add" ? setShowAddModal : setShowEditModal}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {modalMode === "add" ? "Add New Contract" : "Edit Contract"}
          </DialogTitle>
          <DialogDescription>
            {modalMode === "add"
              ? "Create a new contract. Click save when you're done."
              : "Edit contract details. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={
              modalMode === "add"
                ? form.handleSubmit(onSubmit)
                : form.handleSubmit(onEdit)
            }
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <Badge
                            variant={
                              status === "active"
                                ? "success"
                                : status === "pending"
                                  ? "warning"
                                  : "destructive"
                            }
                            className="capitalize"
                          >
                            {status}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Contract</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditContactModal;
