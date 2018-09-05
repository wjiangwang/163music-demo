{
  let view = {
    el: "#app",
    template: `

      `,
    rander(data) {
      $(this.el)
        .find(".background")
        .css({ "background-image": `url(${data.cover}) ` });
      $(this.el)
        .find(".song-img")
        .attr("src", data.cover);
      $(this.el)
        .find("audio")
        .attr("src", data.link);
    },
    play() {
      $(this.el)
        .find("audio")[0]
        .play();
        $(this.el).find('.disk').addClass('active')
        $(this.el).find('.playButton').hide()
        
    },
    pause() {
      $(this.el)
        .find("audio")[0]
        .pause();
        $(this.el).find('.disk').removeClass('active')
        $(this.el).find('.playButton').show()
    }
  };
  let model = {
    data: {
      song: {},
      status: false
    },
    getSong() {
      var query = new AV.Query("Song");
      return query.get(this.data.song.id).then(
        song => {
          Object.assign(this.data.song, song.attributes);
        },
        error => {
          // 异常处理
        }
      );
    }
  };
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.getId();
      this.model.getSong().then(() => {
        console.log(this.model.data)
        this.view.rander(this.model.data.song);
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
      this.model.data.song.id = id;
    },
    bindEvents() {
      $(this.view.el).on("click", ".diskWrap", () => {
        console.log(this.model.data)
        if (this.model.data.status===false) {
          this.view.play();
          this.model.data.status=true
        } else {
          this.view.pause();
          this.model.data.status=false
        }
      });
    }
  };
  controller.init(view, model);
}
