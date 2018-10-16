require(["jquery", "han", "bet"], function($, han, bet) {
    new bet("main");
    $.ajax({
        url: "/api/add",
        dataType: "json",
        success: function(res) {
            if (res.code == "0") {
                var data = res.data;
                render(data);
            }
        }
    })


    function render(data) {
        var hp = $("#hp").html();
        var template = han.compile(hp);
        var html = template(data);
        $(".top").html(html);
    }

    // 点击编辑
    $("#btn").on("click", function() {
        location.href = "./pages/list.html";
    })
})