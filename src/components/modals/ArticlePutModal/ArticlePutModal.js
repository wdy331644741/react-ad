/**
 * Created by Administrator on 2016/6/17.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { commonFetch } from '../../../actions/omg';
import { hideModal } from '../../../actions/modal';
import { getConfig } from '../../../config/omg';
import Alert from '../../tools/Alert';
import Input from '../../tools/Input';
import Select from '../../tools/Select';
import Textarea from '../../tools/Textarea'
import ModalHeader from '../../tools/ModalHeader';

import { ARTICLE_ADD, ARTICLE_LIST,ARTICLE_TYPE_LIST ,ARTICLE_DETAIL,ARTICLE_PUT} from '../../../constants'

class ArticlePutModal extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    const releaseTypes = getConfig("release");
    const platformTypes = getConfig("platform");
    this.releaseTypeChange = this.releaseTypeChange.bind(this);
    this.platformTypeChange = this.platformTypeChange.bind(this);
    this.state = {
      releaseType:0,
      platformType:0,
      platformTypes,
      releaseTypes,
    }
  }
  releaseTypeChange(e) {
    const value = $(e.target).val();
    this.setState({
      releaseType: +value,
    });
  }
  platformTypeChange(e) {
    const value = $(e.target).val();
    this.setState({
      platformType: +value,
    });
  }
  componentDidMount(){
    const id = this.props.articleId;
    this.props.dispatch(commonFetch(ARTICLE_DETAIL,'GET',false,'/'+id))
      .then((json)=>{
        this.setState({
          releaseType:json.release,
          platformType:json.platform
        })
      })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.articleId!=this.props.articleId){
      this.props.dispatch(commonFetch(ARTICLE_DETAIL,'GET',false,'/'+nextProps.articleId))
        .then((json)=>{
          this.setState({
            releaseType:json.release,
            platformType:json.platform
          })
        })
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const form =  $('#put-article-form').get(0);
    const formData = new FormData(form);
    const { dispatch } = this.props;
    dispatch(commonFetch(ARTICLE_PUT, 'POST', formData))
      .then(code => {
        if (code === 0) {
          alert("修改成功");
          dispatch(hideModal());
          dispatch(commonFetch(ARTICLE_LIST))
        }
      });
  }

  render() {
    var items = this.props.items;
    var ArticleDetail = this.props.detail;

    return (
      <div className="modal-dialog">
        <div className="modal-content">
          <ModalHeader title="修改文章" />
          <div className="modal-body">
            <form　id="put-article-form"　method="post"　onSubmit={this.onSubmit}>
              <input hidden name="type_id" value={ArticleDetail.type_id}/>
              <input name="id" hidden value={ArticleDetail.id}/>
              <Input labelName="文章名称" name="title"  value={ArticleDetail.title}/>
              <Input labelName="封面" name="cover" value={ArticleDetail.cover}/>
              <Input labelName="原文地址" name="source" value={ArticleDetail.source}/>
              <Select
                labelName="发布"
                name="release"
                options={this.state.releaseTypes}
                value={this.state.releaseType}
                onChange={this.releaseTypeChange}
              />
              <Select
                labelName="平台"
                name="platform"
                options={this.state.platformTypes}
                value={this.state.platformType}
                onChange={this.platformTypeChange}
              />
              <Textarea name="content" value={ArticleDetail.content}/>

              <div className="form-group row">
                <div className="col-sm-offset-4 col-sm-8">
                  <button type="submit" className="btn btn-primary" >保存</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
ArticlePutModal.propTypes = {
  dispatch: PropTypes.func.isRequired
};
ArticlePutModal.defaultProps = {
  items: [],
  detail:{}
};
export default connect(state => {
  const { omg } = state;
  const  errorMsg = omg.errorMsg[ARTICLE_ADD] || '';
  const items  = omg[ARTICLE_TYPE_LIST] || [];
  const detail = omg[ARTICLE_DETAIL] || {};
  return {
    errorMsg,
    items,
    detail,
  };
})(ArticlePutModal);