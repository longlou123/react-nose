import React, {Component} from 'react'
import axios from 'axios';
import {post} from "./http.js"
//父组件---------------------------------------------主体框架
export default class INDEX extends Component {
  componentWillMount(){

  }
  constructor() {
    super(); //不加this会有问题
    this.state = {
      "titel":'全栈?是不可能的!',
      "data":[],
      "index":0,
      "test":"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1518516443&di=ac6f818f01472536f28118f977c5dae2&imgtype=jpg&er=1&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201608%2F16%2F20160816183822_hwBM2.jpeg"     
    }
    axios.get('http://10.51.39.123:3000').then((res)=>{
    //axios.get('http://192.168.1.103:3000').then((res)=>{
      console.log(res)
          var Arr = [];
          for(var i=0;i<res.data.length;i++){
            Arr.push(JSON.parse(res.data[i]))
          }
          this.setState(this.state.data = Arr)
          //console.log(this.state.data);
      }).catch((err)=>{
          console.log(err.status);
      })
  }
  onChildChanged(newState){
     this.setState({data: newState});
  }
  onChildChangedImg(newIndex){
      this.setState({index: newIndex});
  }
  render() {
    return (
    <div className="bigDiv"> 
        <p>{this.state.titel}</p>
        <List name={this.state.data} callbackParent={this.onChildChangedImg.bind(this)}/>
        <Img img={this.state.data.length != 0 ?this.state.data[this.state.index].imgUrl : this.state.test}/>
        <Input  callbackParent={this.onChildChanged.bind(this)}/>
    </div>
    )
  }
}
//按钮组件------------------------------------------(子组件)
class List extends React.Component {
  constructor() {
    super(); //不加this会有问题
    this.state = {
      "data1":[]
    }
  }
  render() {
    this.state.data1 = this.props.name
    var list = this.state.data1.map((item,index)=>{
      // return <li key={index} >{item.item+'-----'+index}</li>
      //return <li key={index} className="list_li"><button className="button" onClick={this.change.bind(index)}>{item.item}</button></li>
      return <li key={index} className="list_li" onClick={this.change.bind(this,index)}>{item.name}</li>
    });
    return (
      <div className="div_list">
          <ul className="list">{list}</ul>
      </div>
    )
  }
  change(newIndex){   
    //console.log(newIndex);
    this.props.callbackParent(newIndex);//调用父组件上的callbackParent执行相应程序，并传值
  }
}
//图片组件---------------------------------------------(子组件)
class Img extends React.Component { 
  constructor() {
    super(); //不加this会有问题
    this.state = {
      "data2":[]
    }
  }
  render() {     
    return (
       <img className="img" src={this.props.img} alt="图片" />
    )    
  }
}
//输入框组件---------------------------------------------(子组件)
class Input extends React.Component {
  constructor() {
    super(); //不加this会有问题
    this.state = {
      data3:[],
      files:[]
    }
  }
  //上传后请求新数据
  getdata(){
       axios.get('http://10.51.39.123:3000').then((res)=>{
          var Arr = [];
          for(var i=0;i<res.data.length;i++){
            Arr.push(JSON.parse(res.data[i]))
          }
          console.log(Arr);
          this.setState(this.state.data3 = Arr)
      }).catch((err)=>{
          console.log(err.status);
      })
  }
  //上传图片函数
  setimg(){
    var name = document.getElementById('name').value;
    var naimgUrl = document.getElementById('imgUrl').value;
    axios.post('http://10.51.39.123:3000/add/',{
    //axios.post('http://192.168.1.103:3000/add/',{
      "name": name,
      "imgUrl": naimgUrl
    }).then((res)=>{
          document.getElementById('name').value = '';
          document.getElementById('imgUrl').value = '';
          (async () => {
              await this.getdata();               
          })();
          //this.getdata()
          this.onTextChange()    
      }).catch((err)=>{
          console.log(err.status);
      })
  }
  //删除数据
  delete(){
      var name = document.getElementById('deleteName').value;
      axios.post('http://10.51.39.123:3000/delete/',{
      //axios.post('http://192.168.1.103:3000/add/',{
        "name": name,
      }).then((res)=>{
            document.getElementById('deleteName').value = '';
            (async () => {
                await this.getdata();               
            })();
            //this.getdata()
            this.onTextChange()    
        }).catch((err)=>{
            console.log(err.status);
        })
  }
  //向父组件刷新数据
  onTextChange() {
    var _this = this;
      setTimeout(function(){
        var newState = _this.state.data3;
        _this.setState({data: newState});
        // 这里要注意：setState 是一个异步方法，所以需要操作缓存的当前值
        _this.props.callbackParent(newState);//调用父组件上的callbackParent执行相应程序，并传值
      },1000)    
  }
  getImg(event){
      var _this = this;
      //var files = e.files;
      console.log(event);
      event.preventDefault()
      let target = event.target
      let files = target.files
      let count = this.state.multiple ? files.length : 1
      for (let i = 0; i < count; i++) {
          files[i].thumb = URL.createObjectURL(files[i])
      }
      // 转换为真正的数组
      files = Array.prototype.slice.call(files, 0)
      // 过滤非图片类型的文件
      files = files.filter(function (file) {
          return /image/i.test(file.type)
      })
      console.log(files);
      _this.setState({files: this.state.files.concat(files)})
    }
  Upload(){
      var _this = this;
      var pic = new FormData();
        for(let i=0; i<this.state.files.length; i++){
          pic.append('files', this.state.files[i])
        }
        console.log(pic);
        post('http://10.51.39.123:3000/Upload',pic).then(res => {
          if(res.errorCode !== 200){
            alert('图片上传失败！');
            return
          }
      })
  }
  render() {
    return (
       <div className="input" >
            <div>
              <span>名字:</span><input id="name" type="text" /><span>图片地址:</span><input id="imgUrl" type="text" />
              <button onClick={this.setimg.bind(this)}>确定添加/修改</button>             
            </div>
            <div>
              <span>请输入删除对象:</span><input id="deleteName" type="text" />
              <button onClick={this.delete.bind(this)}>确定删除</button>
            </div>
            <div>
              <span></span><input id="upload" type="file" accept="image/*" multiple={true} size={50}onChange={(e)=>this.getImg(e)}/>
              <button onClick={this.Upload.bind(this)}>确定上传</button>
            </div>
       </div>
    )
  }
}
