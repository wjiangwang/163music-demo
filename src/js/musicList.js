{
  let view = {
    el: ".page>aside>.musicList",
    template: `
    <ul>
        <li>歌曲1</li>
        <li>歌曲2</li>
        <li>歌曲3</li>
        <li>歌曲4</li>
        <li>歌曲5</li>
        <li>歌曲6</li>
        <li>歌曲7</li>
    </ul>
    `,
    render(data) {
      let { songs } = data;
      $(this.el)
        .find("ul")
        .empty();

      let liList = songs.map(songs => {
        return $("<li></li>")
          .html(songs.songName)
          .attr("song-id", songs.id);//添加歌曲 id 属性
      });
      liList.map(domLi => {
        $(this.el)
          .find("ul")
          .append(domLi);
      });

      //$(this.el).html(this.template);
    },
    removeActive() {//去除所有 active(高亮) 
      $(this.el)
        .find(".active")
        .removeClass("active");
    },
    addActive(item) {
      $(item).addClass("active");
    }
  };
  let model = {
    data: {
      songs: []
    },
    find() {
      var query = new AV.Query("Song");
      return query.find().then(songs => {
        songs.map(song => {
          this.data.songs.push({ id: song.id, ...song.attributes });
        });
        return songs;
      });
    }
  };
  let control = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.view.render(this.model.data);
      this.getAllSongs();
      this.bindEventHub();
      this.bindEvents();
    },
    bindEvents() {
      $(this.view.el).on("click", "li", e => {
        this.view.removeActive();//去除所有 active(高亮)   
        this.view.addActive(e.currentTarget);
        let songId=e.currentTarget.getAttribute('song-id')
        let data
        let songs=this.model.data.songs
        for(let i=0;i<songs.length;i++){
          if(songs[i].id===songId){
            data=songs[i]
            break
          }
        }
        let copyData=JSON.parse(JSON.stringify(data))
        window.eventHub.emit('listActive',copyData)
      });
    },
    bindEventHub() {
      window.eventHub.on("upload", () => {
        this.view.removeActive();
      });
      window.eventHub.on("creatSongMessage", data => {
        this.model.data.songs.push(data);
        this.view.render(this.model.data);
      });
      window.eventHub.on('updataSongMessage',data=>{
        for(let i=0;i<this.model.data.songs.length;i++){
          console.log(i)
          if(this.model.data.songs[i].id===data.id){
            this.model.data.songs[i]=data
            this.view.render(this.model.data);
            break
          }
          
        }
      })
      window.eventHub.on('newSong-active',()=>{
        this.view.removeActive()
      })
    },
    getAllSongs() {
      this.model.find().then(x => {
        this.view.render(this.model.data);
      });
    }
  };
  control.init(view, model);
}
