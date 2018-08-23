{
  let view = {
    el: ".page>main>.songMessage",
    template: `
            <form>
                <label>
                    歌名
                    <input type="text">
                </label>
                <label>
                    歌手
                    <input type="text">
                </label>
                <label>
                    链接
                    <input type="text">
                </label>
                <input type="button" value="提交">
            </form>
    `,
    render(date) {
      $(this.el).html(this.template);
    }
  };
  let modle = {};
  let control = {
    init(view, modle) {
      this.view = view;
      this.modle = modle;
      this.view.render(this.modle.date);
    }
  };
  control.init(view, modle);
}
