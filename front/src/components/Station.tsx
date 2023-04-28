import { useState } from "react";
import { ReactComponent as Icon } from "../assets/charging-station-solid.svg";
import {
  useFloating,
  useHover,
  useInteractions,
  useFocus,
  useDismiss,
  useRole,
  autoPlacement,
} from "@floating-ui/react";
import { Box, Heading } from "@chakra-ui/react";

export type StationProps = {
  name: string;
  info?: {
    chargePointModel: string;
    chargePointVendor: string;
  };
};

export default function Station({ name, info }: StationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { x, y, strategy, refs, context } = useFloating({
    middleware: [autoPlacement()],
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <Box ref={refs.setReference} {...getReferenceProps()}>
        <Icon />
        <Heading>{name}</Heading>
      </Box>
      {isOpen && (
        <Box
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: "max-content",
          }}
          p={3}
          m={3}
          bg="gray.900"
          color="white"
          rounded="lg"
          {...getFloatingProps()}
        >
          {info ? (
            <>
              {info.chargePointModel}
              <br />
              {info.chargePointVendor}
            </>
          ) : (
            <>Carregando...</>
          )}
        </Box>
      )}
    </>
  );
}
