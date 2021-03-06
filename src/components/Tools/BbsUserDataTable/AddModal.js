import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Input, Textarea, AttachmentInput, Select, Checkbox } from '../../tools';

class AddModal extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <Modal title={this.props.update ? '编辑' : '添加'}>
        <form onSubmit={this.props.submit}>
          {this.props.columns.map((filed, index) => {
            let ret = false;
            let type = 'none';
            if(this.props.update && filed.updateType) {
              type = filed.updateType;
            } else {
              type = filed.type;
            }
            switch (type) {
              case 'hidden':
                ret = (<input
                  key={`filed_${index}`}
                  type="hidden"
                  name={filed.name}
                  defaultValue={this.props.item[filed.name] || ''}
                />);
                break;
              case 'text':
                ret = (<Input
                  key={`filed_${index}`}
                  labelName={filed.cname}
                  name={filed.name}
                  defaultValue={this.props.item[filed.name] || ''}
                />);
                break;
              case 'textarea':
                ret = (<Textarea
                  key={`filed_${index}`}
                  labelName={filed.cname}
                  name={filed.name}
                  defaultValue={this.props.item[filed.name] || ''}
                />);
                break;
              case 'attachment':
                ret = (<AttachmentInput
                  key={`filed_${index}`}
                  labelName={filed.cname}
                  name={filed.name}
                  defaultValue={this.props.item[filed.name] || ''}
                />);
                break;
              case 'select':
                ret = (<Select
                  key={`filed_${index}`}
                  labelName={filed.cname}
                  name={filed.name}
                  options={filed.getOptions()}
                  defaultValue={this.props.item[filed.name] || ''}
                />);
                break;
              case 'check':
                ret = (<Checkbox
                  key={`filed_${index}`}
                  labelName={filed.cname}
                  name={filed.name}
                  checked={this.props.item[filed.name] || ''}
                />);
                break;
              default:
                break;
            }
            return ret;
          })}
          <div className="form-group row">
            <div className="col-sm-offset-4 col-sm-8 col-md-6">
              <button type="submit" className="btn btn-primary" >提交</button>
            </div>
          </div>
        </form>
      </Modal>
    );
  }
}

AddModal.propTypes = {
  submit: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  item: PropTypes.object,
  update: PropTypes.bool,
}

AddModal.defaultProps = {
  item: {},
  update: false,
}


export default connect()(AddModal);
