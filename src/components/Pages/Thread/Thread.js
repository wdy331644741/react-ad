import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAction } from '../../../actions/omg';
import { showModal, hideModal } from '../../../actions/modal';
import { BBS_THREAD_DELETE,BBS_THREAD_LIST,BBS_SECTION_LIST,BBS_THREAD_BATCH_REFUSE,BBS_THREAD_BATCH_PASS, BBS_COMMENT_ADD,BBS_THREAD_TOGGLE_STATUS,BBS_THREAD_DT_DEL,BBS_THREAD_UPDATE,BBS_THREAD_DT_UPDATE,BBS_USER_VEST_LIST,BBS_USER_ADMIN_LIST,BBS_THREAD_ADD } from '../../../constants';
import { Radio,Pagination } from '../../tools';
import ThreadAddModal from '../../modals/ThreadAddModal';
import ThreadMoveModal from '../../modals/ThreadMoveModal';
import ThreadReplyModal from '../../modals/ThreadReplyModal';
import { DatePicker,Select,Form,Input,Checkbox } from "antd";


class Thread extends Component {
    constructor(props) {
        super(props);
        this.checkArr = [];
        this.freshSectionList = this.freshSectionList.bind(this);
        this.list = this.list.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.changeLength = this.changeLength.bind(this);
        this.changePage = this.changePage.bind(this);
        this.changeSearch= this.changeSearch.bind(this);
        this.passThread = this.passThread.bind(this);
        this.holdThread = this.holdThread.bind(this);
        this.delThread = this.delThread.bind(this);
        this.updateThread = this.updateThread.bind(this);
        this.showUpdateModal = this.showUpdateModal.bind(this);
        this.showAddModal = this.showAddModal.bind(this);
        this.addThread = this.addThread.bind(this);
        this.getAdminList = this.getAdminList.bind(this);
        this.getVestList = this.getVestList.bind(this);
        this.showReplyModal = this.showReplyModal.bind(this);
        this.replyThread = this.replyThread.bind(this);
        this.showMoveModal = this.showMoveModal.bind(this);
        this.topThread = this.topThread.bind(this);
        this.superTopThread = this.superTopThread.bind(this);
        this.greatThread = this.greatThread.bind(this);
        this.hotThread = this.hotThread.bind(this);
        this.moveThread = this.moveThread.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
        this.govThread = this.govThread.bind(this);
        this.batchPass = this.batchPass.bind(this);
        this.batchRefuse = this.batchRefuse.bind(this);
        this.topScreen = this.topScreen.bind(this);
        this.greatScreen = this.greatScreen.bind(this);
        this.hotScreen = this.hotScreen.bind(this);
        this.state = {
            isVerify:0,
            order:{
                col:'id',
                val:'desc',
            },
            allChecked: false,
            gov:0,
            top:0,
            great:0,
            hot:0,
        }
    }

    componentDidMount() {
        this.freshSectionList();
        this.getAdminList();
        this.getVestList();
        this.list();

    }
    

    list(gov=false,top=false,great=false,hot=false){
        const queryObj = {};
        const page = this.state.page || 1;
        const isVerify = this.state.isVerify || 0;
        const pageNum = this.state.pageNum || 20;
        const order = this.state.order || {};
        const searchParams = this.state.formData || [];
        queryObj[`page`] = page;
        queryObj[`data[filter][isverify]`] = isVerify;
        if(pageNum !== 20){
            queryObj[`data[pagenum]`] = pageNum;
        }
        if(JSON.stringify(order) != '{}'){
            queryObj[`data[order][${order.col}]`] = order.val;
        }
        if(gov){
            let govVal = this.state.gov ? 0 :1
            queryObj[`data[filter][isofficial]`] = govVal;
            this.setState({
                gov:govVal,
            })
        }else if(top){
            let topVal = this.state.top ? 0 :1
            queryObj[`data[filter][istop]`] = topVal;
            this.setState({
                top:topVal,
            })
        }else if(great){
            let greatVal = this.state.great ? 0 :1
            queryObj[`data[filter][isgreat]`] = greatVal;
            this.setState({
                great:greatVal,
            })
        }else if(hot){
            let hotVal = this.state.hot ? 0 :1
            queryObj[`data[filter][ishot]`] = hotVal;
            this.setState({
                hot:hotVal,
            })
        }else{
            if(searchParams.type_id){
                queryObj[`data[filter][type_id]`] = searchParams.type_id;
            }
            if(searchParams.created_at){
                queryObj[`data[filter][created_at]`] = searchParams.created_at.format('YYYY-MM-DD');
                queryObj[`data[filter][created_at_pattern]`] = "min_equal_max";
            }
            if(searchParams.end_at){
                queryObj[`data[filter][end_at]`] = searchParams.end_at.format('YYYY-MM-DD');
            }
            if(searchParams.user_id){
                queryObj[`data[filter][user_id]`] = searchParams.user_id;
            }
        }
        
        const request = {
            type:BBS_THREAD_LIST,
            key:isVerify,
            queryObj
        }
        this.props.dispatch(fetchAction(request));
    }


