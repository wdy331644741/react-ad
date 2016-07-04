import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { fetchAction } from '../../../actions/omg';

import UploadBtn from '../UploadBtn';
import Alert from '../Alert';
import ImgBox from '../ImgBox';
import { ATTACHMENT_ADD, ATTACHMENT_LIST } from '../../../constants/';

class AttachmentInput extends Component {
  constructor(props) {
    super(props);
    this.imgUpload = this.imgUpload.bind(this);
    this.state = {
      errorMsg: '',
      type: 'test',
      value: '',
      src: '',
    };
  }
  imgUpload(res) {
    if (res.error_code === 0) {
      this.setState({
        value: res.data.url,
      });
      this.refs.hiddenInput.value = res.data.url;
    } else {
      this.setState({
        errorMsg: res.data.error_msg,
      });
    }
  }
  render() {
    return (
      <div>
        <Alert msg={this.state.errorMsg} />
        <div className="form-group row">
          <input type="hidden" ref="hiddenInput" name={this.props.name} defaultValue={this.props.defaultValue} />
          <label
            className="col-sm-4 form-control-label text-xs-right"
          >{this.props.labelName}:</label>
          <div className="col-sm-3" >
            <ImgBox src={this.state.value} />
          </div>
          <div className="col-sm-3">
            <UploadBtn callback={this.imgUpload} position={this.props.position} />
            <button hidden className="btn btn-sm btn-info" type="button">选择</button>
          </div>
        </div>
      </div>
    );
  }
}

AttachmentInput.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  type: PropTypes.string,
  defaultValue: PropTypes.any,
  required: PropTypes.bool,
}

AttachmentInput.defaultProps = {
  required: false,
  type: 'text',
}

export default connect()(AttachmentInput);