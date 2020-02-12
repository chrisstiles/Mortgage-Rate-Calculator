import React, { memo } from 'react';
import styles from './Content.module.scss';
import classNames from 'classnames';

export default function ContentWrapper({ controlsOpen }) {
  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.shifted]: controlsOpen
      })}
    >
      <Content />
    </div>
  );
}

const Content = memo(() => {
  return (
    <div className={styles.content}>
      Content here
    </div>
  );
});