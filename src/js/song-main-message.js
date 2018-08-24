{
  let view = {
    el: ".page>main>.songMessage",
    template: `
            <form>
                <label>
                    歌名
                    <input name='songName' type="text" value='___songName___'>
                </label>
                <label>
                    歌手
                    <input name='singer' type="text" value='___singer___'>
                </label>
                <label>
                    链接
                    <input name='link' type="text" value='___link___'>
                </label>
                <input type="submit" value="提交">
            </form>
    `,
    render(data = {}) {
      let placeholder = ["songName", "singer", "link"];
      let html = this.template;
      placeholder.map(string => {
        html = html.replace(`___${string}___`, data[string] || "");
      });
      $(this.el).html(html);
    }
  };
  let modle = {
    data: { songName: "", singer: "", link: "", id: "" },
    creatData(data) {
      var Song = AV.Object.extend("Song");
      var song = new Song();
      return song
        .save({
          songName: data.songName,
          singer: data.singer,
          link: data.link
        })
        .then(
          object => {
            let { id, attributes } = song;
            alert("成功存入");
            Object.assign(this.data, { id, ...attributes }); //更新data
          },
          error => {
            alert("失败......呜");
            console.log(error);
          }
        );
    }
  };
  let control = {
    init(view, modle) {
      this.view = view;
      this.modle = modle;
      this.bindEvents();
      this.view.render(this.modle.data);
      window.eventHub.on("upload", (data) => {
        this.view.render(data);
      });
    },
    bindEvents() {
      $(this.view.el).on("submit", "form", e => {
        e.preventDefault();
        let data = {};
        let needs = ["songName", "singer", "link"];
        needs.map(string => {
          data[string] = $(this.view.el)
            .find(`[name=${string}]`)
            .val();
        });
        this.modle.creatData(data).then(() => {
          this.view.render({}); //更新数据后清空表单
          let string=JSON.stringify(this.modle.data)
          let object =JSON.parse(string)//深拷贝 后 传递 否则会影响
          window.eventHub.emit('creatSongMessage',object)
        });
      });
    }
  };
  control.init(view, modle);
}
