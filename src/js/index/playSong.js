{
  let view = {
    el: "#app",
    template: `

      `,
    rander(data) {
      //这里的 data 是 song
      $(this.el)
        .find(".background")
        .css({ "background-image": `url(${data.cover}) `,'opacity': 1});
      $(this.el)
        .find(".song-img")
        .attr("src", data.cover);
      $(this.el)
        .find("audio")
        .attr("src", data.link);
      $(this.el)
        .find(".songName")
        .text(data.songName);
      $(this.el)
        .find(".singer")
        .text(data.singer);
      //歌词
      let { lyric } = data;
      let array = lyric.split("\n");
      array.map(string => {
        let regex = /\[([\d:.]+)\](.+)/; //正则区分开 时间 和 歌词
        let match = string.match(regex);
        let $p;
        if (match) {
          $p = $(`<p>${match[2]}</p>`);
          let times = match[1].split(":");
          time = parseFloat(times[0], 10) * 60 + parseFloat(times[1], 10); //时间转化为 按秒计时
          $p.attr("time-line", time); //添加时间线在属性
        } else {
          $p = $(`<p>${string}</p>`);
        }
        $(this.el)
          .find(".lyric>.lines")
          .append($p);
      });
      
      let audio = $(this.el).find("audio")[0];
      audio.ontimeupdate = () => {
        //歌曲时间变化
        this.showLyric(audio.currentTime);
      };
      audio.onended = () => {
        //监听歌曲播放结束后
        this.pause();
      };
    },
    pause() {
      $(this.el)
        .find("audio")[0]
        .pause();
      $(this.el)
        .find(".playButton")
        .show();
      let dTransform = getComputedStyle($(".disk")[0]).transform;
      let cTransform = getComputedStyle($(".container")[0]).transform;
      $(".container")[0].style.transform =
        cTransform === "none" ? dTransform : dTransform.concat(" ", cTransform);
      $(".disk").removeClass("active");
    },
    play() {
      $(this.el)
        .find("audio")[0]
        .play();
      $(this.el)
        .find(".playButton")
        .hide();
      $(".disk").addClass("active");
    },
    showLyric(time) {
      let allLyric = $(this.el).find(".lyric>.lines>p");

      for (let i = 0; i < allLyric.length; i++) {
        let currentTime = allLyric.eq([i]).attr("time-line");
        let nextTime = allLyric.eq([i + 1]).attr("time-line");
        if (i > allLyric.length - 2) {
          // 最后一句歌词

          if (time >= currentTime) {
            allLyric
              .eq([i])
              .addClass("active")
              .siblings()
              .removeClass("active");
          }
        } else {
          if (time >= currentTime && time < nextTime) {
            allLyric
              .eq([i])
              .addClass("active")
              .siblings()
              .removeClass("active");
            $(this.el)
              .find(".lyric>.lines")
              .css({ transform: `translateY(-${(i - 1) * 7.4879}vw)` }); //每次上移动1/3 (实际设备预览发现需要 +1px)的区域高度
          }
        }
      }
    }
  };
  let model = {
    data: {
      song: {},
      status: false
    },
    getSong() {
      let query = new AV.Query("Song");
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
      $(this.view.el)
        .find(".diskWrap")
        .on("click", () => {
          let isPlaying = this.model.data.status;
          if (isPlaying) {
            this.view.pause();
            this.model.data.status = false;
          } else {
            this.view.play();
            this.model.data.status = true;
          }
        });
    }
  };
  controller.init(view, model);
}
