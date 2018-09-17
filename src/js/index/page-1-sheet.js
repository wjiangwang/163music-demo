{
  let view = {
    el: "#page1>.sheet",
    template: `
    <li>
        <a href="./sheet.html?id={{sheet.id}}">
            <img src="{{sheet.img}}">
            <p>{{sheet.title}}</p>
        </a>
    </li>
    `,
    render(data) {
        let { sheets } = data;
        sheets.map(sheet=> {
          let $li= $(
            this.template
              .replace("{{sheet.img}", sheet.img)
              .replace("{{sheet.title}}", sheet.title)
              .replace('{{sheet.id}}',sheet.id)
          );
          $(this.el).find('ol').append($li);
        });
      }
  };

  let model={
      data:{sheets:[]},
      find() {
        var query = new AV.Query("PlayList");
        return query.find().then(sheets => {
            
          sheets.map(sheet => {
            this.data.sheets.push({ id: sheet.id, ...sheet.attributes });
          });
  
          return sheets;
        });
      }
  }
  let controller={
    init(view, model) {
        this.view = view;
        this.model = model;
        this.bindEvents();
        this.getAllsheets();
      },
      bindEvents() {},
      getAllsheets() {
        this.model.find().then(x => {
          $(this.view.el).find('.loading').hide()
          this.view.render(this.model.data);
        });
      }
  }
  controller.init(view, model);
}
