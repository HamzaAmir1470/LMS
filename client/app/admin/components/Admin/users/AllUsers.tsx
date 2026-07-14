"use client";

import React, { FC, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../../../components/Loader/Loader";
import { format } from "timeago.js";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");

  // State for the custom delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const { theme } = useTheme();

  const { data, isLoading, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const [
    updateUserRole,
    {
      isLoading: mutationLoading,
      isSuccess: updateSuccess,
      error: updateError,
    },
  ] = useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation();

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      toast.success("Member updated successfully!");
      setActive(false);
      setEmail("");
    }
    if (updateError) {
      const errorData = updateError as any;
      toast.error(errorData?.data?.message || "Something went wrong");
    }
  }, [updateSuccess, updateError, refetch]);

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      toast.success("User deleted successfully!");
    }
    if (deleteError) {
      const errorData = deleteError as any;
      toast.error(errorData?.data?.message || "Failed to delete user");
    }
  }, [deleteSuccess, deleteError, refetch]);

  // Triggers the MUI dialog instead of window.confirm
  const handleDeleteClick = (id: string) => {
    setUserIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Executes the actual mutation when the user clicks confirm
  const handleConfirmDelete = async () => {
    if (userIdToDelete) {
      await deleteUser(userIdToDelete);
    }
    setOpenDeleteDialog(false);
    setUserIdToDelete(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserIdToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    await updateUserRole({ email, role });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.7 },
    { field: "role", headerName: "Role", flex: 0.3 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.3 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <Box className="flex items-center justify-center h-full w-full">
            <Button
              className="min-w-0 p-2"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <AiOutlineDelete
                size={20}
                className="dark:text-white text-black hover:text-red-500 transition-colors"
              />
            </Button>
          </Box>
        );
      },
    },
    {
      field: "mail",
      headerName: "Email",
      flex: 0.2,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <Box className="flex items-center justify-center h-full w-full">
            <a href={`mailto:${params.row.email}`} className="min-w-0 p-2">
              <AiOutlineMail
                size={20}
                className="dark:text-white text-black hover:text-green-500 transition-colors"
              />
            </a>
          </Box>
        );
      },
    },
  ];

  type UserItem = {
    _id: string;
    name: string;
    email: string;
    role: string;
    courses: string[];
    createdAt: string;
  };

  const filteredUsers = isTeam
    ? data?.users?.filter((item: UserItem) => item.role === "admin")
    : data?.users;

  const rows =
    filteredUsers?.map((item: UserItem) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      courses: item.courses.length,
      created_at: format(item.createdAt),
    })) ?? [];

  return (
    <div className="w-full md:pl-[20px] pr-[20px] mt-[120px] overflow-x-hidden">
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ mx: "auto" }} className="max-w-[98%]">
          <div className="w-full flex justify-end mb-5">
            <div
              className={`${styles.button} !mt-0 !w-[200px] dark:bg-[#57c7a3] h-35px! dark:border dark:border-[#ffffff6c] cursor-pointer`}
              onClick={() => setActive(true)}
            >
              Add New Member
            </div>
          </div>
          <Box
            sx={{
              mt: "40px",
              height: "80vh",
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
              "& .MuiSvgIcon-root": {
                color: theme === "dark" ? "#fff !important" : "#000 !important",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff20 !important"
                    : "1px solid #e0e0e0 !important",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor:
                  theme === "dark"
                    ? "#2A3B56 !important"
                    : "#f1f1f1 !important",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor:
                  theme === "dark"
                    ? "#1c2c42 !important"
                    : "#e2e8f0 !important",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor:
                  theme === "dark"
                    ? "#2A3B56 !important"
                    : "#cbd5e1 !important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeaderRow": {
                backgroundColor:
                  theme === "dark"
                    ? "#1F2A40 !important"
                    : "#f5f5f5 !important",
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor:
                  theme === "dark"
                    ? "#1F2A40 !important"
                    : "#f5f5f5 !important",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#fff",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#2190ff",
              },
              "& .MuiCheckbox-root": {
                color: `${theme === "dark" ? "#fff" : "#000"} !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: theme === "dark" ? "#fff !important" : "#000 !important",
              },
            }}
          >
            <DataGrid
              checkboxSelection
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
            />
          </Box>

          {/* Add Member Modal */}
          <Modal
            open={active}
            onClose={() => setActive(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow-xl p-6 outline-none border border-gray-200 dark:border-slate-800 transition-all">
              <h1
                className={`${styles.title} !text-[24px] text-black dark:text-white`}
              >
                Add New Team Member
              </h1>
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <TextField
                    type="email"
                    label="User Email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: theme === "dark" ? "#fff" : "#000",
                        "& fieldset": {
                          borderColor: theme === "dark" ? "#ffffff40" : "#ccc",
                        },
                        "&:hover fieldset": {
                          borderColor: theme === "dark" ? "#fff" : "#000",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#57c7a3",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: theme === "dark" ? "#ffffffb3" : "#666",
                        "&.Mui-focused": {
                          color: "#57c7a3",
                        },
                      },
                    }}
                  />
                </div>

                <FormControl fullWidth variant="outlined">
                  <InputLabel
                    id="role-select-label"
                    sx={{
                      color: theme === "dark" ? "#ffffffb3" : "#666",
                      "&.Mui-focused": {
                        color: "#57c7a3",
                      },
                    }}
                  >
                    Role
                  </InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    label="Role"
                    sx={{
                      color: theme === "dark" ? "#fff" : "#000",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme === "dark" ? "#ffffff40" : "#ccc",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme === "dark" ? "#fff" : "#000",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#57c7a3",
                      },
                      "& .MuiSvgIcon-root": {
                        color: theme === "dark" ? "#fff" : "#000",
                      },
                    }}
                    MenuProps={{
                      slotProps: {
                        paper: {
                          sx: {
                            backgroundColor:
                              theme === "dark"
                                ? "#1e293b !important"
                                : "#fff !important",
                            border:
                              theme === "dark"
                                ? "1px solid #ffffff15"
                                : "1px solid #e2e8f0",
                            "& .MuiMenuItem-root": {
                              color:
                                theme === "dark"
                                  ? "#fff !important"
                                  : "#000 !important",
                              "&:hover": {
                                backgroundColor:
                                  theme === "dark"
                                    ? "#334155 !important"
                                    : "#f1f5f9 !important",
                              },
                              "&.Mui-selected": {
                                backgroundColor:
                                  theme === "dark"
                                    ? "#475569 !important"
                                    : "#e2e8f0 !important",
                                "&:hover": {
                                  backgroundColor:
                                    theme === "dark"
                                      ? "#64748b !important"
                                      : "#cbd5e1 !important",
                                },
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>

                <div className="w-full flex justify-end gap-4 pt-4">
                  <Button
                    onClick={() => setActive(false)}
                    variant="outlined"
                    sx={{
                      color: theme === "dark" ? "#fff" : "#000",
                      borderColor: theme === "dark" ? "#ffffff40" : "#ccc",
                      "&:hover": {
                        borderColor: theme === "dark" ? "#fff" : "#000",
                        backgroundColor:
                          theme === "dark" ? "#ffffff10" : "#f8fafc",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={mutationLoading}
                    sx={{
                      backgroundColor: "#57c7a3",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#45a384",
                      },
                      "&.Mui-disabled": {
                        backgroundColor:
                          theme === "dark" ? "#334155" : "#e2e8f0",
                        color: theme === "dark" ? "#64748b" : "#94a3b8",
                      },
                    }}
                  >
                    {mutationLoading ? "Adding..." : "Submit"}
                  </Button>
                </div>
              </form>
            </Box>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="delete-user-modal"
          >
            <Box
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[90%] sm:w-[420px]
                bg-white dark:bg-slate-900
                rounded-lg
                border border-gray-200 dark:border-slate-800
                shadow-2xl
                outline-none
                p-8"
            >
              <h2
                className="
                    text-2xl
                    font-semibold
                    text-center
                    text-black
                    dark:text-white"
              >
                Are you sure you want to delete this user?
              </h2>

              <div className="flex justify-center gap-6 mt-8">
                <Button
                  onClick={handleCloseDeleteDialog}
                  variant="contained"
                  sx={{
                    backgroundColor: "#57c7a3",
                    color: "#fff",
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 4,
                    "&:hover": {
                      backgroundColor: "#45a384",
                    },
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  sx={{
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    textTransform: "none",
                    borderRadius: "999px",
                    px: 4,
                    "&:hover": {
                      backgroundColor: "#dc2626",
                    },
                  }}
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>
        </Box>
      )}
    </div>
  );
};

export default AllUsers;
