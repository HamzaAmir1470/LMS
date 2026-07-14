import React, { FC } from "react";
import { Modal, Box } from "@mui/material";
import type { ComponentType } from "react";

type ModalComponentProps = {
  setRoute: (route: string) => void;
  setOpen: (open: boolean) => void;
  refetch?: any;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  component: ComponentType<ModalComponentProps>;
  setRoute: (route: string) => void;
  refetch?: any;
};
const CustomModel: FC<Props> = ({
  open,
  setOpen,
  activeItem,
  component: Component,
  setRoute,
  refetch,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[45%] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
        <Component setRoute={setRoute} setOpen={setOpen} refetch={refetch} />
      </Box>
    </Modal>
  );
};

export default CustomModel;
