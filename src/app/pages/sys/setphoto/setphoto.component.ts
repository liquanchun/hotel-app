import { Component, ViewChild, OnInit, AfterViewInit,EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { DicService } from '../../sys/dic/dic.services';
import { GlobalState } from '../../../global.state';
import { SetPhotoService } from './setphoto.service';
import { FileUploader } from "ng2-file-upload";
import { Config } from '../../../providers/config';

@Component({
  selector: 'app-set-photo',
  templateUrl: './setphoto.component.html',
  styleUrls: ['./setphoto.component.scss'],
  providers: [SetPhotoService,DicService],
})
export class SetPhotoComponent implements OnInit, AfterViewInit {
  constructor(private _setPhotoService: SetPhotoService,
    private _dicService: DicService,
    private _config:Config,
    private _state: GlobalState) {
  }

  public uploader:FileUploader = new FileUploader({
    url: this._config.imageUrl,
    method: "POST",
    autoUpload:false,
    itemAlias: "uploadedfile"
  });

  message = new EventEmitter();

  private photoModel:any = {
    typeName:'',
    tags:'',
    fileName:''
  };
  private photoType:any = [];
  private isSaved:boolean=false;
  private photos:any = [];

  ngOnInit() {
      this.getDataList();
      this._dicService.getDicByName('图片类别', (data) => {
        this.photoType = data;
      });
  }

  getDataList(){
    this._setPhotoService.getSetPhoto().then((data) => {
      this.photos = data;
      _.each(this.photos,(d)=>{
          d['fileName'] = this._config.server +'/upload/' + d['fileName'];
      })
      console.log(this.photos);
    },
      (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      });
  }
  onSave(){
    console.log(this.photoModel);
    this._setPhotoService.create(this.photoModel).then((data) => {
      this._state.notifyDataChanged("showMessage.open", { message: '保存成功', type: "success", time: new Date().getTime() });
      this.photoModel.typeName='';
      this.photoModel.tags='';
      this.photoModel.fileName='';
      this.uploader.queue =[];
      this.getDataList();
    },
      (err) => {
        this._state.notifyDataChanged("showMessage.open", { message: err, type: "error", time: new Date().getTime() });
      }
    )
  }
  ngAfterViewInit() {

  }
  deleteImage(id){
    if(window.confirm('你确定要删除吗？')){
      this._setPhotoService.delete(id).then((data)=>{
          _.remove(this.photos,(p)=>{ return p['id'] == id; })
      })
    }
  }
  openImage(fileName:string){
    window.open(fileName);
  }
  // C: 定义事件，选择文件
  selectedFileOnChanged(event:any) {
    // 打印文件选择名称
    this.uploadFile();
    console.log(event.target.value);
  }

  // D: 定义事件，上传文件
  uploadFile() {
    const that = this;
    // 上传
    this.uploader.queue[0].onSuccess = function (response, status, headers) {
        // 上传文件成功
        if (status == 200) {
            // 上传文件后获取服务器返回的数据
            let data = JSON.parse(response);
            that.photoModel.fileName = data[0];
        } else {
            // 上传文件后获取服务器返回的数据错误
            alert("上传失败。");
        }
    };
    this.uploader.queue[0].upload(); // 开始上传
  }
}
