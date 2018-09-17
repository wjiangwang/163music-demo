{
  let view = {
    el: "#app",
    template: `
      <a href="./playSong.html?id={{song.id}}">
      <div class='song'>
          <p class='song-name'>{{song.songName}}</p>
          <p class="song-message">{{song.singer}}</p>
      </div>
      <div class='icon'><svg id="icon-play-circled" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M512 42.666667C252.8 42.666667 42.666667 252.8 42.666667 512s210.133333 469.333333 469.333333 469.333333 469.333333-210.133333 469.333333-469.333333S771.2 42.666667 512 42.666667zM512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512 85.333333 276.352 276.352 85.333333 512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667C938.666667 747.648 747.648 938.666667 512 938.666667z"></path>
              <path
                  d="M384 725.333333 747.776 512 384 298.666667Z"></path></svg></div>
      </a>
        `,
    rander(data) {
      $(this.el)
        .find(".background")
        .css({ "background-image": `url(${data.img}) ` });
      $(this.el)
        .find(".cover")
        .attr("src", data.img);
      $(this.el)
        .find(".text")
        .text(data.title);
      $(this.el)
        .find(".profile>span")
        .text(data.profile);
    },
    addsongs(songs) {
      songs.map(song => {
        let $a = $(
          this.template
            .replace("{{song.songName}}", song.songName)
            .replace("{{song.singer}}", song.singer)
            .replace("{{song.id}}", song.id)
        );
        $(this.el)
          .find(".list")
          .append($a);
      });
    }
  };

  let model = {
    data: {
      sheet: {},
      songs: []
    },
    getsheet() {
      let query = new AV.Query("PlayList");
      return query.get(this.data.sheet.id).then(
        sheet => {
          console.log(sheet);
          Object.assign(this.data.sheet, sheet.attributes);
        },
        error => {
          // 异常处理
        }
      );
    },
    getSongs() {
      var query = new AV.Query("Song");
      var filter = [this.data.sheet.playList]; //条件查询
      query.containsAll("tags", filter);
      return query.find().then(songs => {
        songs.map(song => {
          this.data.songs.push({ id: song.id, ...song.attributes });
        });
        return songs;
      });
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.getId();
      this.model.getsheet().then(() => {
        this.view.rander(this.model.data.sheet);
        this.addAllSongs();
      });
      this.bindEvents();
    },
    getId() {
      let search = window.location.search;
      if (search.indexOf("?") === 0) {
        search = search.slice(1);
      }
      let array = search.split("&").filter(x => {
        return x; //过滤掉 空值
      });
      let id = "";
      for (let i = 0; i < array.length; i++) {
        let kv = array[i].split("="); // 分割 多个查询参数
        let key = kv[0];
        let value = kv[1];
        if (key === "id") {
          id = value;
          break;
        }
      }
      this.model.data.sheet.id = id;
    },
    addAllSongs() {
      this.model.getSongs().then(songs => {
        console.log(this.model.data.songs);
        this.view.addsongs(this.model.data.songs);
        $(this.view.el)
          .find(".loading")
          .hide();
      });
    },
    bindEvents() {}
  };
  controller.init(view, model);
}
