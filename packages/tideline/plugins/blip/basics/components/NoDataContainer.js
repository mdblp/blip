
import _ from 'lodash';
import i18next from 'i18next';
import React from 'react';
import PropTypes from 'prop-types';

var t = i18next.t.bind(i18next);

class NoDataContainer extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    moreInfo: PropTypes.string
  };

  static defaultProps = {
    message: t('No available data to display here, sorry!')
  };

  render() {
    var moreInfo = null;
    if (!_.isEmpty(this.props.moreInfo)) {
      moreInfo = (
        <p>{this.props.moreInfo}</p>
      );
    }
    return (
      <div className="NoDataContainer">
        <p>{this.props.message}</p>
        {moreInfo}
      </div>
    );
  }
}

module.exports = NoDataContainer;
