{
  let view = {
    el: ".last-music",
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
      let { songs } = data;
      songs.map(song => {
        let $a = $(
          this.template
            .replace("{{song.songName}}", song.songName)
            .replace("{{song.singer}}", song.singer)
            .replace('{{song.id}}',song.id)
        );
        $(this.el).append($a);
      });
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
  let controller = {
    init(view, model) {
      this.view = view;
      this.model = model;
      this.bindEvents();
      this.getAllSongs();
    },
    bindEvents() {},
    getAllSongs() {
      this.model.find().then(x => {
        $(this.view.el).find('.loading').hide()
        this.view.render(this.model.data);
      });
    }
  };

  controller.init(view, model);
}
