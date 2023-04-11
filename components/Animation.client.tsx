"use client";

import { ComponentProps } from "react";
import Rive from "@rive-app/react-canvas";
import { RiveProps } from "@rive-app/react-canvas/dist/types/components/Rive";

const Animation = (props: RiveProps & ComponentProps<"canvas">) => (
  <Rive {...props} />
);

export default Animation;
