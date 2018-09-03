{
    let view={
        el:'#navbar'
    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on("click", "li", function(e) {
                $(e.currentTarget)
                  .addClass("active")//点击时的红色底边
                  .siblings()
                  .removeClass("active");
                  
                let className = $(e.currentTarget)[0].id;//标贴切换
                $(".content").removeClass("active");
                $(`.${className}`).addClass("active");
              });
        }

        
    }
    controller.init(view,model)
}