    batchRefuse(e){
        const isAll = e.target.dataset.type;
        const tidArr = document.getElementsByName('all_tid');
        let tidStr = '';
        const formData = new FormData;
        for(var i=0;i<tidArr.length;i++){
                if(isAll == 'all'){
                    tidStr+= '-'+tidArr[i].value;
                } else {
                    if(tidArr[i].checked == true){
                        tidStr+= '-'+tidArr[i].value;
                    }
                }
               
        }
        formData.append('id',tidStr);
        this.props.dispatch(fetchAction({type:BBS_THREAD_BATCH_REFUSE, method:'POST',formData:formData}))
            .then(() => (this.list()));
        
    }

    batchPass(e){
        const isAll = e.target.dataset.type;
        const tidArr = document.getElementsByName('all_tid');
        let tidStr = '';
        const formData = new FormData;
        for(var i=0;i<tidArr.length;i++){
                if(isAll == 'all'){
                    tidStr+= '-'+tidArr[i].value;
                } else {
                    if(tidArr[i].checked == true){
                        tidStr+= '-'+tidArr[i].value;
                    }
                }
               
        }
        formData.append('id',tidStr);
        this.props.dispatch(fetchAction({type:BBS_THREAD_BATCH_PASS, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    govThread(){
        this.list(true);
    }

    topScreen(){
        this.list(false,true)
    }

    greatScreen(){
        this.list(false,false,true)
    }

    hotScreen(){
        this.list(false,false,false,true)
    }

    typeChange(e){
        const isVerify = e.target.value;
        this.setState({
            formData:{},
            isVerify:isVerify,
            page:1,
        },() => {this.list()});

    }

    changeOrder(e){
        const order = this.state.order;
        const col = e.target.dataset.value;
        if(order.col == col){
            order.val = order.val == 'desc' ? 'asc' : 'desc';
        }else{
            order.col = col;
            order.val = 'desc';
        }
        
        this.setState({
            order,
        }, () => {this.list()});
    }

    getVestList(){
        this.props.dispatch(fetchAction({
            type: BBS_USER_VEST_LIST,
        }));
    }

    getAdminList(){
        this.props.dispatch(fetchAction({
            type: BBS_USER_ADMIN_LIST,
        }));
    }

    changeLength(e){
        const length = e.target.value;
        this.setState({
            pageNum:length
        },()=>{this.list()});
    }

    changePage(page){
        this.setState({
            page:page
        },()=>{this.list()});

    }

    changeSearch(e){
        e.preventDefault();
        const  formData = this.props.form.getFieldsValue();
        this.setState({
            formData:formData,
        },()=>{this.list()});
    }

    freshSectionList() {
        this.props.dispatch(fetchAction({
            type: BBS_SECTION_LIST,
        }));
    }

    delThread(e){
        if (!confirm('确定删除吗?')) {
            return false;
        }
        const id = e.target.dataset.id;
        const formData = new FormData;
        formData.append('id', id);
        this.props.dispatch(fetchAction({type:BBS_THREAD_DELETE, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    passThread(e){
        const id = e.target.dataset.id;
        const formData = new FormData;
        formData.append('id', id);
        formData.append('isverify',1);
        this.props.dispatch(fetchAction({type:BBS_THREAD_DT_UPDATE, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    holdThread(e){
        const id = e.target.dataset.id;
        const formData = new FormData;
        formData.append('id', id);
        formData.append('isverify',2);
        this.props.dispatch(fetchAction({type:BBS_THREAD_DT_UPDATE, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    showUpdateModal(e){
        const index = e.target.dataset.index;
        this.props.dispatch(showModal(<ThreadAddModal submit={this.updateThread} item={this.items[index]} types={this.sections} admins={this.admins} vests={this.vests} update  />));
    }

    addThread(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        const { dispatch } = this.props;
        dispatch(fetchAction({type:BBS_THREAD_ADD,method:'POST',formData:formData}))
        .then(json=>{
            if(json.error_code === 0){
                dispatch(hideModal(true));
                this.list();
            }else{
                alert(json.error_msg);
            }
        })
    }

    updateThread(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        const { dispatch } = this.props;
        dispatch(fetchAction({type:BBS_THREAD_UPDATE,method:'POST',formData:formData}))
        .then(json =>{
            if (json.error_code === 0) {
                dispatch(hideModal(true));
                this.list();
            } else {
                alert(json.data.error_msg);
            }
        });
    }

    replyThread(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        this.props.dispatch(fetchAction({type:BBS_COMMENT_ADD,method:'POST',formData:formData}))
        .then(json =>{
            if (json.error_code === 0) {
                this.props.dispatch(hideModal(true));
                this.list();
            } else {
                alert(json.data.error_msg);
            }
        });
        
    }

    showReplyModal(e){
        const id = e.target.dataset.id;
        this.props.dispatch(showModal(<ThreadReplyModal vests={this.vests} id={id} submit={this.replyThread}/>));
    }

    moveThread(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        this.props.dispatch(fetchAction({type:BBS_THREAD_DT_UPDATE, method:'POST',formData:formData}))
            .then(json=>{
                if(json.error_code === 0){
                    this.props.dispatch(hideModal(true));
                    this.list();
                }else{
                    alert(json.error_msg);
                }
            });
    }

    topThread(e){
        const id = e.target.dataset.id;
        const formData = new FormData;
        formData.append('id', id);
        formData.append('istop',1);
        this.props.dispatch(fetchAction({type:BBS_THREAD_TOGGLE_STATUS, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    superTopThread(e){
        const id = e.target.dataset.id;
        const formData = new FormData;
        formData.append('id', id);
        formData.append('is_special',1);
        this.props.dispatch(fetchAction({type:BBS_THREAD_TOGGLE_STATUS, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    greatThread(e){
        const id = e.target.dataset.id;
        const formData = new FormData;
        formData.append('id', id);
        formData.append('isgreat',1);
        this.props.dispatch(fetchAction({type:BBS_THREAD_TOGGLE_STATUS, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    hotThread(e){
        const id = e.target.dataset.id;
        const formData = new FormData;
        formData.append('id', id);
        formData.append('ishot',1);
        this.props.dispatch(fetchAction({type:BBS_THREAD_TOGGLE_STATUS, method:'POST',formData:formData}))
            .then(() => (this.list()));
    }

    showMoveModal(e){
        const index = e.target.dataset.index;
        this.props.dispatch(showModal(<ThreadMoveModal types={this.sections} currentType={this.items[index].type_id} item={this.items[index]} submit={this.moveThread}/>));
    }

    showAddModal(e){
        this.props.dispatch(showModal(<ThreadAddModal admins={this.admins} vests={this.vests} types={this.sections} submit={this.addThread} /> ))
    }
   
    render() {
        const threadList = this.props.threadList[this.state.isVerify] || {};
        const sectionList = this.props.sectionList || [];
        const sections = sectionList || [];
        const items = threadList.data || [];
        const appUrl = threadList.app_url || '';
        this.items = items;
        for(var i=0; i<items.length;i++){
            this.checkArr[items[i].id] = false;
        }
        this.sections = sections;
        this.admins = this.props.adminList || [];
        this.vests = this.props.vestList || [];
        const Option = Select.Option;
        const { getFieldDecorator,getFieldsValue } = this.props.form;
       
        return (
            <div>
                <Radio
                    labelName="未审核"
                    name="userfilter"
                    checked={parseInt(this.state.isVerify) === 0 }
                    onChange={this.typeChange}
                    value={0}
                />
                <Radio
                    labelName="已审核"
                    name="userfilter"
                    checked={parseInt(this.state.isVerify) === 1}
                    onChange={this.typeChange}
                    value={1}
                />
                <Radio
                    labelName="已拒绝"
                    name="userfilter"
                    value={2}
                    checked={parseInt(this.state.isVerify) === 2}
                    onChange={this.typeChange}
                />
                <hr />
                <div>
                    <div className="card clearfix ">
                        <div className="clearfix m-t-1">
                            <h4 className="card-title">
                                <div className="pull-left m-l-1">
                                    帖子管理
                                    <span className="total">
                                    ({threadList.total}/{threadList.per_page})
                                </span>
                                </div>
                                <div className="pull-left m-l-1">
                                    <select className="custom-select" onChange={this.changeLength}>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="80">80</option>
                                    </select>
                                </div>
                                <div className="pull-left">
                                    <Pagination
                                        onClick={this.changePage}
                                        currentPage={threadList.current_page}
                                        lastPage={threadList.last_page}
                                        unurl
                                    />
                                </div>

                                <Form className="form-inline pull-right" onSubmit={this.changeSearch}>
                                    <div className="pull-left m-l-1 m-b-1">
                                        {getFieldDecorator('user_id', {
                                            rules: [],
                                        })(
                                            <Input style={{width:"100px"}} placeholder="userId" />
                                        )}
                                         &nbsp;
                                        {getFieldDecorator('type_id', {
                                            rules: [],
                                        })(
                                            <Select style={{ width: 120 }}>
                                                {sections.map((item,index) => (
                                                    <Option key={index} value={item.id}>{item.name}</Option>
                                                ))}
                                            </Select>
                                        )}
                                        &nbsp;
                                        {getFieldDecorator('created_at',
                                            {rules:[]},
                                        )(
                                            <DatePicker placeholder="START"/>
                                        )}


                                        {getFieldDecorator("end_at",
                                            {rules:[]},
                                        )(
                                            <DatePicker placeholder="END"/>
                                        )}
                                    </div>
                                    &nbsp;
                                    <button type="submit"
                                            className="btn btn-sm btn-info-outline pull-right"
                                    >
                                        <i className="fa fa-search">搜索</i>
                                    </button>
                                </Form>
                                { this.state.isVerify == 0 ?
                                <button onClick={this.batchPass} data-type="some" className="btn btn-sm btn-info pull-right">通过</button> : "" }

                                { this.state.isVerify == 1 ?
                                <button onClick={this.batchRefuse} data-type="some" className="btn btn-sm btn-info pull-right">拒绝</button>  : "" }
                                { this.state.isVerify == 1 ?
                                <button onClick={this.govThread} className="btn btn-sm btn-info pull-right">官方帖</button>   : "" }
                                { this.state.isVerify == 1 ?
                                <button onClick={this.showAddModal} className="btn btn-sm btn-info pull-right"><i className="fa fa-plus">添加</i></button>   : "" }
                                 
                                

                            </h4>
                        </div>
                        <table className="table table-bordered m-b-0 table-hover data-table">
                            <thead>
                            {
                                this.state.isVerify == 0 ? 
                                    <tr>
                                        <th><button onClick={this.batchPass} data-type="all"  className="btn btn-success-outline btn-sm">全部通过</button></th>
                                        <th>ID</th>
                                        <th>所属版块</th>
                                        <th>贴子标题</th>
                                        <th>贴子内容</th>
                                        <th>用户ID</th>
                                        <th>用户昵称</th>
                                        <th>发帖时间</th>
                                        <th>操作</th>
                                    </tr> :
                                this.state.isVerify == 1 ?
                                     <tr>
                                        <th><button onClick={this.batchRefuse} data-type="all" className="btn btn-sm btn-secondary-outline">全部拒绝</button></th>
                                        <th>ID</th>
                                        <th>所属版块</th>
                                        <th>贴子标题</th>
                                        <th>贴子内容</th>
                                        <th>用户ID</th>
                                        <th>用户昵称</th>
                                        <th onClick={this.changeOrder} data-value='views'>阅读量
                                        <span data-value='views'
                                        className="pull-right arrow"
                                            disabled={!(this.state.order.col === 'views' && this.state.order.val === 'asc')}
                                        >↑</span>
                                        <span data-value='views'
                                                disabled={!(this.state.order.col === 'views' && this.state.order.val === 'desc')}
                                            className="pull-right arrow"
                                        >↓</span>
                                        </th>
                                        <th onClick={this.changeOrder} data-value='comment_num'>评论数
                                        <span data-value='comment_num'
                                        className="pull-right arrow"
                                            disabled={!(this.state.order.col === 'comment_num' && this.state.order.val === 'asc')}
                                        >↑</span>
                                        <span data-value='comment_num'
                                                disabled={!(this.state.order.col === 'comment_num' && this.state.order.val === 'desc')}
                                            className="pull-right arrow"
                                        >↓</span>
                                        </th>
                                        <th onClick={this.changeOrder} data-value='zan_num'>点赞数
                                        <span data-value='zan_num'
                                        className="pull-right arrow"
                                            disabled={!(this.state.order.col === 'zan_num' && this.state.order.val === 'asc')}
                                        >↑</span>
                                        <span data-value='zan_num'
                                                disabled={!(this.state.order.col === 'zan_num' && this.state.order.val === 'desc')}
                                            className="pull-right arrow"
                                        >↓</span>
                                        </th>
                                        <th onClick={this.changeOrder} data-value='collection_num'>收藏数
                                        <span data-value='collection_num'
                                        className="pull-right arrow"
                                            disabled={!(this.state.order.col === 'collection_num' && this.state.order.val === 'asc')}
                                        >↑</span>
                                        <span data-value='collection_num'
                                                disabled={!(this.state.order.col === 'collection_num' && this.state.order.val === 'desc')}
                                            className="pull-right arrow"
                                        >↓</span>
                                        </th>
                                        <th>视频链接</th>
                                        <th>图片</th>
                                        <th onClick={this.topScreen}>是否置顶</th>
                                        <th onClick={this.greatScreen}>是否加精</th>
                                        <th onClick={this.hotScreen}>是否最热</th>
                                        <th>官方帖</th>
                                        <th>发帖时间</th>
                                        <th>操作</th>
                                    </tr> :
                                    <tr>
                                        <th>ID</th>
                                        <th>所属版块</th>
                                        <th>贴子标题</th>
                                        <th>贴子内容</th>
                                        <th>用户ID</th>
                                        <th>用户昵称</th>
                                        <th>发帖时间</th>
                                        <th>操作</th>
                                    </tr>
                            }
                            
                            </thead>
                            <tbody>
                            { items.map((item,index) => (
                                <tr key={`group-${index}`}>
                                    { this.state.isVerify == 1 || this.state.isVerify == 0 ?  
                                        <td><Checkbox value={item.id} name="all_tid" ></Checkbox></td>
                                    : "" }
                                    <td>{item.id}</td>
                                    <td>{item.section.name}</td>
                                    <td>{item.title}</td>
                                    <td>{item.content}</td>
                                    <td>{item.user_id}</td>
                                    <td>{item.user.nickname}</td>
                                    { this.state.isVerify == 1 ? <td>{item.views}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{item.comment_num}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{item.zan_num}</td> : ""}
                                    { this.state.isVerify == 1 ? <td>{item.collection_num}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{item.video_code ? item.video_code : "无"}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{ item.cover ? <a href={appUrl+"/thread/img/"+item.id} target="_blank">查看</a> : "—"}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{item.istop ? "是" : "否"}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{item.isgreat ? "是" : "否"}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{item.ishot ? "是" : "否"}</td> : "" }
                                    { this.state.isVerify == 1 ? <td>{item.isofficial ? "是" : "否"}</td> : "" }
                                    <td>{item.created_at}</td>
                                   
                                    { 
                                        this.state.isVerify == 0 ? 
                                            <td>
                                                <button data-id={item.id} onClick={this.passThread}
                                                        className="btn btn-success-outline btn-sm"
                                                >通过</button>
                                                <button data-id={item.id} onClick={this.holdThread}
                                                        className="btn btn-sm btn-warning-outline"
                                                >拒绝</button>
                                                <button data-index={index} data-id={item.id} onClick={this.showUpdateModal}
                                                        className="btn btn-info-outline btn-sm"
                                                >编辑</button>
                                                <button data-id={item.id} onClick={this.delThread}
                                                        className="btn btn-danger-outline btn-sm"
                                                >删除</button>
                                            </td> 
                                        : 
                                        this.state.isVerify == 1 ? 
                                            <td>
                                                <button data-id={item.id} onClick={this.showReplyModal}
                                                        className="btn btn-primary-outline btn-sm"
                                                >回复</button>
                                                <button data-index={index} data-id={item.id} onClick={this.showUpdateModal}
                                                        className="btn btn-warning-outline btn-sm"
                                                >编辑</button>
                                                <button data-id={item.id} data-index={index} onClick={this.showMoveModal}
                                                        className="btn btn-sm btn-info-outline"
                                                >移动</button>
                                                <button data-id={item.id} onClick={this.holdThread}
                                                        className="btn btn-sm btn-secondary-outline"
                                                >拒绝</button>
                                                <button data-id={item.id} onClick={this.greatThread}
                                                        className="btn btn-success-outline btn-sm"
                                                >{item.isgreat ? "取消" : "加精"}</button>
                                                <button data-id={item.id} onClick={this.hotThread}
                                                        className="btn btn-warning-outline btn-sm"
                                                >{item.ishot ? "取消" : "最热"}</button>
                                                <button data-id={item.id} data-number={item.istop} onClick={this.topThread}
                                                    className="btn btn-danger-outline btn-sm"
                                                >{item.istop ? "取消" : "置顶"}</button>
                                            </td> 
                                        : 
                                        this.state.isVerify == 2 ? 
                                             <td>
                                                <button data-id={item.id} onClick={this.passThread}
                                                        className="btn btn-success-outline btn-sm"
                                                >通过</button>
                                                <button data-index={index} data-id={item.id} onClick={this.showUpdateModal}
                                                        className="btn btn-info-outline btn-sm"
                                                >编辑</button>
                                                <button data-id={item.id} onClick={this.delThread}
                                                        className="btn btn-danger-outline btn-sm"
                                                >删除</button>
                                            </td>  
                                        : <td>——</td>
                                    }
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="card-block clearfix">
                            <h4 className="card-title">
                                <div className="pull-left">
                                    帖子管理
                                    <span className="total">
                                    ({threadList.total}/{threadList.per_page})
                                </span>
                                </div>
                                <div className="pull-left m-l-1">
                                    <select className="custom-select">
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="80">80</option>
                                    </select>
                                </div>
                                <div className="pull-left">
                                    <Pagination
                                        onClick={this.changePage}
                                        currentPage={threadList.current_page}
                                        lastPage={threadList.last_page}
                                        unurl
                                    />
                                </div>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Thread = Form.create()(Thread);
Thread.propTypes = {
    dispatch: PropTypes.func.isRequired,
    sectionList: PropTypes.array.isRequired,
};

Thread.defaultProps = {
}

export default connect(state => {
    const { omg } = state;
    const threadList = omg[BBS_THREAD_LIST] || {};
    const sectionList = omg[BBS_SECTION_LIST] || [];
    const adminList = omg[BBS_USER_ADMIN_LIST] || [];
    const vestList = omg[BBS_USER_VEST_LIST] || [];
    return {
        sectionList,
        threadList,
        adminList,
        vestList,
    };
})(Thread);