{
  let view = {
    el: ".page>main>.songMessage",
    template: `
            <form>
                <label>
                    歌名
                    <input name='songName' type="text" value='___songName___'>
                </label>
                <label>
                    歌手
                    <input name='singer' type="text" value='___singer___'>
                </label>
                <label>
                    链接
                    <input name='link' type="text" value='___link___'>
                </label>
                <input type="submit" value="提交">
            </form>
    `,
    render(data = {}) {
      let placeholder = ["songName", "singer", "link"];
      let html = this.template;
      placeholder.map(string => {
        html = html.replace(`___${string}___`, data[string] || "");
      });
      $(this.el).html(html);
      if (data.id) {
        $(this.el).prepend("<h1>歌曲信息</h1>");
      } else {
        $(this.el).prepend("<h1>创建歌曲</h1>");
      }
    }
  };
  let modle = {
    data: { songName: "", singer: "", link: "", id: "" },
    creatData(data) {
      var Song = AV.Object.extend("Song");
      var song = new Song();
      return song
        .save({
          songName: data.songName,
          singer: data.singer,
          link: data.link
        })
        .then(
          object => {
            let { id, attributes } = song;
            alert("成功存入");
            Object.assign(this.data, { id, ...attributes }); //更新data
          },
          error => {
            alert("失败......呜");
            console.log(error);
          }
        );
    },
    updata(data){
      var song = AV.Object.createWithoutData(
        "Song",
        this.data.id
      );
    
      song.set("songName", data.songName);
      song.set("singer", data.singer);
      song.set("link", data.link);
     return song.save();
    }
  };
  let control = {
    init(view, modle) {
      this.view = view;
      this.modle = modle;
      this.bindEvents();
      this.bindEventhub();
      this.view.render(this.modle.data);
    },
    save() {
      let data = {};
      let needs = ["songName", "singer", "link"];
      needs.map(string => {
        data[string] = $(this.view.el)
          .find(`[name=${string}]`)
          .val();
      });
      this.modle.creatData(data).then(() => {
        this.view.render({}); //更新数据后清空表单
        let string = JSON.stringify(this.modle.data);
        let object = JSON.parse(string); //深拷贝 后 传递 否则会影响
        window.eventHub.emit("creatSongMessage", object);
      });
    },
    updata() {
      let data = {};
      let needs = ["songName", "singer", "link"];
      needs.map(string => {
        data[string] = $(this.view.el)
          .find(`[name=${string}]`)
          .val();
      });
    this.modle.updata(data).then(()=>{
      alert('更新成功')
      Object.assign(this.modle.data,data)//更新 data 值
      window.eventHub.emit('updataSongMessage',JSON.parse(JSON.stringify(this.modle.data)))
    })

      /*this.view.render({}); //更新数据后清空表单
      let string = JSON.stringify(this.modle.data);
      let object = JSON.parse(string); //深拷贝 后 传递 否则会影响
      window.eventHub.emit('updataSongMessage', object);*/
      
    },
    bindEvents() {
      $(this.view.el).on("submit", "form", e => {
        e.preventDefault();
        if (this.modle.data.id) {
          this.updata()

          console.log("存在");
        } else {
          this.save();
          console.log("不存在");
        }
      });
    },
    bindEventhub() {
      window.eventHub.on("upload", data => {
        this.view.render(data);
      });
      window.eventHub.on("listActive", data => {
        //获取 歌单 被点击 歌曲的信息
        this.modle.data = data;
        this.view.render(data);
      });
      window.eventHub.on("newSong-active", data => {
        //
        this.modle.data = data;
        this.view.render(data);
      });
    }
  };
  control.init(view, modle);
}
