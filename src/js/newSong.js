{
    let view = {
      el: ".page>aside>.newSong",
      template: `
          新建歌曲
      `,
      render(data) {
        $(this.el).html(this.template);
      },
      active(){
        $(this.el).addClass('active')
    },
    removeActive(){
      $(this.el).removeClass('active')
  }
    };
    let model={}
    let control={
        init(view,model){
          this.view=view
          this.model=model
          this.view.render(this.model.data)
          this.bindEvents()
          window.eventHub.on('upload',(data)=>{
            this.view.active()
          })
          window.eventHub.on('listActive',(songId)=>{
            console.log(songId)
            this.view.removeActive()
          })
        },
        bindEvents(){
          $(this.view.el).on('click',()=>{
            this.view.active()
            window.eventHub.emit('newSong-active')
          })
        },

    }
    control.init(view,model)
  }
  