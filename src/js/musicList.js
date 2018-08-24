{
  let view = {
    el: ".page>aside>.musicList",
    template: `
    <ul>
        <li>歌曲1</li>
        <li>歌曲2</li>
        <li class="active">歌曲3</li>
        <li>歌曲4</li>
        <li>歌曲5</li>
        <li>歌曲6</li>
        <li>歌曲7</li>
    </ul>
    `,
    render(data) {
      let {songs}=data
      let list=[]
      $(this.el).find('ul').empty()
      songs.map((songs)=>{
        list.push(songs.songName)
      })
      list.map((songName)=>{
        $(this.el).find('ul').append(`<li>${songName}</li>`)
      })
      
      //$(this.el).html(this.template);
    }
  };
  let model={
    data:{
      songs:[]
    }
  }
  let control={
      init(view,model){
        this.view=view
        this.model=model
        this.view.render(this.model.data)
        window.eventHub.on('upload',()=>{
          this.removeActive()
        })
        window.eventHub.on('creatSongMessage',(data)=>{
          console.log(JSON.stringify(this.model.data.songs) )
          this.model.data.songs.push(data)
          console.log(JSON.stringify(this.model.data.songs) )
          this.view.render(this.model.data)
        })
      },
      removeActive(){
        $(this.view.el).find('.active').removeClass('active')
      }
  }
  control.init(view,model)
}
