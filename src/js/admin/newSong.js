{
  let view = {
    el: ".page>aside>.newSong",
    template: `
          新建歌曲
      `,
    render(data) {
      $(this.el).html(this.template);
      
    },
    active() {
      $(this.el).addClass("active");
    },
    removeActive() {
      $(this.el).removeClass("active");
    }
    
  };
  let model = {
    data:{
      tags:[]
    }
  };
  let control = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
      this.bindEvents();
      this.bindEventHub();
    },
    bindEvents() {
      $(this.view.el).on("click", () => {
        this.view.active();
        let copyData=JSON.parse(JSON.stringify(this.model.data))
        window.eventHub.emit("newSong-active",copyData);
      });
    },
    bindEventHub() {
      window.eventHub.on("upload", data => {
        this.model.data=data
        this.view.active();
      });
      window.eventHub.on("listActive", data => {
        this.view.removeActive();
        
      });
      window.eventHub.on("creatSongMessage", data => {
          this.model.data={}
      });
    }
  };
  control.init(view, model);
}
