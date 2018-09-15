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
                <label>
                封面
                <input name='cover' type="text" value='___cover___'>
                </label>
                <label class='lyric'>
                歌词
                <textarea rows="12" cols="50" name='lyric'>___lyric___</textarea>
                </label>
                <label class='section'>
                所属部分
                <label><input name="section" type="checkbox" value="lastMusic" />最新音乐 </label>
                <label><input name="section" type="checkbox" value="hotMusic" />最热音乐 </label>
                <label><input name="section" type="checkbox" value="playlist1" />歌单1 </label>
                <label><input name="section" type="checkbox" value="playlist2" />歌单2 </label>
                <label><input name="section" type="checkbox" value="playlist3" />歌单3 </label>
                <label><input name="section" type="checkbox" value="playlist4" />歌单4 </label>
                <label><input name="section" type="checkbox" value="playlist5" />歌单5 </label>
                <label><input name="section" type="checkbox" value="playlist6" />歌单6 </label>
                </label>
                <input type="submit" value="提交">
            </form>
    `,
    render(data = {
      tags: []
    }) {
      let placeholder = ["songName", "singer", "link", "cover", "lyric"];
      let html = this.template;
      placeholder.map(string => {
        html = html.replace(`___${string}___`, data[string] || "");
      });
      $(this.el).html(html);

      data.tags.map(string => {
        $(".section")
          .find("input:checkbox")
          .each(() => {
            $(this).prop("checked", false);
          });
        $(".section")
          .find(`input[type='checkbox'][value=${string}]`)
          .prop("checked", true);
      });

      if (data.id) {
        $(this.el).prepend("<h1>歌曲信息</h1>");
      } else {
        $(this.el).prepend("<h1>创建歌曲</h1>");
      }
    }
  };
  let modle = {
    data: {
      tags: [],
      songName: "",
      singer: "",
      link: "",
      cover: "",
      lyric: "",
      id: ""
    },
    creatData(data) {
      var Song = AV.Object.extend("Song");
      var song = new Song();
      song.set("tags", data.tags);
      song.set("songName", data.songName);
      song.set("singer", data.singer);
      song.set("link", data.link);
      song.set("cover", data.cover);
      song.set("lyric", data.lyric);
      return song.save().then(
        object => {
          let { id, attributes } = song;
          alert("成功存入");
          Object.assign(this.data, { id, ...attributes }); //更新data
        },
        error => {
          alert("失败......呜");
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
          console.log(error);
        }
      );
    },
    updata(data) {
      var song = AV.Object.createWithoutData("Song", this.data.id);
      song.set("tags", data.tags);
      song.set("songName", data.songName);
      song.set("singer", data.singer);
      song.set("link", data.link);
      song.set("cover", data.cover);
      song.set("lyric", data.lyric);
      return song.save();
    },
   /* remove(data){
      var todo = AV.Object.createWithoutData("Song", this.data.id);
      todo.destroy().then(function (success) {
        alert('删除成功')
        // 删除成功
      }, function (error) {
        alert('删除失败，请重试')
        // 删除失败
      });
    }*/
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
      let data = {
        tags: []
      };
      $(".section")
        .find("input:checkbox")
        .each(function() {
          //遍历所有复选框
          if ($(this).prop("checked") == true) {

            data.tags.push($(this).val());
           
          }
        });

      let needs = ["songName", "singer", "link", "cover", "lyric"];
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
      let data = {
        tags: []
      };
      $(".section")
        .find("input:checkbox")
        .each(function() {
          //遍历所有复选框
          if ($(this).prop("checked") == true) {

            data.tags.push($(this).val());
          }
        });
      let needs = ["songName", "singer", "link", "cover", "lyric"];
      needs.map(string => {
        data[string] = $(this.view.el)
          .find(`[name=${string}]`)
          .val();
      });
      this.modle.updata(data).then(() => {
        alert("更新成功");
        Object.assign(this.modle.data, data); //更新 data 值
        window.eventHub.emit(
          "updataSongMessage",
          JSON.parse(JSON.stringify(this.modle.data))
        );
      });

      /*this.view.render({}); //更新数据后清空表单
      let string = JSON.stringify(this.modle.data);
      let object = JSON.parse(string); //深拷贝 后 传递 否则会影响
      window.eventHub.emit('updataSongMessage', object);*/
    },
    remove(){
      let needs = ["songName", "singer", "link", "cover", "lyric"];
      needs.map(string => {
        data[string] = $(this.view.el)
          .find(`[name=${string}]`)
          .val();
      });
      this.modle.updata(data).then(() => {})
    },
    bindEvents() {
      $(this.view.el).on("submit", "form", e => {
        e.preventDefault();
        if (this.modle.data.id) {
          this.updata();

          console.log("存在");
        } else {
          this.save();
          console.log("不存在");
        }
      });

     /* $(this.view.el).on('click','.remove',()=>{
        this.remove()
      })*/
    },
    bindEventhub() {
      window.eventHub.on("upload", data => {
        this.view.render(data);
      });
      window.eventHub.on("listActive", data => {
        //获取 歌单 被点击 歌曲的信息
        console.log(data)
        this.modle.data = data;
        this.view.render(data);
      });
      window.eventHub.on("newSong-active", data => {
       console.log(data)
       data.tags.push('lastMusic')//默认 新建的音乐  放在 最新音乐
        this.modle.data = data;
        this.view.render(data);
      });
    }
  };
  control.init(view, modle);
}
