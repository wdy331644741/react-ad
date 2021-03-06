import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Submit, Input } from '../../tools';


class PaymentNum extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <form onSubmit={this.props.submit}>
        <input type="hidden" name="activity_id" value={this.props.activityId} />
        <Input type="number" name="min_num" labelName="回款次数 >" />
        <Input type="number" name="max_num" labelName="回款次数 <=" />
        <Submit />
      </form>
    );
  }
}

PaymentNum.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activityId: PropTypes.number.isRequired,
  submit: PropTypes.func.isRequired,
}

export default connect()(PaymentNum);
