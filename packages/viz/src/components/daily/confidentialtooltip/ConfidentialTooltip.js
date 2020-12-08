/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A confidRTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import Tooltip from '../../common/tooltips/Tooltip';
import colors from '../../../styles/colors.css';
import styles from './ConfidentialTooltip.css';

import {Grid} from '@material-ui/core';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockIcon from '@material-ui/icons/LockOutlined';

// import lock from '../../../images/lock.png';

const t = i18next.t.bind(i18next);

class ConfidentialTooltip extends React.Component {

  renderConfidential(c) {
    return <Grid container direction="row" alignItems="center" justify="center">
      <Grid item> 
      {/* <img src={lock} height={20} className={styles.icon}/> */}
      <LockIcon className={styles.icon} /> 
      </Grid>
      <Grid item> {t('Confidential Mode')} </Grid>
    </Grid>;
  }

  render() {
    const { confidential, timePrefs, title } = this.props;
    let dateTitle = null;
    if (title === null) {
      dateTitle = {
        normalTime: confidential.normalTime,
        timezone: _.get(confidential, 'timezone', 'UTC'),
        timePrefs,
      };
    }

    return (
      <Tooltip
        {...this.props}
        title={title}
        dateTitle={dateTitle}
        content={this.renderConfidential(confidential)}
      />
    );
  }
}

ConfidentialTooltip.propTypes = {
  position: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  offset: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number,
    horizontal: PropTypes.number,
  }),
  title: PropTypes.node,
  tail: PropTypes.bool.isRequired,
  side: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,
  tailColor: PropTypes.string.isRequired,
  tailWidth: PropTypes.number.isRequired,
  tailHeight: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  confidential: PropTypes.shape({
    duration: PropTypes.shape({
      units: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  timePrefs: PropTypes.object.isRequired,
};

ConfidentialTooltip.defaultProps = {
  tail: true,
  side: 'right',
  tailWidth: 9,
  tailHeight: 17,
  tailColor: colors.confidentialMode,
  borderColor: colors.confidentialMode,
  borderWidth: 2,
  title: null,
};

export default ConfidentialTooltip;
