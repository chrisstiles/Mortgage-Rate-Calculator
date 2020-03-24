import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import styles from './MobileInputs.module.scss';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';
import classNames from 'classnames';

const MobileInputs = memo(React.forwardRef(({
  controlsOpen,
  children,
  setControlsOpen,
}, ref) => {
  return ReactDOM.createPortal(
    <RemoveScroll enabled={controlsOpen}>
      <div
        ref={ref}
        className={classNames(styles.wrapper, {
          [styles.open]: controlsOpen
        })}
        onClick={() => setControlsOpen(false)}
      >
        <div
          className={styles.content}
        >
          <FocusLock disabled={!controlsOpen}>
            {children}
          </FocusLock>
        </div>
      </div>
    </RemoveScroll>, document.body);
}));

export default MobileInputs;