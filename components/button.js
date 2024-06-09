
import React from 'react';
import classes from './button.module.css';

export const ToggleButton = ({ buttonState, handleClick }) => {
  return (
    <button
      type="button"
      className={`${classes.button} ${buttonState ? classes.activeButton : classes.inactiveButton}`}
      onClick={handleClick}
    />
  );
};

export const ScrollToTopButton = ({ handleScrollToTop }) => {
  return (
    <button
      type="button"
      className={classes.scrollToTopButton}
      onClick={handleScrollToTop}
    >
      ▲
    </button>
  );
};
