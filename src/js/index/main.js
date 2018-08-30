{
  $(".navbar").on("click", "li", function(e) {//标贴切换
    $(e.currentTarget)
      .addClass("active")
      .siblings()
      .removeClass("active");
    let className = $(e.currentTarget)[0].id;
    $(".content").removeClass("active");
    $(`.${className}`).addClass("active");
  });
}
