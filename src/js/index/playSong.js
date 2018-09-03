{
  let view = {
    el: "#app",
    template: `
      <audio src="{{link}}"></audio>
      <button class='play'>播放</button>
      <button class='pause'>暂停</button>
      `,
    rander(data) {
        console.log(data)
      $(this.el).html($(this.template.replace('{{link}}',data.link)));
    },
    play(){
        $(this.el).find('audio')[0].play()
    },
    pause(){
        $(this.el).find('audio')[0].pause()
    },
  };
  let model = {
    data: {},
    getSong() {
      var query = new AV.Query("Song");
      return query.get(this.data.id).then(
        song => {
          Object.assign(this.data, song.attributes);
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
      this.bindEvents()
      this.model.getSong().then(()=>{this.view.rander(this.model.data)});
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
      this.model.data.id = id;
    },
    bindEvents(){
        $(this.view.el).on('click','.play',()=>{
            this.view.play()
        })
        $(this.view.el).on('click','.pause',()=>{
            this.view.pause()
        })
    }
  };
  controller.init(view, model);
}
