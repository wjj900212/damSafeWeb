<template>
  <div class="tinymce-box">
    <editor-te v-model="content" :init="init" :disabled="disabled" :key="randomKey"></editor-te>
  </div>
</template>

<script>
  // 引入tinymce编辑器
  import editorTe from '@tinymce/tinymce-vue'

  // 引入方式引入node_modules里的tinymce相关文件文件
  import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入则不显示编辑器
  import 'tinymce/themes/silver' // 编辑器主题，不引入则报错
  import 'tinymce/icons/default' // 引入编辑器图标icon，不引入则不显示对应图标

  // 引入编辑器插件
  import 'tinymce/plugins/advlist' // 高级列表 有序 / 无序列表
  import 'tinymce/plugins/anchor' // 锚点
  import 'tinymce/plugins/autolink' // 自动链接
  import 'tinymce/plugins/autoresize' // 编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
  import 'tinymce/plugins/autosave' // 自动存稿
  // import "tinymce/plugins/charmap"; //特殊字符
  // import "tinymce/plugins/code"; //编辑源码
  // import "tinymce/plugins/codesample"; //代码示例
  import 'tinymce/plugins/directionality' // 文字方向
  // import "tinymce/plugins/emoticons"; //表情
  // import "tinymce/plugins/fullpage"; //文档属性
  // import "tinymce/plugins/fullscreen"; //全屏
  import 'tinymce/plugins/help' // 帮助
  import 'tinymce/plugins/hr' // 水平分割线
  import 'tinymce/plugins/image' // 插入编辑图片
  import 'tinymce/plugins/importcss' // 引入css
  import 'tinymce/plugins/insertdatetime' // 插入日期时间
  import 'tinymce/plugins/link' // 超链接
  import 'tinymce/plugins/lists' // 列表插件
  import 'tinymce/plugins/media' // 插入编辑媒体
  // import "tinymce/plugins/nonbreaking"; //插入不间断空格
  import 'tinymce/plugins/pagebreak' // 插入分页符
  // import "tinymce/plugins/paste"; //粘贴插件
  import 'tinymce/plugins/preview' // 预览
  // import "tinymce/plugins/print"; //打印
  // import "tinymce/plugins/quickbars"; //快速工具栏
  // import "tinymce/plugins/save"; //保存
  import 'tinymce/plugins/searchreplace' // 查找替换
  // import 'tinymce/plugins/spellchecker'  //拼写检查，暂未加入汉化，不建议使用
  // import "tinymce/plugins/tabfocus"; //切入切出，按tab键切出编辑器，切入页面其他输入框中
  import 'tinymce/plugins/table' // 表格
  // import "tinymce/plugins/template"; //内容模板
  import 'tinymce/plugins/textcolor' // 文字颜色
  // import "tinymce/plugins/textpattern"; //快速排版
  // import "tinymce/plugins/toc"; //目录生成器
  // import "tinymce/plugins/visualblocks"; //显示元素范围
  import 'tinymce/plugins/visualchars' // 显示不可见字符
  import 'tinymce/plugins/wordcount' // 字数统计

  export default {
    name: 'tinymceEditor',
    components: {
      editorTe
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      putParams: {
        type: Object,
        default: function () {
          return {}
        }
      },
      delParams: {
        type: Object,
        default: function () {
          return {}
        }
      },
      putUrl: {
        type: String,
        default: ''
      },
      delUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      let _this = this
      return {
        randomKey: new Date().getTime(),
        init: {
          language_url: 'static/tinymce/zh_CN.js', // 引入语言包文件
          language: 'zh_CN', // 语言类型
          content_style: 'p {margin: 0px; border:0px ; padding: 0px;}', // 设置行间距
          mode: 'textareas',
          skin_url: 'static/tinymce/skins/ui/oxide', // 皮肤：浅色
          readonly: 1,
          // 避免图片地址和链接地址转换成相对路径
          relative_urls: false, 
          remove_script_host: false,
          convert_urls: false,
          // object_resizing:false, //禁止图片调整大小
          plugins: 'searchreplace image media table hr pagebreak anchor insertdatetime advlist lists wordcount autosave', // 插件配置
          // 工具栏1
          toolbar1: 'forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent lineheight',
          // // 工具栏2 去掉的 print 打印  formatpainter axupimgs 等等
          toolbar2: 'bullist numlist | blockquote subscript superscript | table image hr pagebreak insertdatetime | searchreplace | formatselect fontselect fontsizeselect',
          menubar: false, // 菜单栏配置,'file edit'，设为false则隐藏，不配置则默认显示全部菜单，也可自定义配置--查看 http://tinymce.ax-z.cn/configure/editor-appearance.php --搜索“自定义菜单”

          fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', // 字体大小
          font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC;苹果苹方=PingFang SC,Microsoft YaHei;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei;Arial=arial,helvetica;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
          height: 400, // 注：引入autoresize插件时，此属性失效
          min_height: 300,
          placeholder: '在这里输入文字',
          branding: false, // tiny技术支持信息是否显示
          resize: false, // 编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
          statusbar: false, // 最下方的元素路径和字数统计那一栏是否显示
          elementpath: false, // 元素路径是否显示
          automatic_uploads: true, //启用或者禁止上传由 data URL 或者 blob URls表示的图像。例如，将图像从桌面拖放到编辑器上之后，生成图像。
          toolbar_sticky: true,
          autosave_ask_before_unload: false, // 阻止有内容时浏览器阻塞行为, 默认 true  需引入插件autosave
          content_style: 'img {max-width:100%;}', // 直接自定义可编辑区域的css样式
          // content_css: '/tinycontent.css',  //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入

          // images_upload_url: '/demo/upimg.php',  //后端处理程序的url
          // images_upload_base_path: '/demo',  //相对基本路径--关于图片上传建议查看--http://tinymce.ax-z.cn/general/upload-images.php
          // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
          images_upload_handler: (blobInfo, success, failure) => {
            //   const img = "data:image/jpeg;base64," + blobInfo.base64();
            //   console.log(blobInfo, blobInfo.blob());
            let fd = new FormData()
            console.log(_this.putParams)
            if (JSON.stringify(_this.putParams) != "{}") {
              Object.keys(_this.putParams).forEach(v => {
                fd.append(v, _this.putParams[v])
              })
            }
            fd.append('file', blobInfo.blob())
            _this.$upload(_this.putUrl, fd).then((res) => {
              if (res.data.code !== 1) {
                failure('HTTP Error:' + res.data.msg)
                return
              }
              let rr = res.data.data
              success(rr)
            })
          },
          // file_picker_callback: function (callback, value, meta) {
          //   if (meta.filetype === "media") {
          //     // 模拟上传本地视频
          //     let input = document.createElement("input");
          //     input.setAttribute("type", "file");
          //     input.setAttribute("accept", ".mp4");
          //     input.onchange = function () {
          //       let file = this.files[0];
          //       // console.log(file);
          //       let fd = new FormData();
          //       fd.append("video", file);
          //       // _this.$upload("...", fd).then((res) => {
          //       //   let rr = res.data.data;
          //       //   callback(rr);
          //       // });
          //     };
          //     input.click();
          //   }
          // },
          setup: function (ed) {
            ed.on('KeyDown', function (e) {
              if ((e.keyCode == 8 || e.keyCode == 46) && ed.selection) { // delete& backspace keys
                var selectedNode = ed.selection.getEnd()
                // console.log(selectedNode, selectedNode.nodeName)
                if (selectedNode && selectedNode.nodeName == 'IMG') {
                  // console.log(selectedNode.src)
                  let ss = selectedNode.src
                  // ss.indexOf('isafety.zgcsafety.com.cn') != -1 && 
                  if (getUrlParam(ss, 'filename')) {
                    // 确认为上传的图片且存在名称
                    _this.delImg.push(getUrlParam(ss, 'filename'))
                  }
                }
              }
            })
          }
        },
        content: '',
        delImg: []
      }
    },
    created() {
      this.delImg = []
    },
    mounted() {
      tinymce.init({})
      this.randomKey = new Date().getTime()
    },
    methods: {
      delPic() {
        // console.log(this.delImg)
        let obj = {}
        if (JSON.stringify(this.delParams) != "{}") {
          Object.keys(this.delParams).forEach(k => {
            obj[k] = this.delParams[k]
          })
        }
        obj.arr = this.delImg.join(',')
        // console.log(obj)
        this.$postDate(this.delUrl, obj).then(res => {
          this.delImg = []
        })
      }
    },
    deactivated() {
      if (tinymce) {
        tinymce.destroy()
      }
    },
  }

  // 获取url中的参数
  function getUrlParam(url, name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') // 构造一个含有目标参数的正则表达式对象
    var r = url.substr(1).match(reg) // 匹配目标参数
    if (r != null) return decodeURIComponent(r[2])
    return null // 返回参数值
  }

</script>
<style scoped>
</style>
