{
    let view = {
      el: "#app",
      template: `
  
        `,
      rander(data) {
        $(this.el)
          .find(".background")
          .css({ "background-image": `url(${data.img}) `});
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
        addsongs(){

        }
    };

    let model = {
      data: {
        sheet:{},
        songs: [],
      },
      getsheet() {
        let query = new AV.Query("PlayList");
        return query.get(this.data.sheet.id).then(
          sheet => {
              console.log(sheet)
            Object.assign(this.data.sheet, sheet.attributes);
          },
          error => {
            // 异常处理
          }
        );
      },
      getSongs(){
        var query = new AV.Query("Song");
        var filter = [ ];//条件查询
        query.containsAll('tags', filter);
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
        this.model.getSongs().then(x => {
          $(this.view.el).find('.loading').hide()
          this.view.addsongs(this.model.data);
        });
      },
      bindEvents() {

      }
    };
    controller.init(view, model);
  }
  