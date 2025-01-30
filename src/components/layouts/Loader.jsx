import React from "react";
import styles from "./loader.module.css";

const Loader = ({ isLoading }) => { // Recibe isLoading como prop
  return (
    <div className={isLoading ? styles.loaderWrapper : ""}>
      {isLoading && (
        <>
          <div className={styles.loader} />
          <div className={styles.loaderSection + " " + styles.sectionLeft} />
          <div className={styles.loaderSection + " " + styles.sectionRight} />
        </>
      )}
    </div>
  );
};

export default Loader;