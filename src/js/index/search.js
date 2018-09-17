{
  let view = {
    el: "#search",
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
    render(data) {
      $(".s3 ")
        .find(".hotsearch")
        .hide();
      $(".s3")
        .find(".search-result>.list")
        .html("");
      if (data.length !== 0) {
        data.map(song => {
          let $a = $(
            this.template
              .replace("{{song.songName}}", song.songName)
              .replace("{{song.singer}}", song.singer)
              .replace("{{song.id}}", song.id)
          );
          $(".s3 ")
            .find(".search-result h3")
            .text("最佳匹配");

          $(".s3")
            .find(".search-result>.list")
            .append($a);
        });
      } else {
        $(".s3 ")
          .find(".search-result h3")
          .text("没有结果");
      }
      $(".s3")
        .find(".search-result>.list>a")
        .on("click", () => {
          $("#search input").val("");
        });
    }
  };

  let modle = {
    data: {
      songs: []
    },
    search(keyword) {
      var songNameQuery = new AV.Query("Song");
      songNameQuery.contains("songName", keyword);
      var singerQuery = new AV.Query("Song");
      singerQuery.contains("singer", keyword);
      var query = AV.Query.or(songNameQuery, singerQuery);

      return query.find().then(songs => {
        this.data.songs = []; //数组里的对象如何更新？？？ 先用笨方法替代
        songs.map(song => {
          this.data.songs.push({ id: song.id, ...song.attributes });
        });
        return this.data.songs;
      });
    }
  };
  let controller = {
    init(view, modle) {
      this.view = view;
      this.modle = modle;
      this.monitoring();
      this.bindEvents();
    },
    monitoring() {
      $(".search>.close").on("click", () => {
        //关闭图标 被点击时 清空搜索框
        $("#search input").val("");
        $(".s3")
          .find(".search-result")
          .hide();
        $(".s3 ")
          .find(".hotsearch")
          .show();
        $("#search .holder").show();
        $(".search>.close").hide();
        return;
      });
      let timer = undefined;

      let keyword;
      $(".hotsearch").on("click", "li", x => {
        $("#search .holder").hide();
        $(".search>.close").show();
        keyword = x.currentTarget.innerText;
        $(this.view.el)
          .find("input")
          .val(x.currentTarget.innerText);
        this.modle.search(keyword).then(result => {
          $(".s3")
            .find(".search-result")
            .show();
          this.view.render(result);
        });
      });
      $("#search input").on("input", e => {
        $("#search .holder").hide();
        $(".search>.close").show();
        keyword = $(e.currentTarget)
          .val()
          .trim(); //去掉空格
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {
          if (keyword === "") {
            //无输入时 展示原始界面
            $(".s3")
              .find(".search-result")
              .hide();
            $(".s3 ")
              .find(".hotsearch")
              .show();
            $("#search .holder").show();
            $(".search>.close").hide();
            return;
          }
          this.modle.search(keyword).then(result => {
            $(".s3")
              .find(".search-result")
              .show();
            timer = undefined;
            console.log(keyword);
            this.view.render(result);
          });
        }, 300);
      });
    },
    bindEvents() {},
    bindEventHub() {}
  };
  controller.init(view, modle);
}
