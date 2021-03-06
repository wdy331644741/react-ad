import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Input extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.value) {
      this.refs.input.value = this.props.value;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.props.value) {
      this.refs.input.value = nextProps.value;
    }
  }
  render() {
    if (this.props.hidden) {
      return false;
    }
    return (
      <div className="form-group row">
        <label
          className="col-sm-4 form-control-label text-xs-right"
        >{this.props.labelName}:</label>
        <div className="col-sm-6">
          <input
            ref="input"
            placeholder={this.props.placeholder}
            required={this.props.required}
            type={this.props.type}
            name={this.props.name}
            className="form-control"
            defaultValue={this.props.defaultValue}
            onChange={this.props.onChange}
          />
        </div>
      </div>
    );
  }
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  type: PropTypes.string,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  required: PropTypes.bool,
  hidden: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}

Input.defaultProps = {
  required: false,
  type: 'text',
  onChange: () => {},
}

export default Input;
