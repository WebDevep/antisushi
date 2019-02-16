$(document).ready(function(){
    var stop_modal = $.cookie("stop_modal");

    if(stop_modal != "Y" && MODAL_ON){
        setTimeout(function(){
            $('.modal-overlay').show();
            $('.modal-content').show('drop', {direction: "up"}, 400, function(){
                $.cookie("stop_modal", "Y");
            });

            $('.modal-content .modal-close, .modal-content .modal-content-button').on("click", function(){
                $('.modal-content').hide('drop', {direction: "up"}, 400, function(){
                    $('.modal-overlay').hide();
                });
            });
            $('.modal-overlay').on("click", function(e){
                e = e.originalEvent;
                if(!$(e.target).closest(".modal-content").length){
                    $('.modal-content').hide('drop', {direction: "up"}, 400, function(){
                        $('.modal-overlay').hide();
                    });
                }
            });
        }, 2000);
    }
});