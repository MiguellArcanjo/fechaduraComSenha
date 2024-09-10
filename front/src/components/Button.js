import React from 'react';

import PropTypes from 'prop-types';
import styles from "@/components/style.module.css"


function Button({valor, value, NewNumber}) {
  return (
    <div className={styles.divTeste}>
        <button 
            className={styles.btn} 
            onClick={NewNumber}
            value={value}
        >{valor}</button>
    </div>
  )
}


Button.propTypes = {
    valor: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    NewNumber: PropTypes.func,
}

export default Button;