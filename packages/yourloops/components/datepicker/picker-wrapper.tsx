import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";

interface PickerWrapperProps {
  children: ReactElement;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: "absolute",
      top: "15px",
      left: "5px",
      padding: "20px 30px",
      border: "1px solid black",
      borderRadius: "8px",
      zIndex: 10,
    },
  })
);

const PickerWrapper: FunctionComponent<PickerWrapperProps> = (props: PickerWrapperProps) => {
  const { container } = useStyles();

  /**
   * checking if the click is outside the picker
   * dispatching a global event if it's the case
   */
  const handleClick = (event: Event) => {
    let element = event.target as HTMLElement | null;
    let isInsideWrapper = false;

    while (element !== null && !isInsideWrapper) {
      isInsideWrapper = element.classList.contains('picker-wrapper');
      element = element.parentElement;
    }

    if (!isInsideWrapper) {
      event.stopPropagation();
      const closeEvent = new Event('close-date-picker');
      document.dispatchEvent(closeEvent);
    }
  };

  useEffect(() => {
    const body = document.getElementsByTagName('body');
    body[0].addEventListener("click", handleClick);
    return () => {
      body[0].removeEventListener("click", handleClick);
    };
  });

  return (
    <div className={`${container} picker-wrapper`}>
      {props.children}
    </div>
  );
};

export default PickerWrapper;
