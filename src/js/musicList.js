{
  let view = {
    el: ".page>.musicList",
    template: `
    <div class="newSong">
        新建歌曲
    </div>
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
    render(date) {
      $(this.el).html(this.template);
    }
  };
  let model={}
  let control={
      init(view,model){
        this.view=view
        this.model=model
        this.view.render(this.model.date)
      }
  }
  control.init(view,model)
}
