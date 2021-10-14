import React, { FunctionComponent } from "react";
import PickerWrapper from "./picker-wrapper";
import BasePicker from "./base-picker";

const DesktopPicker: FunctionComponent = () => {
  return (
    <PickerWrapper>
      <BasePicker />
    </PickerWrapper>
  );
};

export default DesktopPicker;
