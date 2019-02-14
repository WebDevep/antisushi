
function animateNumbers(elem,new_val){
	$({val_i: parseInt($(elem).text().split(' ').join(''))}).animate({val_i: parseInt(new_val)}, {
		duration: 500,
		easing: 'swing',
		step: function () {
			$(elem).text(number_format(this.val_i, 0, '.', ' '));
		},
		complete: function () {
			$(elem).text(number_format(new_val, 0, '.', ' '));
		}
	})
}

function number_format( number, decimals, dec_point, thousands_sep ) {

	var i, j, kw, kd, km;
	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

	kw = i.split( /(?=(?:\d{3})+$)/ ).join( thousands_sep );
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


	return kw + kd;
}

var currentUrl='', showedProducts= 0;

$(window).on('load',function() {
	getcheckoutbasket();
	setTimeout(function() { 
		$('#preloader').hide();
	}, 300);
	renderBasket();
	// $('.basket-btn').click()
	// $('body').removeClass('hidden')
})

$(window).scroll(function() {
	/* Страница - каталог */
	if (currentUrl.indexOf('/catalog/') > -1) {	
		productsCount= $('.product-list .product-ajax-cont').length
		if (showedProducts < productsCount) {
			if (($(window).scrollTop()+$(window).height()-100) > $('#btn-show-more').offset().top) {
				productsCount= 0;
				$('#preloader').show();
				$('.product-list .product-ajax-cont').each(function() {
					if (productsCount >= showedProducts+8)
						$(this).addClass('hidden')
					else 
						$(this).removeClass('hidden');
					productsCount++
				});
				showedProducts+= 8;
				$('#preloader').hide();
			}
			console.clear()
			if ( (productsCount < 8) || (showedProducts >= productsCount) ) $('#btn-show-more').hide();
			console.log('showedProducts '+showedProducts)
			console.log('productsCount '+productsCount)
		}
	}
});

$(document).ready(function () {
	currentUrl= window.location.href.split('?')[0].toLowerCase().replace('#','').replace('//','/').replace(' ','');

	/* Страница - каталог */
	if (currentUrl.indexOf('/catalog/') > -1) {
		productsCount=0;
		$('.product-list .product-ajax-cont').each(function() {
			if (productsCount >= 8) $(this).addClass('hidden'); else	$(this).removeClass('hidden');
			productsCount++
		})
		if (productsCount < 8) $('#btn-show-more').hide();
		showedProducts= 8;
	}

	jQuery(function($){
		$(document).mouseup(function (e){
			var gifts = $(".gift-sticky .expanded-gift.open");
			if (!gifts.is(e.target) && gifts.has(e.target).length === 0) {
				$('.gift-sticky .gift-toggle').click();
			}
			var giftsPopup = $("#gift-modal");
			if (!giftsPopup.is(e.target) && giftsPopup.has(e.target).length === 0) {
				$('#gift-modal').removeClass('show');
				$('.modal-backdrop').removeClass('show');
				$('.modal-backdrop').remove();
			}
			var filter = $("#ingridients-filter"), filterA=$('.products-sub-menu .filter-link-wrapper');
			if ( (!filter.is(e.target) && filter.has(e.target).length === 0) &&
			(!filterA.is(e.target)) ) {
				$('#popover-ingridients-filter').hide();
			}
		});
	});

	$('#callback-form input[name="agreement"]').wrap('<span class="modern-checkbox"></span>');
	$('#callback-form .modern-checkbox').append('<span class="checkbox"></span>');

	$('body').on('click','#callback-form .modern-checkbox .checkbox',function(e) {
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).parent().find('input[type="checkbox"]').prop('checked',true);
		} else {
			$(this).parent().find('input[type="checkbox"]').prop('checked',false);
		}
	});

	$('label[for="agreement"]').on('click',function(e) {
		e.preventDefault();
		$(this).find('.checkbox').click()
	})
	$('body').on('click','#callback-form label[for="agreement"] .modern-checkbox .checkbox',function(e) {
		if (($('#callback-form input[name="name"]').val().length > 1) && ($('#callback-form input[name="phone"]').val().length > 16) && ($('#callback-form [name="agreement"]').is(':checked')))
			$('#callback-form [type="submit"]').prop('disabled', false);
		else
			$('#callback-form [type="submit"]').prop('disabled', true);		
	});

	if ($('.not-empty-basket .basket-sum > span').length > 0)
		if ($('.not-empty-basket .basket-sum > span').html() != '') {
			$('.not-empty-basket').css('display','block');
		}

	$('[data-toggle="popover"]').popover();
	$('.popover-dismiss').popover({
	  trigger: 'focus'
	})  
	$('input[name="phone"]').mask("+7(999) 999-99-99");
	if($('body').hasClass('fixed-header')){
		$(window).on('scroll',function(){
		   if($(this).scrollTop() > 75){
			   $('.product-categories-container').addClass('fixed');
			   $('.top-line').css('margin-bottom','60px');
			   $('#popover-basket').css('top','47px');
		   }else{
			   $('.product-categories-container').removeClass('fixed');
			   $('.top-line').css('margin-bottom','0');
			   $('#popover-basket').css('top','123px');
		   }
		});
	};

/* MODIFICATIONS BY AROBOT START */
	
	function addFilter (title,id) {
		filter='\
			<div class="col-xs-6 param-item">\
				<a href="#" class="icon-param remove-param selected">\
					<svg viewBox="0 0 489.307 489.307">\
						<g>\
							<polygon points="489.307,56.466 432.839,0 244.654,188.187 56.468,0 0,56.466 188.186,244.654 0,432.839 56.469,489.307 244.654,301.121 432.839,489.307 489.306,432.839 301.121,244.654"></polygon>\
						</g>\
					</svg>\
				</a>\
				<a href="#" class="icon-param add_param">\
					<svg viewBox="0 0 51.997 51.997">\
						<path d="M51.911,16.242C51.152,7.888,45.239,1.827,37.839,1.827c-4.93,0-9.444,2.653-11.984,6.905 c-2.517-4.307-6.846-6.906-11.697-6.906c-7.399,0-13.313,6.061-14.071,14.415c-0.06,0.369-0.306,2.311,0.442,5.478 c1.078,4.568,3.568,8.723,7.199,12.013l18.115,16.439l18.426-16.438c3.631-3.291,6.121-7.445,7.199-12.014 C52.216,18.553,51.97,16.611,51.911,16.242z M15.999,9.904c-4.411,0-8,3.589-8,8c0,0.553-0.447,1-1,1s-1-0.447-1-1 c0-5.514,4.486-10,10-10c0.553,0,1,0.447,1,1S16.551,9.904,15.999,9.904z"></path>\
					</svg>\
					<span class="">'+title+'</span>\
				</a>\
				<input type="hidden" value="N" name="'+id+'" id="'+id+'">\
			</div>\
		';
		$('#ingridients-filter .smartfilter > div > div.filter-params').append(filter);
	}
	function clearFilters() { $('#ingridients-filter .smartfilter > div > div.filter-params > div.param-item').each(function() { $(this).remove(); }); }
	function hideFilters() { $('.ingridients-filter-btn').hide(); }
	function showFilters() { $('.ingridients-filter-btn').show(); }
	
	// $(function () { $('[data-toggle="popover"]').popover(); })
	// $('.popover-dismiss').popover({
	//  trigger: 'focus'
	// })

	clearFilters();
	switch (window.location.pathname.replace('#','')) {
		case '/catalog/sets/':
			addFilter('Грибы Шиитаки','arrFilter_13_3824524633');
			addFilter('Икра летучей рыбы','arrFilter_13_3098688021');
			addFilter('Креветка','arrFilter_13_671950724');
			addFilter('Курица','arrFilter_13_177617004');
			addFilter('Лосось','arrFilter_13_565930927');
			addFilter('Снежный краб','arrFilter_13_350276916');
		break;
		case '/catalog/pitstsa/':   
			addFilter('Бекон','arrFilter_13_3835189568');
			addFilter('Кальмар','arrFilter_13_1594496786');
			addFilter('Креветка','arrFilter_13_671950724');
			addFilter('Мидии','arrFilter_13_328010029');
		case '/catalog/special-offers/':
			addFilter('Креветка','arrFilter_13_671950724');
			addFilter('Курица','arrFilter_13_177617004');
			addFilter('Лосось','arrFilter_13_565930927');
			addFilter('Мидии','arrFilter_13_328010029');
			addFilter('Морской окунь','arrFilter_13_1147090787');
			addFilter('Огурец','arrFilter_13_2380897422');
			addFilter('Сливочный сыр','arrFilter_13_3369651866');
			addFilter('Снежный краб','arrFilter_13_350276916');
			addFilter('Угорь','arrFilter_13_1676148130');
		break;
		case '/catalog/rolls/':
			addFilter('Авокадо','arrFilter_13_234617973');
			addFilter('Бекон','arrFilter_13_3835189568');
			addFilter('Грибы Шиитаки','arrFilter_13_3824524633');
			addFilter('Зеленый лук','arrFilter_13_2106657018');
			addFilter('Икра летучей рыбы','arrFilter_13_3098688021');
			addFilter('Кальмар','arrFilter_13_1594496786');
			addFilter('Креветка','arrFilter_13_671950724');
			addFilter('Кунжут','arrFilter_13_2063387875');
			addFilter('Курица','arrFilter_13_177617004');
			addFilter('Лосось','arrFilter_13_565930927');
			addFilter('Лосось копченый','arrFilter_13_1455184697');
			addFilter('Масляная рыба','arrFilter_13_3484748419');
			addFilter('Мидии','arrFilter_13_328010029');
			addFilter('Морской окунь','arrFilter_13_1147090787');
			addFilter('Огурец','arrFilter_13_2380897422');
			addFilter('Омлет','arrFilter_13_1686780347');
			addFilter('Сливочный сыр','arrFilter_13_3369651866');
			addFilter('Снежный краб','arrFilter_13_350276916');
			addFilter('Тунец','arrFilter_13_52458567');
			addFilter('Угорь','arrFilter_13_1676148130');
		break;
		default:
			hideFilters();
		break;
	}

	$('body').on('click',function() {  })
	$(document).keyup(function(e) {
		if (e.keyCode == 27) { 
			$('.md-modal').each(function() { $(this).removeClass('md-show')});
			$('#global-overlay').removeClass('md-show');
			$('.modal').each(function() { $(this).removeClass('show')});
			$('.modal-backdrop').removeClass('show');
			$('.modal-backdrop').remove();
			// $('.modal-backdrop').css('display','none');
			$('#popover-ingridients-filter').css('opacity',0);
		}
	});
	$('.gift-item .get-gift').on('click',function(e) {
		e.preventDefault();
		getGift();
		$('#gift-modal').css('display','block');
		$('body').append('<div class="modal-backdrop fade show" style="display: block;"></div>');
	});
	$('.modal-backdrop').on('click',function(e) {
		console.log();
		$('.modal').each(function() { $(this).removeClass('show')});
	})
	$('.btn-get-gift').on('click',function(e) {
		e.preventDefault();
		getGift();
		$('#gift-modal').css('display','block');
		$('body').append('<div class="modal-backdrop fade show" style="display: block;"></div>');
	})
	$('.product.gift .get-gift-btn').on('click',function(e) {
		// $('#popover-basket .webui-popover-content #basket .information-col .progress-container .progress-bar-content').css('display','none');
		$('.basket-gift-container .progress-get-another').css('display','block');
	})
	$('a[data-id="ingridients-filter"]').on('click',function(e) {
		// e.preventDefault();
	})
	$('a.open-callback').on('click',function(e) {
		e.preventDefault();
		$('#global-overlay').addClass('md-show');
		$('#callback-modal').addClass('md-show');
	});
	$('.md-modal .modal-btn-close').on('click',function() {
		$(this).parent().removeClass('md-show');
		$('#global-overlay').removeClass('md-show');
	})
	$('#global-overlay, .modal-big-btn-close').on('click',function() {
		$('#global-overlay').removeClass('md-show');
		$('.md-modal').each(function() { $(this).removeClass('md-show')});
	});
	$('#callback-form input').on('keyup',function(e) {
		if ( ($('#callback-form input[name="name"]').val().length > 1) && ($('#callback-form input[name="phone"]').val().length > 16) && ($('#callback-form [name="agreement"]').is(':checked')) )
				$('#callback-form [type="submit"]').prop('disabled',false);
			else
				$('#callback-form [type="submit"]').prop('disabled',true);
	})
	$('#callback-form [name="agreement"]').on('change',function(e) {
		if ( ($('#callback-form input[name="name"]').val().length > 1) && ($('#callback-form input[name="phone"]').val().length > 16) && ($('#callback-form [name="agreement"]').is(':checked')) )
				$('#callback-form [type="submit"]').prop('disabled',false);
			else
				$('#callback-form [type="submit"]').prop('disabled',true);
	})
	$('#callback-form').on('submit',function(e) {
		e.preventDefault();
		json_data= {"name":$('#callback-form [name="name"]').val(),"phone":$('#callback-form [name="phone"]').val(),"session":Session};
		console.log(json_data);

		$.ajax({
				url: '/?callback_req',
				type: 'post',
				dataType : "json",
				cache: false,
				data: json_data,
				success: function (data) { 
					$('#callback-form input').each(function() { $(this.val('')); });
					$('#callback-form [name="agreement"]').prop('checked',false);
					$('#callback-form').removeClass('md-show');
					$('#thanks-form .md-content-message').html(data);
					$('#thanks-form').addClass('md-show');
				}
		});
		$('#callback-form input:not([type="hidden"])').each(function() { $(this).val(''); });
		$('#callback-form [type="submit"]').prop('disabled',true);
		$('.md-modal').each(function() { $(this).removeClass('md-show')});
		$('#thanks-modal .md-content-message').html('Сообщение успешно отправлено');
		$('#thanks-modal').addClass('md-show');     
	})
	$('.ingridients-filter-btn').on('click',function() {
		// if ($('#popover-ingridients-filter').css('display').toLowerCase().trim() == 'none')
			$('#popover-ingridients-filter').css('display', 'block');
		// else
			$('#popover-ingridients-filter').css('display', 'none');

		if ($('#popover-ingridients-filter').css('visibility') != 'visible')
			$('#popover-ingridients-filter').css('visibility', 'visible');
		else
			$('#popover-ingridients-filter').css('visibility', 'none');

		if ($('#popover-ingridients-filter').css('display') == 'none')
			$('#popover-ingridients-filter').css('display', 'block');
		else
			$('#popover-ingridients-filter').css('display', 'none');

		if ($('#popover-ingridients-filter').css('opacity')< 1)
			$('#popover-ingridients-filter').css('opacity', '1');

	});

/* MODIFICATIONS BY AROBOT END */

});

// likes

function registerLikes( jQuery ){
	if($('.likes').length){
		$('.likes').on('click',function(e){
			if(CustomerID>0){
			e.preventDefault();
			var $cont = $(this).closest('.preview');
			if($cont.length == 0){
				$cont = $(this);
			}
				if($(this).hasClass('liked')){
					$(this).removeClass('liked');
				}else{
					$(this).addClass('liked');
				}
			var isliked = false;
			if($(this).hasClass('liked')) {
				isliked = true;
			}
			var product_id = $(this).closest('.product').attr('data-id');
			if(product_id == undefined){
				product_id = $(this).attr('data-id');
			}
			var url = window.location.href;
			$.ajax({
				type: 'post',
				data: {'PRODUCT_ID': product_id, 'IsLiked': isliked, url: url, 'Session':Session},
				dataType: "json",
				url: 'bd/?likeItem',
				success: function(data){
					$cont.find('.like-content span').text(data);
				}
			});
			}
			return false;
		});
	}
};
$(document).ready(registerLikes);

// slider

$(function() {
 if($('.carousel').length){
		var $carousel = $('.carousel').flickity({
			cellAlign: 'center',
			contain: true,
			autoPlay: 3000,
			percentPosition: false,
			imagesLoaded: true,
		});
		$('.bd-slider').css('opacity','1');
		$('.slider-container .spinner').hide();
		var flkty = $carousel.data('flickity');
		$($('.flickity-page-dots .dot')[flkty.selectedIndex]).addClass('completed');

		$carousel.on('select.flickity', function() {
			$('.flickity-page-dots .dot').removeClass('completed');

			$($('.flickity-page-dots .dot')[flkty.selectedIndex]).addClass('completed');
		});
	}
}); 

// data-section

$(function() {
	$('.products-sub-menu-main a').on('click',function(e){
		e.preventDefault();
		$('.product-list').hide();
		$('.product-list[data-section="'+$(this).attr('data-section')+'"]').show();
		//window.location.hash = '#section-'+$(this).attr('data-section');
		$(this).closest('ul').find('li').removeClass('active');
		$(this).parent().addClass('active');

		return false;
	});
});

// footer-tabs

(function($) {
$(function() {
  $('ul.ftabs_caption').on('click', 'li:not(.active)', function() {
	$(this)
	  .addClass('active').siblings().removeClass('active')
	  .closest('div.tabs').find('div.ftabs_content').removeClass('active').eq($(this).index()).addClass('active');
  });

});
})(jQuery);

// gift

$(function() {
	if($('.gift-sticky').length){
		$(window).on('scroll',function(e){
			var window_top = $(window).scrollTop();
			if (window_top > 0) {
				$('.gift-sticky').addClass('sticky');
			} else {
				$('.gift-sticky').removeClass('sticky');
			}
		});
		$('.collapsed-gift').on('click',function(e){
			e.preventDefault();
			$('.expanded-gift').show().addClass('open');
			$('.collapsed-gift').hide();
			return false;
		})
		$('.expanded-gift .gift-toggle').on('click',function(e){
			e.preventDefault();
			$('.expanded-gift').removeClass('open').hide();
			$('.collapsed-gift').show();
			return false;
		})
	}
}); 


// test   

function test1() {
	console.log("it`s alive!");
};



//  auth


$(document).ready(function () {
	$('.auth-btn').on('click', function(e){
		e.preventDefault();
		var $id = $(this).data('id');
		var $target = '#'+$id;
		var onS = function(e){
			if($('#auth').hasClass('is_auth')){
				$('#popover-auth').addClass('is_auth');
			}
			if ($('#auth').hasClass('bonuses-disabled')) {
				$('#popover-auth').addClass('bonuses-disabled');
			}
			var $id_ = $(e).attr('id').replace('popover-','');
			$('[data-id="'+$id_+'"]').addClass('pop-active');
		};
		var onH = function(){$('.auth-btn').removeClass('pop-active');};
		var plac = 'bottom-left'
			if($('#auth').hasClass('is_auth')){
				var plac ='bottom';
			}else{
				var plac ='bottom-left';
			};
		$(this).webuiPopover({url:$target,id_:$id,animation: 'fade',onShow: onS,onHide: onH, cache: true, placement: 'bottom'});
	});
});

$(document).ready(function () {
	$('.auth-btn').click();
	
	if ($('#auth').hasClass('is_auth')){
		$('.auth-btn span').first().text(User.EMail);
		$('.bonuses .value span').first().text(User.Bonuses);
	}else{
		$('.auth-btn span').first().text('Войти');
	};
	$('.user-info-element.bonuses.value span').first().text(User.Bonuses);
	$('.progress-stat .orders-totals').text(User.OrdersSum);
	$('.progress-stat .orders-totals-need').text('');
});

$(document).ready(function () {
 
	$('.auth-tabs a').on('click' ,function(e){
		e.preventDefault();
		$('.auth-state').hide();
		$('.auth-state.'+$(this).data('target')).show();
		$('.auth-tabs li').removeClass('active');
		$(this).parent().addClass('active');
		return false;
	});
	$('.forgot').on('click',function(e){
		e.preventDefault();
		$('.auth-state').hide();
		$('.auth-state.forgot-password-state').show();

		return false;
	});
	$('#inp_agree').on('change',function(){
		var $form = $(this).closest('form');
		if($(this).is(':checked')){
			$form.find('button').removeAttr('disabled');
		}else{
			$form.find('button').attr('disabled','disabled');
		}
	});
	
	$('.auth-state form').on('submit',function(e){
		e.preventDefault();
		var $form = $(this);
		if($('[name="PHONE"]').length>1 && $(this).find('[name="ACTION"]').val()!='RESET_PASSWORD'){
			$('[name="PHONE"]').val($form.find('[name="PHONE"]').val()).closest('.bd-input').addClass('filled');
		}
		if($('[name="EMAIL"]').length>1 && $(this).find('[name="ACTION"]').val()!='RESET_PASSWORD'){
			$('[name="EMAIL"]').val($form.find('[name="EMAIL"]').val()).closest('.bd-input').addClass('filled');
		}
		$('[name="PASSWORD"]').val($form.find('[name="PASSWORD"]').val()).closest('.bd-input').addClass('filled');

		if($(this).find('[name="ACTION"]').val()=='RESET_PASSWORD'){
			$('.phone-confirm-password-state').find('[name="PHONE"]').val($(this).find('[name="PHONE"]').val()).closest('.bd-input').addClass('filled');
			$('.set-new-password-state').find('[name="PHONE"]').val($(this).find('[name="PHONE"]').val()).closest('.bd-input').addClass('filled');

			$('.phone-confirm-password-state').find('[name="EMAIL"]').val($(this).find('[name="EMAIL"]').val()).closest('.bd-input').addClass('filled');
			$('.set-new-password-state').find('[name="EMAIL"]').val($(this).find('[name="EMAIL"]').val()).closest('.bd-input').addClass('filled');
		}
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/?auth',
			success: function(data){
				$form.find('.bd-error').html('');
				//console.log(data.ERRMSG);
				if(data.SUXESS == false){
					//$('.auth-state').hide();
					//$('.auth-state.'+data.next+'-state').show();
					//$form.find('.bd-error').html('').hide();
					//if ($('.confirm-email__message').length > 0) {
					//  $('.confirm-email__message').css('display', 'block');
					//}
					//$('.auth-btn span').text(User.Email);
//                  window.location.reload();
					console.log(data.ERRMSG);
					$form.find('.bd-error').html(data.ERRMSG).show();
				}else{
					$form.find('.bd-error').html(data.ERRMSG).hide();
					window.location.reload();
				}
			}
//          success: function(response) {
//                console.log(response)
//            } 
//            success: function(data){
//                $form.find('.bd-error').html('');
//                if(data.ERRORS!=undefined){
//                    $.each(data.ERRORS,function(i,item){
//                        $form.find('input[name="'+item.FIELD+'"]').closest('.bd-input').addClass('error');
//                        $form.find('.bd-error').append('<div>'+item.MESSAGE+'</div>');
//                    });   
//                    var cont_ = '#sms_reg';
//                    if($('#sms_reg').length == 0){
//                        cont_ = '#sign-up-email-form';
//                    }
//                    if(
//                        $(cont_+' .input-row-first .bd-input').hasClass('error') &&
//                        $(cont_+' .input-row .bd-input').hasClass('error') &&
//                        !$(cont_+' .input-row-last .bd-input').hasClass('error')
//                    ){
//                        $(cont_+' .input-row-last').css('margin-top',0);
//                    }else{
//                        $(cont_+' .input-row-last').css('margin-top','-1px');
//                        $(cont_+' .input-row').css('margin-top','-1px');
//                    }
//                    if(
//                        $(cont_+' .input-row-first .bd-input').hasClass('error') &&
//                        !$(cont_+' .input-row .bd-input').hasClass('error') &&
//                        $(cont_+' .input-row-last .bd-input').hasClass('error')
//                    ){
//                        $(cont_+' .input-row').css('margin-top',0);
//                    }
//                }else{
//                    if(data.TYPE=='ERROR'){
//                        $form.find('.bd-error').html(data.MESSAGE).show();
//                    }else{
//                        if(data.next!=='auth-success'){
//                            $('.auth-state').hide();
//                            $('.auth-state.'+data.next+'-state').show();
//                            $form.find('.bd-error').html('').hide();
//                            if ($('.confirm-email__message').length > 0) {
//                                $('.confirm-email__message').css('display', 'block');
//                            }
//                        }else{
//                            window.location.reload();
//                        }
//                    }
//                }
//            }
		})
		return false;
	})
}); 

// cabinet

$(document).ready(function(){
	$(document).on('change',function(){
		if($('.address-list').lenght > 0){
			$('.add-address').prop('disabled', true);
			$('.add-address').addClass('disabled');
			console.log('11');
		}else{
			$('.add-address').prop('disabled', false);
			$('.add-address').removeClass('disabled');
		};
	});
	
	$(document).on('click','.add-address',function(e){
		e.preventDefault();
		if($('.address-list').lenght > 0){
			$('.add-address').prop('disabled', true);
			$('.add-address').addClass('disabled');
			console.log('11');
		}else{
			if ($('.address-template_').find('.sod_select').length > 0) {
			$('.address-template_').find('.sod_select').parent().html('<div class="label">' + $('.address-template_').find('.bd-select').find('.label').text() + '</div>' + $('.address-template_ select')[0].outerHTML);
		}
		var ran_ = new Date().getTime();
		var $new_address = $('.address-template_').html().replace('id="PRIVATE_"', 'id="PRIVATE_' + ran_ + '"').replace('data-target="PRIVATE_"', 'data-target="PRIVATE_' + ran_ + '"').replace('for="PRIVATE_"', 'for="PRIVATE_' + ran_ + '"');

		$('.address-list').append($new_address);

		registerRemoveAddressHandlers();
		registerAddressListeners();
		return false;           
		}
	});
		
		
	$('.edit-address').on('click', function (e) {
		e.preventDefault();
		$(this).closest('.address-item').addClass('opened');
		$(this).closest('.address-item').find('input').removeAttr('readonly')
		return false;
	});

	
	$('.save-profile').on('click', function(e){
			 e = e.originalEvent;
			$("#phone").unmask();
			var $form = $('#cabinetform');
			$.ajax({
				type: 'post',
				data: $form.serialize(),
				dataType: "json",
				url: '/bd/checkout/?cabinetchange',
				success: function (data) {
					console.log('success');
				}
			});
			e.preventDefault();
			return false;
			
	}); 
	
});

$(window).on('hashchange',function(){
	hashlink();
});

$(document).ready(function(){
	hashlink();
});

function hashlink(){
	var h = location.hash;
	console.log(h); 
	if(h == "#orders") {
		$('#profile').hide();
		$('#bonusprogram').hide();
		$('#orderhistory').show();
	}
	if(h == "#bonuses") {
		$('#profile').hide();
		$('#bonusprogram').show();
		$('#orderhistory').hide();
	}
	if(h == "#profile") {
		$('#profile').show();
		$('#bonusprogram').hide();
		$('#orderhistory').hide();
	}
	if(h == "#like"){
		$('.products-sub-menu-main a.likelink').click();
	}
}

function likelink(){
	$('.products-sub-menu-main a.likelink').click();
}

function registerRemoveAddressHandlers(){
	$('.remove-address').off().on('click',function(e){
		e.preventDefault();
		var $addr_cont = $(this).closest('.address-item');
		$addr_cont.find('.to_delete').val(1);
		$addr_cont.hide();
		return false;
	})
}

function registerAddressListeners() {
	$('.address_private input[type="checkbox"]').off().on('change', function (e) {
		if ($(this).is(':checked')) {
			$(this).closest('.address-item').find('.not_private_house_fields').hide();
		} else {
			$(this).closest('.address-item').find('.not_private_house_fields').show();
		}
	})
}

$(document).ready(function(){
	if (window.location.pathname == '/my/'){ 
	$.ajax({
		type: 'post',
		data: {'Session':Session},
		dataType: "json",
		url: '/bd/?get_sales_history',
		success: function(data){
			console.log(data);
			$.each(data, function(i, item) {
				var n = 0;
				$.each(item.Details, function(j, detail) {
					n = n+1                 
				});
				$('#orderstable').append(
					`<tr class="complete">
							<td>${item.OrderNo}</td>
							<td class="order-date">${item.OrderDate}</td>
							<td><a href="#" data-handler="popover" data-id="history-pop${item.OrderNo}" class="order-detail-btn">${n} позиций</a>
								<div class="webui-popover-content" id="history-pop${item.OrderNo}">
									<div class="bd-scrollbar scrollbar-macosx history_content_popover">
										<table class="product-list${i}">
											</table>
											</div>
											</div>
							</td>
							<td>${Math.floor(item.OrderTotalPrice)}<span class="currency font-fix">R</span></td>
							<td>${item.OrderState}</td>                         
						</tr>`
				);
//                  $.each(item.Details, function(i, detail) {
//                      console.log(detail);
//              $('.product-list').closest().append(
//                                          `<tr>
//                                          <td class="prod-image"><img src="${item.NomenclaturePicUri}"></td>
//                                          <td class="name">
//                                          <div>${item.NomenclatureName}</div>
//                                          <div class="section">-секция-</div>
//                                          </td>
//                                          <td class="amount">${item.Count} шт</td>
//                                          <td class="local_sum">${item.Price}<span class="currency font-fix">R</span></td>
//                                          </tr>`
//              );
//              });
			});
		}
	});
	
	$(document).on('click','.order-detail-btn',function(e){
		e.preventDefault();
		var $id = $(this).data('id');
		var $target = '#'+$id;
		var onS = function(e){
			var $id_ = $(e).attr('id').replace('popover-','');
			$('[data-id="'+$id_+'"]').addClass('pop-active');
		};
		var onH = function(){$('.auth-btn').removeClass('pop-active');};
		var plac = 'bottom-left'
		$(this).webuiPopover({url:$target,id_:$id,animation: 'fade',onShow: onS,onHide: onH, cache: true, placement: 'bottom'});
	});
	
	
	}
});

// product-detail


var CurentProductPreview = null;
function startProductSlider(id){
	if(!$(".product[data-id='"+id+"']").length) return false;
	CurentProductPreview = $(".product[data-id='"+id+"']");
	if($('#product-detail button.previous').length == 0 && $('#product-detail button.next').length == 0){
		var Buttons = $("<button class='flickity-prev-next-button previous'><svg viewBox='0 0 100 100'><path d='M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z' class='arrow'></path></svg></button>" +
					  "<button class='flickity-prev-next-button next'><svg viewBox='0 0 100 100'><path d='M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z' class='arrow' transform='translate(100, 100) rotate(180)'></path></svg></button>");
		$("#product-detail .md-content").append(Buttons);
		$("#product-detail button.previous").off().on("click", function(){
			var Products = CurentProductPreview.parents(".product-list").find(".product");
			var Index = Products.index(CurentProductPreview);
			if((Index - 1) < 0){
				Index = Products.index(Products.last()) + 1;
			}
			var PrevID = Products.eq(Index - 1).attr("data-id");
			if(PrevID !== undefined){
				getProductDetail(PrevID);
			}

		});
		$("#product-detail button.next").off().on("click", function(){
			var Products = CurentProductPreview.parents(".product-list").find(".product");
			var Index = Products.index(CurentProductPreview);
			//console.log("Index1: "+(Index + 1));
			if((Index + 1) > Products.length - 1){
				Index = Products.index(Products.first()) - 1;
			}
			//console.log("Index2: "+(Index + 1));
			var NextID = Products.eq(Index + 1).attr("data-id");
			if(NextID !== undefined){
				getProductDetail(NextID);
			}
		});
	}
}
function compositionPopoverHandler(){
	$('.composition__item.detail').each(function(){
		if (!$(this).hasClass('processed')) {
			$(this).addClass('processed');  

			var roll_id = $(this).attr('data-roll-id');
			$(this).on('click, mouseenter', function(e){
				e.preventDefault();
//                $('.composition__item__popover.detail[data-roll-id="'+roll_id+'"]').show();
				$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').show();
			});
			$(this).on('mouseleave', function(e){
//                $('.composition__item__popover.detail[data-roll-id="'+roll_id+'"]').hide();
				$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').hide();
			});
		}
	   
	});
}

$(document).ready(function() {
	compositionPopoverHandler()
});

$(document).ready(function(){
	if ($('.composition').length > 0) {
		function productCardHeight(){
			var height = 0;
			$('.product-info').each(function(){
				var element_height = 0;
				var title_height = ($(this).find('.product-title').height() != undefined ) ? parseInt($(this).find('.product-title').height()) : 0;
				var description_height = ($(this).find('.product-description').height() != undefined) ? parseInt($(this).find('.product-description').height()) : 0;
				var options_height = ($(this).find('.product-options').height() != undefined) ? parseInt($(this).find('.product-options').height()) : 0;
				var footer_height = ($(this).find('.product-footer').height() != undefined) ? parseInt($(this).find('.product-footer').height()) : 0;

				element_height = title_height + description_height + options_height + footer_height;
				height = (height > element_height) ? height : element_height;
			}).css('height', height+30);
		}
		
		productCardHeight();

		$('.composition__item').each(function(){
			var roll_id = $(this).attr('data-roll-id');
			$(this).click(function(e){
				e.preventDefault();
			});
			$(this).on('mouseenter', function(e){
//                $('.composition__item__popover[data-roll-id="'+roll_id+'"]').show();
				$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').show();
			});
			$(this).on('mouseleave', function(e){
//                $('.composition__item__popover[data-roll-id="'+roll_id+'"]').hide();
				$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').hide();
			});
		});
	}
	$(window).on('resize',function(){
		if($('div').is('.product-info')){
		productCardHeight();
		};
	});
});

$(function() {
		if($('.product-energy').length){
		$('.product-energy a').on('click',function(e){
			e.preventDefault();
			$(this).toggleClass('pop-active');
			$(this).parent().find('.energy-value-content').slideToggle();
			return false;
		});
	};
});

function getProductDetail(id) {
	$('#product-detail').modal();
	$('#product-detail .modal-content').show();
	$('#product-detail .spinner').show();
	$('#product-detail .product.product-detail').hide();
	var url = window.location.href;
	$.ajax({
		type: 'post',
		data: {ProductID: id, url: url, 'Session':Session},
		dataType: "json",
		url: '/bd/?productdetail',
		success: function(data){
			startProductSlider(data.ID);
			if (window.yaCounter != undefined && window.yaCounter != null) {
				window.dataLayer.push({
					"ecommerce": {
						"detail": {
							"products": [
								{
									"id": data.ID,
									"name": data.Caption,
									"price": parseInt(data.Price),
									"category": data.SECTION.NAME,
								}
							]
						}
					}
				});
			}
			$('#product-detail .product-actions .add-to-cart-btn').removeClass('retry').text('В корзину');
			if($('.add-to-cart-btn[data-id="'+id+'"]').hasClass('retry')){
				$('#product-detail .product-actions .add-to-cart-btn').addClass('retry').text('Добавить еще');
			}
			$('#product-detail .product-actions .progress-container').hide();
			
			if(data.NO_SALE = true){
				$('#product-detail .without-sale').show();
			}else{
				$('#product-detail .without-sale').hide();
			}
			$('#product-detail .product-labels').html('');
			if(data.ProductLabels.length > 0){
				$.each(data.ProductLabels,function(i,_item){
					$('#product-detail .product-labels').append('<div title="'+_item.LabelName+'" class="product-label" style="z-index: '+(data.ProductLabels.length-i)+';"><img src="'+_item.LabelPicUri+'"></div>');
				});
			}
			$('#product-detail .product,#product-detail .add-to-cart-btn').attr('data-id',data.ID);
			
			$('#product-detail .preview .prod-image-l').attr('src',data.ImgUri);
			$('#product-detail .product-info h3').html(data.Caption );
			$('#product-detail .like-content span').text(data.LikesCount);
			if(data.Discription!==null && data.Discription.length > 0){
				$('#product-detail .product-info p').html(data.Discription);
			}else{
				$('#product-detail .product-info p').html(data.PREVIEW_TEXT);
			}
			$('#product-detail .composition').html('');
			if(data.CompositList !== null && data.CompositList.length > 0){
				var html = '';
				for (var roll in data.CompositList) {
					html += '<a href="#" class="composition__item detail" data-roll-id="'+data.ID + '_' + data.CompositList[roll].Id+'"><span>'+data.CompositList[roll].Name+'</span><div class="composition__item__popover detail" data-roll-id="'+data.ID + '_' + data.CompositList[roll].Id+'">'
							+'<div class="composition__item__image"><img src="'+ data.CompositList[roll].PicUri +'"></div>'
							+'<div class="composition__item__text">'
							+'<p class="composition__item__name"><strong>'+ data.CompositList[roll].Name +'</strong></p>'
							+'<p class="composition__item__detail">'+ data.CompositList[roll].Dicrip +'</p>'
							+'</div>'
							+'</div>'
							+'</a>';
					 $('#product-detail .composition').html(html);
				}
				compositionPopoverHandler();
			} 
			$('#product-detail .product-prices .current-price span').first().text(number_format(data.Price, 0, '.', ' '));
			$('#product-detail .product-prices .weight span').text(data.Weight);
			if (data.IsOldPrice == true){
				$('#product-detail .product-prices .line-through').text(number_format(data.OldPrice, 0, '.', ' ')).parent().show();
				$('._detail-price-cont').removeClass('base-price');
			}else{
				$('._detail-price-cont').addClass('base-price');
				$('#product-detail .product-prices .old-price').hide();
			}
			if(data.isLiked==1){
				$('#product-detail .likes').addClass('liked');
			}else{
				$('#product-detail .likes').removeClass('liked');
			}
			$('#product-detail .product-options').html('');

			$('#product-detail .product-options select').selectOrDie();
			if(data.G!==null){
				$('#product-detail .product-prices .weight span').first().text(data.G);
				$('#product-detail .product-prices .weight span').last().text(' гр.');
			}else{
				$('#product-detail .product-prices .weight span').first().text('');
				$('#product-detail .product-prices .weight span').last().text(' ');
			}
			
			if(data.Colories!=null){
				for(index in data.Colories){
					if(data.Colories[index]!=null){
						$('#product-detail .meta-property.'+index).parent().show().find('.meta-value').text(data.Colories[index]);
					}else{
						$('#product-detail .meta-property.'+index).parent().hide();
					}
				}
				$('#product-detail .product-energy').show();
			}else{
				$('#product-detail .product-energy').hide();
			}
			$('.energy-value-content').hide();
						
			registerLikes();
			setTimeout(function(){
				$('#product-detail .spinner').hide();
				$('#product-detail .product.product-detail').show();
			},500);
		}
	});
};

// basket


$(function basket() {
	$('.basket-btn').on('click', function(e){
//      if($('.basket-btn .empty-basket').is(':hidden')){
		e.preventDefault();
		var $id = $(this).data('id');
		var $target = '#'+$id;
		
		var onS = function(e){
			var $id_ = $(e).attr('id').replace('popover-','');
			$('[data-id="basket"]').addClass('pop-active');
		};
		var onH = function(){$('.basket-btn').removeClass('pop-active');};
		if($id=='basket'){
			onS = function(){
//                if(window.yaCounter!=undefined && window.yaCounter != null){
//                    yaCounter.reachGoal('go-to-basket',{});
//                }
//                if(ga!=undefined){
//                    ga('send', 'event', 'basket', 'view');
//                }
				renderBasket();
				$('.basket-btn .not-empty-basket').hide();
				$('.basket-btn .empty-basket').hide();
				$('.basket-btn .close-basket').show();
			}
			onH = function(){
				// if (!$("body").is(".basket-btn"))
				// 	$(".basket-btn").prepend('span class=""')
				// if (!$(".basket-btn").is(".not-empty-basket")) $(".basket-btn").prepend('span class=""')


				// <div class="not-empty-basket" style="display: block;">
	//               <svg viewBox="0 0 32 32"><path d="M26.899,9C26.436,6.718,24.419,5,22,5H10C7.581,5,5.564,6.718,5.101,9H0l3,13c0,2.761,2.239,5,5,5h16c2.761,0,5-2.239,5-5 l3-13H26.899z M10,7h12c1.304,0,2.403,0.837,2.816,2H7.184C7.597,7.837,8.696,7,10,7z M27,22c-0.398,1.838-1.343,3-3,3H8 c-1.657,0-2.734-1.343-3-3L2.563,11H5v1h2v-1h18v1h2v-1h2.437L27,22z M10,21h12v-2H10V21z M9,17h14v-2H9V17z"></path></svg><span class="basket-sum"><span>7 140</span></span><svg viewBox="0 0 32 32"><path d="M26.899,9C26.436,6.718,24.419,5,22,5H10C7.581,5,5.564,6.718,5.101,9H0l3,13c0,2.761,2.239,5,5,5h16c2.761,0,5-2.239,5-5 l3-13H26.899z M10,7h12c1.304,0,2.403,0.837,2.816,2H7.184C7.597,7.837,8.696,7,10,7z M27,22c-0.398,1.838-1.343,3-3,3H8 c-1.657,0-2.734-1.343-3-3L2.563,11H5v1h2v-1h18v1h2v-1h2.437L27,22z M10,21h12v-2H10V21z M9,17h14v-2H9V17z"></path></svg><svg viewBox="0 0 32 32"><path d="M26.899,9C26.436,6.718,24.419,5,22,5H10C7.581,5,5.564,6.718,5.101,9H0l3,13c0,2.761,2.239,5,5,5h16c2.761,0,5-2.239,5-5 l3-13H26.899z M10,7h12c1.304,0,2.403,0.837,2.816,2H7.184C7.597,7.837,8.696,7,10,7z M27,22c-0.398,1.838-1.343,3-3,3H8 c-1.657,0-2.734-1.343-3-3L2.563,11H5v1h2v-1h18v1h2v-1h2.437L27,22z M10,21h12v-2H10V21z M9,17h14v-2H9V17z"></path></svg></div>

				$('.basket-btn .not-empty-basket').show();
				$('.basket-btn .empty-basket').hide();
				$('.basket-btn .close-basket').hide();
				if($('.product-info-cont .close-view').is(':visible'))
					$('.product-info-cont .close-view').trigger('click');
			}
		}
			
			$('.basket-btn').webuiPopover({url:$target,id_:$id,animation: 'fade', onShow: onS,onHide: onH, cache: true,placement: 'bottom-left', container: '.product-categories-container'});
//  };
	});
});

$(document).ready(function() {
	 $('.basket-btn').click();
});

function checkPromoAjax(){
	var $input = $('.basket-promo-code');
	var code_ = $input.val();
	$.ajax({
		type: 'post',
		data: {CODE: code_, 'Session':Session},
		dataType: "json",
		url: '/bd/basket/?checkPromo',
		success: function(data){
			if(data.status==1){
				$input.closest('.bd-input').removeClass('error').addClass('ok');
			}
			if(data.status==0){
				$input.closest('.bd-input').removeClass('ok').addClass('error');
			}
			renderBasket();
			if($('select[name="ORDER[DISTRICT_ID]"]').length){
				$('select[name="ORDER[DISTRICT_ID]"]').trigger('change');
			}
		}
	});
}

function renderBasket(){
	$(".products-list.scroll-content").html('');
	$('.basket-items-col .spinner').show();
	var url = window.location.href;
	$.ajax({
	  type: 'post',
	  dataType: "json",
	  url: '/bd/basket/?getBasket',
	  data: {'url': url, 'Session':Session},
	  success: renderBasketItems
	});
}

function renderBasketItems(data){
	animateNumbers($('.basket-actions .order-sum span').first(),data.BasketPrice);
	animateNumbers($('.payment-footer .order-sum span').first(),data.TotalPrice);

	var basketTemplate = '<div class="basket-item row ${Type}" data-pid="${MID}" data-id="${MID}" data-price="${ElementPrice}"> ' +
	'<div class="col-xs-2"> ' +
	'<div class="product-image"><img src="${PicUri}">{{if $data.IsNoSale == true }}<div class="without_sale" title="'+('На этот товар не действуют дополнительные скидки и акции')+'"></div>{{/if}}</div> ' +
	'</div> ' +
	'<div class="col-xs-4"> ' +
	'<div class="name">${Name}</div> ' +
	'<div class="section">${Type}</div> ' +
	'</div> ' +
	'<div class="col-xs-3 buttons"><a href="#" class="change-amount-btn minus">-</a><span class="amount">${Amount}</span> ' +
	'<input type="hidden" value="${Amount}"><a href="#" class="change-amount-btn plus">+</a> ' +
	'</div> ' +
	'<div class="col-xs-2 text-xs-right nopad"><span class="product-sum font-fix"><span>${TotalPrice}</span><span class="currency">'+('R')+'</span></span></div> ' +
	'<div class="col-xs-1 text-xs-left remove-basket-item"><a href="#"> ' +
	'<svg viewBox="0 0 38.0919 40.5429"><path class="cls-1" d="M35.1491,39.3951V60.8883a6.2561,6.2561,0,0,0,6.2366,6.2366H59.81a6.2549,6.2549,0,0,0,6.2366-6.2366V39.3951H35.1491ZM57.8477,31.016c-0.5913-5.912-13.9111-5.912-14.5019,0H33.838a2.2942,2.2942,0,0,0-2.2875,2.2868h0A2.2939,2.2939,0,0,0,33.838,35.59H67.3556a2.2938,2.2938,0,0,0,2.2868-2.2875h0a2.2941,2.2941,0,0,0-2.2868-2.2868h-9.508ZM43.9426,60.6523c-0.8815,0-1.5868-.3957-1.5868-0.89V45.9838c0-.4947.7053-0.8907,1.5868-0.8907s1.587,0.396,1.587.8907v13.778c0,0.4947-.7053.89-1.587,0.89h0Zm6.6539,0c-0.8817,0-1.587-.3957-1.587-0.89V45.9838c0-.4947.7053-0.8907,1.587-0.8907s1.5868,0.396,1.5868.8907v13.778c0,0.4947-.7053.89-1.5868,0.89h0Zm6.6551,0c-0.8817,0-1.587-.3957-1.587-0.89V45.9838c0-.4947.7053-0.8907,1.587-0.8907s1.5868,0.396,1.5868.8907v13.778C58.8383,60.2565,58.133,60.6523,57.2515,60.6523Z" transform="translate(-31.5505 -26.5819)"/></svg></a></div> ' +
	'</div>';
	$.template( "basketTemplate", basketTemplate );

//    if(data.cashback){
//        animateNumbers($('.basket-actions .bonuses-info span').first(),data.cashback);
//        animateNumbers($('.payment-footer .bonuses-info span').first(),data.cashback);
//        $('.summary-label.user-bonus-append .meta-value_ span').first().text(data.cashback).closest('.summary-label.user-bonus-append').show()
//      }else{
//        $('.summary-label.user-bonus-append').hide()
//      }
//    if(data.promo || data.discount){
//        if(data.discount && data.discount!==null){
//            $('.basket-actions .order-discount .meta-value span').first().parent().show();
//            animateNumbers($('.basket-actions .order-discount span').first(),data.discount);
//            animateNumbers($('.payment-footer .order-discount .meta-value span').first(),data.discount);
//            $('.payment-footer .order-discount span').first().parent().show();
//            $('.basket-actions .order-discount span').first().parent().show();
//            $('.basket-actions .order-total').find('.summary-label').hide();
//            //$('.payment-footer .order-total').find('.summary-label').hide();
//            $('.basket-actions .apply-code-btn').addClass('ok');
//        }else{
//            $('.basket-actions .order-discount span').first().parent().hide();
//            $('.payment-footer .order-total').find('.summary-label.order-discount').show();
//            $('.basket-actions .order-total').find('.summary-label').show();
//        }
//        if(data.promo){
//            $('.basket-promo-code').val(data.promo).parent().addClass('filled ok');
//        }else{
//            $('.basket-promo-code').val('').parent().removeClass('filled ok');
//        }
//    }else{
		$('.basket-actions .order-discount span').first().parent().hide();
		$('.payment-footer .order-total').find('.summary-label.order-discount').show();
		$('.basket-actions .order-total').find('.summary-label').show();
		$('.payment-footer .order-discount').hide();
		$('.basket-actions .order-discount').hide();
		$('.basket-actions .apply-code-btn').removeClass('ok');
//    }
	$("select").selectOrDie({placeholderOption:true});
	$('.scrollbar-macosx').scrollbar({"scrollx": false});
	$('.products-list.scroll-content').html('');
	  $.tmpl( 'basketTemplate', data.BasketElements ).appendTo('.products-list.scroll-content');
	$('.basket-items-col .spinner').hide();

	setTimeout(function(){
		addBasketEvents();
	}, 500);
	renderSummary(data);
}

function addBasketEvents(){
	$('.basket-item .change-amount-btn').on('click',function(e){
		e.preventDefault();
		var $basket_item = $(this).closest('.basket-item');
		var current_val = $basket_item.find('.buttons').find('input[type="hidden"]').val();
		var new_val = parseInt(current_val);
		var product_id = $basket_item.data('id');
		var price = parseInt($basket_item.data('price'));
		if($(this).hasClass('plus')){
			new_val++;
		}else{
			new_val--;
		}
		if(new_val==0){
			new_val = 1;
			$(this).tooltip({trigger: 'hover', title: 'Если вы хотите удалить позицию, воспользуйтесь кнопкой справа', delay: {hide: 3000}})
			$(this).tooltip('show');
			setTimeout(function() {
			$('.tooltip').remove();
			}, 3000);
		}else{
		$.ajax({
			type: 'post',
			data: {'PRODUCT_ID': product_id, 'AMOUNT': new_val, 'Session':Session},
			dataType: "json",
			url: '/bd/basket/?changeAmount',
			success: function(data){
				console.clear()
				console.log('TRIGGER')
				console.log(data)

				var has_gift = false;
				//console.log(data);
				$.each(data.products,function(i,item){
					if(item.Type=='gift'){
						has_gift = true;
					}
					$basket_item = $('.basket-item[data-id="'+item.Type+'"]');
					$basket_item.find('.buttons .amount').text(item.Amount);
					$basket_item.find('.buttons input[type="hidden"]').val(item.Amount);
					animateNumbers($basket_item.find('.product-sum span').first(),item.Price.replace(' ',''));
				});
				var $gift_item = $('.basket-item[data-id="gift"]');
				if($gift_item.length>0 && !has_gift){
					$gift_item.remove();
					if($('.get-another-gift-btn').length){
						$('.get-another-gift-btn').trigger('click')
					}
				}
				renderBasketItems(data);
				renderSummary(data);
				$('.order-content li:not(.person').remove();
				checkoutbasket(data);
			}
		});
		}
		return false;
	});


	// $('.basket-item .change-amount-btn').on('click',function(e){
	// 	e.preventDefault();
	// 	var $basket_item = $(this).closest('.basket-item');
	// 	var current_val = $basket_item.find('.buttons').find('input[type="hidden"]').val();
	// 	var new_val = parseInt(current_val);
	// 	var product_id = $basket_item.data('id');
	// 	var price = parseInt($basket_item.data('price'));
	// 	if($(this).hasClass('plus')){
	// 		new_val++;
	// 	}else{
	// 		new_val--;
	// 	}
	// 	if(new_val==0){
	// 		new_val = 1;
	// 		$(this).tooltip({trigger: 'hover', title: 'Если вы хотите удалить позицию, воспользуйтесь кнопкой справа', delay: {hide: 3000}})
	// 		$(this).tooltip('show');
	// 		setTimeout(function() {
	// 		$('.tooltip').remove();
	// 		}, 3000);
	// 	}else{
	// 	$(this).closest('.basket-item').find('.amount').text(new_val)

	// 	$('[name="AMOUNTS"]').val('');
	// 	var resultamounts = [];
	// 	$('.buttons .amount').each(function(index){
	// 	resultamounts.push($(this).text());
	// 	});
	// 	$('[name="AMOUNTS"]').val(resultamounts);
	// 	var $form = $('#checkout-form');
	// 	$.ajax({
	// 		type: 'post',
	// 		data: $form.serialize(),
	// 		dataType: "json",
	// 		url: '/bd/checkout/?validatedelivery',
	// 		success: function(data){
	// 			$('[name="IDS"]').val('');
	// 			$('[name="AMOUNTS"]').val('');
	// 			$('.order-content li:not(.person)').remove();
	// 			checkoutbasket(data);
	// 		}
	// 	});
	// 	}
	// 	return false;
	// });



	$('.remove-basket-item a').off().on('click',function(e){

		if($('.constructor-view').is(':visible')){
			$('.constructor-view .close-view').trigger('click');
		}
		e.preventDefault();

		var $basket_item = $(this).closest('.basket-item');
		var product_id = $basket_item.attr('data-id');
		if (window.yaCounter != undefined && window.yaCounter != null) {
			window.dataLayer.push({
				"ecommerce": {
					"remove": {
						"products": [
							{
								"id": product_id,
								"name": $basket_item.find('.name').text(),
								"price": $basket_item.attr('data-price'),
								"quantity": $basket_item.find('.amount').text()
							}
						]
					}
				}
			});

		}
		// if(product_id=='gift' && $('.get-another-gift-btn').length) {
		if($basket_item.hasClass('Подарок') && $('.get-another-gift-btn').length) {
			$('.product.gift').removeClass('active');
			$('.product.gift.masked').each(function() {
				$(this).removeClass('masked');
			});

			$('.md-modal').each(function() { $(this).removeClass('md-show')});
			$('#global-overlay').removeClass('md-show');
			$('.modal').each(function() { $(this).removeClass('show')});
			$('.modal-backdrop').removeClass('show');
			$('.modal-backdrop').remove();
			$('#popover-ingridients-filter').css('opacity',0);

			$('.get-gift').text('Выбрать');
			$('.btn-get-gift').text('Выбрать');
			$('.product.gift:not(.masked) .get-gift-btn').text('Выбрать');
			$('.product.gift:not(.masked) .get-gift-btn').removeClass('reset-gifts');
		}

		$('.product[data-id="'+$basket_item.attr('data-pid')+'"]').find('.add-to-cart-btn').removeClass('retry').text('В корзину');
		 var new_val = '0';
		$.ajax({
			type: 'post',
			data: {'PRODUCT_ID': product_id, 'AMOUNT': new_val, 'Session': Session},
			dataType: "json",
			url: '/bd/basket/?changeAmount',
			success: function(data){
				var has_gift = false;
				$.each(data.products,function(i,item) {
					if (item.INDEX == 'gift') {
						has_gift = true;
					}
					if(item.ID.indexOf('additional_')!==-1){
						$('.basket_item_is_additional[data-id="'+item.ID+'"] .buttons').find('.amount').text(item.AMOUNT);
						$('.basket_item_is_additional[data-id="'+item.ID+'"] .buttons').find('input[type="hidden"]').val(item.AMOUNT);
					}
				});

				$('.order-content li[data-pid="'+$basket_item.attr('data-pid')+'"]').remove();

				$basket_item.remove();
				var $gift_item = $('.basket-item[data-id="gift"]');
				if($gift_item.length>0 && !has_gift){
					$gift_item.remove();
					if($('.get-another-gift-btn').length){
						$('.get-another-gift-btn').trigger('click')
					}
				}
				renderSummary(data);
			}
		});


		return false;
	});
	$('.basket-item .name,.basket-item .product-image').off().on('click',function(){
		if(!$(this).closest('.basket-item').hasClass('without_detail')){ 
			if(!$('.product-info-cont').is(':visible'))
				$('#popover-basket').addClass('product-information-open').css( 'left', '-=93px' );
			var id = $(this).closest('.basket-item').data('id');
			$('.recommendation-container').hide();
			$('.basket-gift-container').hide();
			$.ajax({
				type: 'post',
				data: {ProductID: id, 'Session':Session},
				dataType: "json",
				url: '/bd/?productdetail',
				success: function(data){
					$('.information-col .close-view').show();
					$('.information-col .apply-view').hide();
					$('.product-info-cont .constructor-view .product-scroll-content').show();
					$('.product-info-cont .constructor-view .constructor-scroll-content').hide();
					$('.product-info-cont .constructor-view .product-image img').attr('src',data.ImgUri);
					$('.product-info-cont .constructor-view .name').attr('data-id',id).html(data.Caption);
					$('.product-info-cont .like-content span').text(data.LikesCount);
					$('.product-info-cont .constructor-view .product-scroll-content .product-description').html(data.Discription);
					$('.product-info-cont .likes').attr('data-id',data.ID).show();
					if(data.isLiked==1){
						$('.product-info-cont .likes').addClass('liked');
					}else{
						$('.product-info-cont .likes').removeClass('liked');
					}
					
//                    if(data.TYPE=='native'){
//                        $('.product-info-cont .like-content span').text(data.LikesCount);
//                        $('.product-info-cont .constructor-view .product-scroll-content .product-description').html(data.Discription);
//                        $('.product-info-cont .likes').attr('data-id',data.ID).show();
//                        if(data.isLiked==1){
//                            $('.product-info-cont .likes').addClass('liked');
//                        }else{
//                            $('.product-info-cont .likes').removeClass('liked');
//                        }
//                        $('.product-info-cont .constructor-view .product-scroll-content .product-options').html('');
//                        if(data.BD_PROPS!=null){
//                            var ji = 0;
//
//                            $.each(data.BD_PROPS,function(key,item){
//                                var content = '<div class="options-row-select col-xl-'+parseInt(12/parseInt(data.BD_PROPS.length))+' col-lg-12"><select data-placeholder-option="true">';
//                                content += '<option value="null">'+data.OPTIONS_NAME[ji+1]+'</option>';
//                                $.each(item,function(skey,sitem){
//                                    var selected = '';
//                                    if(ji==0 && skey==parseInt(data.OPTIONS.OPTION_1)){
//                                        selected = 'selected="selected"';
//                                    }
//                                    if(ji==1 && skey==parseInt(data.OPTIONS.OPTION_2)){
//                                        selected = 'selected="selected"';
//                                    }
//                                    content+= '<option '+selected+' value="'+skey+'" data-price="'+sitem.Price+'" data-old-price="'+sitem.OldPrice+'" data-weight="'+sitem.Weight+'">'+sitem.VALUE+'</option>';
//                                });
//                                content +="</select></div>";
//                                $('.product-info-cont .constructor-view .product-scroll-content .product-options').append(content);
//                                ji++;
//                            });
//                        }
//                        $('.product-info-cont .constructor-view .product-scroll-content .product-options select').on('change',function(){
//                            $('.information-col .close-view').hide();
//                            $('.information-col .apply-view').show();
//                        }).selectOrDie();
//                        $('.product-info-cont .constructor-view .product-scroll-content .product-prices .weight').text(data.G);
//                        registerLikes();
//                        $('.product-info-cont .constructor-view .constructor-scroll-content').hide();
//                        $('.product-info-cont .constructor-view .product-scroll-content').show();
//                    }else{
//                        $('.product-info-cont .likes').hide();
//                        $('.product-info-cont .constructor-content .ingredients_list_').html('');
//                        $('.product-info-cont .constructor-content .base_value_').text(data.BASE);
//                        $('.product-info-cont .constructor-content .souse_value_').text(data.SOUSE);
//                        $.each(data.INGREDIENTS,function(i,item){
//                            $('.product-info-cont .constructor-content .ingredients_list_').append('<div class="property-value">'+item+'</div>')
//                        })
//                        $('.product-info-cont .constructor-view .product-scroll-content').hide();
//                        $('.product-info-cont .constructor-view .constructor-scroll-content').show();
//                    }
					$('.product-info-cont').show();
				}
			});
		}
	});
}

function renderSummary(data){

	$("#basket .products-list .basket-item").addClass("not_in_basket");

	if(data.BasketElements.length>0){
		$.each(data.TBasketElement,function(i,item){
			var a_product = new Array(item);
			var $basketItem = $(".basket-item[data-pid='" + item.MID + "']");
			$('.order-content li[data-pid="'+item.MID+'"] .amount span').first().text(item.Amount);
			$('.order-content li[data-pid="'+item.MID+'"] .price span').first().text(item.Price);

			if($("#basket .products-list").length){
				if($basketItem.length){
					$basketItem.removeClass("not_in_basket");
				}else{
					$.tmpl( "basketTemplate", a_product ).appendTo(".products-list.scroll-content");
					$basketItem = $(".basket-item[data-pid='" + item.MID + "']");
					$(".products-list.scroll-content").animate({
						scrollTop: $basketItem.offset().top
					}, 600);
					addBasketEvents();
				}
			}
		});
	}
//            if(item.IS_ADDITIONAL !== null && item.DOP_PRODUCT_INDEX !== null){
//                if($('.basket-item[data-id="'+item.DOP_PRODUCT_INDEX+'"]').length){
//                    $basketItem.addClass("not_change_amount");
//                }else{
//                    $basketItem.removeClass("not_change_amount");
//                }
//            }
//        });
//
//        $(".basket-item.not_in_basket").remove();
//    }
//
	var min_order = parseInt($('.min-order-progress').data('min-order'));
//    if(data.TotalPrice>=min_order){
//        if($('.send-order').length){
//          $('.checkout-min-order-label').hide();
			//$('.send-order').removeAttr('disabled');
//            $('.send-order').prop('disabled', false);
//        }
//        $('.min-order-progress').hide();
//        $('.min-order-progress').find('.progress-bar').css('width','100%');
		$('.basket-checkout-btn').css('display','block');
//    }else{
//      $('.checkout-min-order-label').show();
		//$('.send-order').attr('disabled','disabled');
//        $('.send-order').prop('disabled', true);
//        $('.min-order-progress').show();
//        $('.min-order-progress').find('.progress-bar').css('width',parseInt(data.TotalPrice/min_order*100)+'%');
//        $('.basket-checkout-btn').css('display','none');
//    }
	if(data.BasketElements.length>0){
		if(data.BasketPrice == 0){
			// && data.discount!==null && data.discount!==undefined
			if(!isNaN(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val()) + data.BasketPrice - window.prev_delta))
				$('[name="ORDER[DISCOUNT_BONUSES]"]').val(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val()) + data.BasketPrice - window.prev_delta);

			window.prev_delta = 0;
			if(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val())+data.BasketPrice > min_order){
				//$('.send-order').removeAttr('disabled');
				$('.send-order').prop('disabled', false);
			}
		}
		if(data.BasketPrice < 0){
			$('[name="ORDER[DISCOUNT_BONUSES]"]').val(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val()) + data.BasketPrice );
			window.prev_delta = data.BasketPrice;
			data.BasketPrice = 0;
			//$('.send-order').removeAttr('disabled');
			$('.send-order').prop('disabled', false);
		}
		if(parseInt(data.BasketPrice) >= min_order){
			//$('.send-order').removeAttr('disabled');
			$('.send-order').prop('disabled', false);
		}

//        animateNumbers($('.summary-label.basket-sum .meta-value_ span').first(),data.basket_sum_native);
		animateNumbers($('.summary-label.basket-sum .meta-value_ span').first(),data.BasketPrice);
		animateNumbers($('.order-total .order-sum span').first(),data.BasketPrice);
		animateNumbers($('.basket-actions .bonuses-info span').first(),data.cashback);
		animateNumbers($('.payment-footer .bonuses-info span').first(),data.cashback);
		if(data.promo!==undefined && $('.bonuses-with-promo-disabled').length){
			$('.bonuses-with-promo-disabled').show();
			$('.payment-footer .bonuses-info .default-text').hide();
			$('.basket-actions .bonuses-info .default-text').hide();
		}else{
			$('.bonuses-with-promo-disabled').hide();
			$('.payment-footer .bonuses-info .default-text').show();
			$('.basket-actions .bonuses-info .default-text').show();
		}

		if ($('.not-empty-basket .basket-sum > svg').length <= 0) $('.not-empty-basket').append('<svg viewBox="0 0 32 32"><path d="M26.899,9C26.436,6.718,24.419,5,22,5H10C7.581,5,5.564,6.718,5.101,9H0l3,13c0,2.761,2.239,5,5,5h16c2.761,0,5-2.239,5-5 l3-13H26.899z M10,7h12c1.304,0,2.403,0.837,2.816,2H7.184C7.597,7.837,8.696,7,10,7z M27,22c-0.398,1.838-1.343,3-3,3H8 c-1.657,0-2.734-1.343-3-3L2.563,11H5v1h2v-1h18v1h2v-1h2.437L27,22z M10,21h12v-2H10V21z M9,17h14v-2H9V17z"></path></svg>');
		if ($('.not-empty-basket .basket-sum').length <= 0) $('.not-empty-basket').append('<span class="basket-sum"><span></span></span>');
		animateNumbers($('.not-empty-basket').find('.basket-sum span').first(),data.BasketPrice);
		animateNumbers($('.basket-actions .order-sum span').first(),data.BasketPrice);
		if(data.GiftPrice < 1250){
			var percent = parseInt(data.GiftPrice/1250*100);

			$('.basket-gift-container .progress-container.in-progress').show().find('.progress-bar').css('width',percent+'%');
		animateNumbers($('.basket-gift-container .progress-container.in-progress .sum-to-gift span').first(),1250-data.GiftPrice);

			$('.basket-gift-container .progress-container.progress-completed').hide();
			$('.basket-gift-container .progress-container.progress-get-another').hide();

		}else{
			var basket_has_gift = false;
			for(prod in data.products){
				if(data.products[prod].INDEX=='gift'){
					basket_has_gift = true;
				}
			}

			$('.basket-gift-container .progress-container.in-progress').hide();

			if(basket_has_gift==true){
				$('.basket-gift-container .progress-container.progress-completed').hide();
				$('.basket-gift-container .progress-container.progress-get-another').show();
			}else{
				$('.product.gift').removeClass('active');
				$('.basket-gift-container .progress-container.progress-completed').show();
				$('.basket-gift-container .progress-container.progress-get-another').hide();
			}
		}
		if(!$('.product-info-cont').is(':visible')){
			$('.recommendation-container.no-recommendation').show();
			$('.recommendation-container.recommendation-list .rc-list').html('');
			$('.recommendation-container.recommendation-list .rc-nav').html('');
			$('.recommendation-container.static-banner').show().html('');

//            if(data.recommendation.single!==undefined && (data.recommendation.list==undefined && data.recommendation.list==null || data.recommendation.list.length == 0)){
//                    $('.recommendation-container.no-recommendation').hide();
//                    $('.recommendation-container.recommendation-list').hide();
//                    $('.recommendation-container.static-banner').html('<a href="'+data.recommendation.single.URL+'"><img src="'+data.recommendation.single.IMAGE.SRC+'" /></a>').show();
//            }
//            if(data.recommendation.list!==undefined && data.recommendation.list!==null && data.recommendation.list.length>0){
//                $('.recommendation-container.no-recommendation').hide();
//                $('.recommendation-container.static-banner').hide();
//                $('.recommendation-container.recommendation-list').show();
//                var pages = Math.ceil(data.recommendation.list.length/3);
//                for (var j = 0; j < pages; j++) {
//                    var clas_ = '';
//                    $('.recommendation-container.recommendation-list .rc-list').append('<div class="recommendation-tab" data-index="'+(j+1)+'"></div>');
//                    if(pages>1){
//                        if(j==0){
//                            clas_ = 'class="active"'
//                        }
//                        $('.recommendation-container.recommendation-list .rc-nav').append('<li '+clas_+'><a href="#" data-index="'+(j+1)+'"><div class="rc-bull"></div></a></li>');
//                    }
//                }
//                $.each(data.recommendation.list,function(i,item){
//                    var bgi = '';
//
//                    if(item.IMAGE.SRC!==undefined){
//                        bgi = 'background-image: url('+item.IMAGE.SRC+');';
//                    }
//                    $('.recommendation-container.recommendation-list .rc-list .recommendation-tab[data-index="'+Math.ceil((i+1)/3)+'"]').append('<div class="rc-item" style="background-color: '+item.PROPERTY_BG_COLOR_VALUE+';'+bgi+'"><a href="'+item.URL+'" class="go-rc-btn" style="color: '+item.PROPERTY_BUTTON_FONT_COLOR_VALUE+';background-color: '+item.PROPERTY_BUTTON_COLOR_VALUE+';">'+item.NAME+'</a></div>');
//                });
//                $('.recommendation-container.recommendation-list .rc-nav li a').off().on('click',function(e){
//                    $('.recommendation-container.recommendation-list .rc-nav li').removeClass('active');
//                    $(this).parent().addClass('active');
//                    e.preventDefault();
//                    $('.recommendation-container.recommendation-list .recommendation-tab').hide();
//                    $('.recommendation-container.recommendation-list .recommendation-tab[data-index="'+$(this).attr('data-index')+'"]').show();
//                    return false;
//                })
//            }
		}

		if(!$('#basket').is(':visible')){
			$('.not-empty-basket').show()
			$('.empty-basket').hide();
		}
	}else{
		$('body').trigger('click');
		$('.basket-sum span').first().text(0);
		$('.empty-basket').show();
		$('.not-empty-basket').hide()
	}

	calcGifts(data.GiftPrice);
}

function getGift() {
		$('#popover-basket').hide();
		if ($('.modal-backdrop').length <= 0) {
			$('.modal-backdrop').addClass('show')
		} else {
			$('body').append('<div class="modal-backdrop fade show"></div>');
		}
		$('#gift-modal').modal();
		$('#gift-modal').addClass('show');
		$('.progress-bar-content').css('display','block');
		//$('#gift-modal .md-content').show();
		//$('#gift-modal').on('click',function(e){
		//  e.preventDefault();
		//});
}

function calcGifts(sum){
	var limit1 = 1250;
	var limit2 = 2000;
	var limit3 = 3000;
	var percent = sum/limit3*100;
	$('.gift-sticky .grade').css('height',percent+'%');
	$('.grade-cont .gift-item').removeClass('active');

	var btn_showed = 0;
	$('.gift-sticky .gift-toggle').removeClass('active');
	clearInterval(window.giftToggleAnimateTimer);
	if(sum >= limit1){
		window.giftToggleAnimateTimer = setInterval(function(){
			$('.collapsed-gift .gift-toggle svg').addClass('animated infinite tada');
			setTimeout(function(){
				$('.collapsed-gift .gift-toggle svg').removeClass('animated infinite tada');
			},1000);
		},5000);
		$('.gift-sticky .gift-toggle').addClass('active');

		$('.grade-cont .gift-item.limit1').addClass('active').removeClass('not-animate');
		$('.grade-cont .gift-item.limit1 .get-gift').show();
		$('.grade-cont .gift-item.limit3 .get-gift').hide();
		$('.grade-cont .gift-item.limit2 .get-gift').hide();
	}else{
		$('.grade-cont .gift-item.limit1').addClass('not-animate');
		$('.grade-cont .gift-item.limit1 .get-gift').hide();
	}

	if(sum >= limit2){
		$('.grade-cont .gift-item.limit2').addClass('active').removeClass('not-animate');
		$('.grade-cont .gift-item.limit1').addClass('not-animate');
		$('.grade-cont .gift-item.limit2 .get-gift').show();
		$('.grade-cont .gift-item.limit1 .get-gift').hide();
		$('.grade-cont .gift-item.limit3 .get-gift').hide();
	}else{
		$('.grade-cont .gift-item.limit2').addClass('not-animate');
	}
	if(sum >= limit3){
		$('.grade-cont .gift-item.limit3').addClass('active').removeClass('not-animate');;
		$('.grade-cont .gift-item.limit2').addClass('not-animate');
		$('.grade-cont .gift-item.limit3 .get-gift').show();
		$('.grade-cont .gift-item.limit2 .get-gift').hide();
		$('.grade-cont .gift-item.limit1 .get-gift').hide();
	}else{
		$('.grade-cont .gift-item.limit3').addClass('not-animate');
	}

	if($('.product.gift').length){
		$('.product.gift').each(function(i,item){
			var limit = parseInt($(item).find('.gift-progress-info').data('limit'));
			var percent = sum/limit*100;

			if(limit > sum){
				$(item).find('.gift-progress-value').text(limit-sum);
				$(item).find('.progress-container .progress-bar').css('width',percent+'%');
				$(item).find('.gift-progress-info').show();
				$(item).find('.get-gift-btn').hide();
			}else{
				$(item).find('.gift-progress-info').hide();
				$(item).find('.get-gift-btn').show();
			}
		});
	}
	if(sum < limit1){
		var percent = parseInt(sum/limit1*100);

		$('.gift-progress').show().find('.progress-bar').css('width',percent+'%');
		animateNumbers($('.gift-progress .sum-to-gift span').first(),limit1-sum);

		$('.gift-progress-complete').hide();
	}
}


$(document).ready(function () {
	 $('.product-actions .add-to-cart-btn').off().on('click',function(e){
			var $self = $(this);
			var $prod = $self.closest('.product');
			var options = {};
			var data = ('product');
			var url = window.location.href;
	//        if(validateProperties($prod)){
				var imgtodrag = $prod.find('.preview img').last().eq(0);
				var cart = $('.basket-btn-container');
				if (imgtodrag) {
					var imgclone = imgtodrag.clone()
						.css({
							'opacity': '1',
							'position': 'absolute',
							'z-index': '10000',
							'visibility': 'visible',
							'display': 'block',
							'border-radius':'50%',
							'top': $prod.find('.preview').offset().top,
							'left': $prod.find('.preview').offset().left,
							'width': '300px'
						})
						.appendTo('body')
						.animate({
							'top': cart.offset().top,
							'left': cart.offset().left+100,
							'width': '50px'
						}, 1000);

					imgclone.fadeOut('fast', function () {
						$(this).detach()
					});
	//            }
				$.ajax({
					type: 'post',
					data: {'PRODUCT_ID': $self.data('id'),options:options, Action: data, 'url': url, 'Session': Session},
					dataType: "json",
					url: '/bd/basket/?addToBasket',
					success: function(data){
						renderSummary(data);
						renderBasketItems(data);
					}
				});
				$('.product[data-id="'+$self.data('id')+'"]').find('.add-to-cart-btn').addClass('retry').text('Добавить еще');
				if(!$self.hasClass('retry'))
					$self.addClass('retry').text('Добавить еще');
			}
			return false; 
	 });
 
	$('.constructor-view .close-view,.constructor-view .product-image').on('click',function(e){
		e.preventDefault();
		$('#popover-basket').removeClass('product-information-open').css( 'left', '+=93px' );
		$('.product-info-cont').hide();
		if($('.recommendation-container.static-banner').html()!=''){
			$('.recommendation-container.static-banner').show();
		}
		if($('.recommendation-container.recommendation-list .rc-list .recommendation-tab').length>0){
			$('.recommendation-container.recommendation-list').show();
		}
		if($('.recommendation-container.static-banner').html()=='' && $('.recommendation-container.recommendation-list .rc-list .recommendation-tab').length==0){
			$('.recommendation-container.no-recommendation').show();
		}
		$('.basket-gift-container').show();
		return false;
	});
	
	// if($('.get-gift-btn').length){
		$('body').on('click','.get-gift-btn.reset-gifts',function(e){
			e.preventDefault();
			if ($(this).hasClass('reset-gifts')) {
				isReset= true;
				$('#products-list .basket-item').each(function() {
					if($(this).hasClass('Подарок')) {
						$(this).find('a').click();
						$(this).removeClass('active');
					}
				})
				$('.product gift.masked').removeClass('masked');
				$('.get-gift').text('Выбрать');
				$('.get-gift-btn').text('Выбрать');
				$('.btn-get-gift').text('Выбрать');
				$('.product.gift:not(.masked) .get-gift-btn').text('Выбрать');
				$('.get-gift-btn').removeClass('reset-gifts');
				$('.product.gift.masked').each(function() { $(this).removeClass('masked)'); })
				$(this).removeClass('reset-gifts');
				$('#gift-modal').addClass('show');
				if (!$('.modal-backdrop').length)
					$('body').append('<div class="modal-backdrop fade show" style="display: block;"></div>');
				$('.modal-backdrop').addClass('show');
			}
		});
		$('body').on('click','.get-gift-btn:not(.reset-gifts)',function(e){
			e.preventDefault();
			var $self = $(this).closest('.product');
			var data = ('gift');
			$.ajax({
				type: 'post',
				data: {'PRODUCT_ID': $self.parent().data('id'), Action: data, 'Session': Session},
				dataType: "json",
				url: '/bd/basket/?addToBasket',
				success: function(data){
					//if(data.basket_sum!=undefined){
						renderBasket();
					//    $self.addClass('active');
						$('.product.gift').addClass('masked');
						$('.product.gift[data-id="'+$self.parent().data('id')+'"]').removeClass('masked');
						$('.get-gift').text('Выбрать другой');
						$('.btn-get-gift').text('Выбрать другой');
						$('.product.gift:not(.masked) .get-gift-btn').text('Выбрать другой');
						$('.product.gift:not(.masked) .get-gift-btn').addClass('reset-gifts');
					//}else{
					//    console.log(BX.message('good_luck_bitch'))
					//}
				}
			})
				
			$('#gift-modal').hide();
			$('.modal-backdrop').remove();
		});
//        $('.get-another-gift-btn').on('click',function(e){
//            e.preventDefault();
//            var $self = $(this).closest('.product');
//            $.ajax({
//                type: 'post',
//                data: {'PRODUCT_ID': $self.data('id'),IS_GIFT: 1},
//                dataType: "json",
//                url: '/bitrix/components/bd/basket/component.php?action=removeGift',
//                success: function(data){
//                    renderBasketItems(data);
//                    if(data.basket_sum!=undefined){
//                        $self.closest('.gift').removeClass('active');
//                        $('.product.gift').removeClass('masked');
//                        $('.get-gift').text(BX.message('choise'));
//                    }
//                }
//            });
//
//        });
	// }
});

// menu

$(document).ready(function () {
	$('li.dropdown').hover(function() {
		$(this).find('.dropdown-menu').show().delay(1).fadeIn(1);
		}, function() {
	$(this).find('.dropdown-menu').show().delay(1).fadeOut(1);
	});
	
	$(window).on('resize',resizeHandler);
	resizeHandler();
});

function resizeHandler(){
		var mod_ = 0.55;
	if($(window).width() < 1000){
		mod_ = 0.50;
	}
	var max_width = parseInt($('.menu-general').parent().width()*mod_);

	var current_width = 0;
	$('.menu-general li').each(function(i,item){
		if(!$(item).find('a').hasClass('menu-more-btn')){
			if(parseInt(current_width+$(item).width()) > max_width){
				var active_state = '';
				if($(item).hasClass('active')){
					active_state = ' class="active"';
				}
				$('.menu-extended').prepend("<li"+active_state+">"+$(item).html()+"</li>");
				$(item).remove();
			}else{
				current_width += $(item).width();
			}
		}
	});
	$('.menu-extended li').each(function(i,item){
		if(parseInt(getMenuWidth()+$(item).width()) < max_width){
			var active_state = '';
			if($(item).hasClass('active')){
				active_state = ' class="active"';
			}
			$('.menu-general .menu-more-btn').parent().before("<li"+active_state+">"+$(item).html()+"</li>");
			//current_width += $(item).width();
			$(item).remove();
		}
	});
	if($('.menu-extended li').length>0){
		$('.menu-extend-cont').css('display','inline-block');
	}else{
		$('.menu-extend-cont').css('display','none');
	}
	
	
	if($('.bonuses-block').length > 0){
		if($(window).width() < 1200){
			$('.bonuses-block .bd-input label').css('font-size','12px');
			$('.bonuses-block .col-xs-12').css('margin-top','90px');
			$('.bonuses-block .title,.bonuses-block .value').css('left','31px');
		}else{
			$('.bonuses-block .bd-input label').css('font-size','14px');
			$('.bonuses-block .col-xs-12').css('margin-top','0');
			$('.bonuses-block .title,.bonuses-block .value').css('left','137px');
		}
	}
	
	if($(window).width() < 992){
		$('.order-content-cont').addClass('nopad');
		$('.order-content-cont .checkout-title').addClass('linkify')
	}else{
		$('.order-content-cont').removeClass('nopad');
		$('.order-content-cont .checkout-title').removeClass('linkify')
	}
}

$(document).ready(function(){
	if (navigator.cookieEnabled == true){

	}else{
		$('#cookie-modal').modal();
	}
	
	$(document).on('click','#rules',function(){
		$('#rules-modal').modal();
	});
});

// logout

$(function() {
window.addEventListener("beforeunload", function (e) { 
		var url = window.location.href;
	  $.ajax({
		  type: "POST",
		  data: {url: url, 'Session':Session},
		  url: '/bd/?leave',
		  async: false           
	  });
	  return;
	});
});

// checkout

function getcheckoutbasket(){
	$.ajax({
	  type: 'post',
	  dataType: "json",
	  url: '/bd/basket/?getBasket',
	  data: { 'Session':Session },
	  success: checkoutbasket
	});
};

function checkoutbasket(data){
	if (window.location.pathname == '/checkout/'){
	var checkoutbasketTemplate = '<li class="basket-item row ${Type}" data-pid="${MID}" data-id="${MID}" data-price="${ElementPrice}"> ' +
		'<div class="col-xs-2"> ' +
		'<div class="image"><img src="${PicUri}">{{if $data.IsNoSale == true }}<div class="without_sale" title="'+('На этот товар не действуют дополнительные скидки и акции')+'"></div>{{/if}}</div> ' +
		'</div> ' +
		'<div class="col-xs-4"> ' +
		'<div class="name">${Name}</div> ' +
		'<div class="section">${Type}</div> ' +
		'</div> ' +
		'<div class="col-xs-3 buttons"><a href="#" class="change-amount-btn minus">-</a><span class="amount">${Amount}</span> ' +
		'<input type="hidden" value="${Amount}"><a href="#" class="change-amount-btn plus">+</a> ' +
		'</div> ' +
		'<div class="col-xs-1 text-xs-right nopad"><span class="product-sum font-fix"><span>${TotalPrice}</span><span class="currency">'+('R')+'</span></span></div> ' +
		'<div class="col-xs-1 text-xs-left remove-basket-item"><a href="#"> ' +
		'<svg viewBox="0 0 38.0919 40.5429"><path class="cls-1" d="M35.1491,39.3951V60.8883a6.2561,6.2561,0,0,0,6.2366,6.2366H59.81a6.2549,6.2549,0,0,0,6.2366-6.2366V39.3951H35.1491ZM57.8477,31.016c-0.5913-5.912-13.9111-5.912-14.5019,0H33.838a2.2942,2.2942,0,0,0-2.2875,2.2868h0A2.2939,2.2939,0,0,0,33.838,35.59H67.3556a2.2938,2.2938,0,0,0,2.2868-2.2875h0a2.2941,2.2941,0,0,0-2.2868-2.2868h-9.508ZM43.9426,60.6523c-0.8815,0-1.5868-.3957-1.5868-0.89V45.9838c0-.4947.7053-0.8907,1.5868-0.8907s1.587,0.396,1.587.8907v13.778c0,0.4947-.7053.89-1.587,0.89h0Zm6.6539,0c-0.8817,0-1.587-.3957-1.587-0.89V45.9838c0-.4947.7053-0.8907,1.587-0.8907s1.5868,0.396,1.5868.8907v13.778c0,0.4947-.7053.89-1.5868,0.89h0Zm6.6551,0c-0.8817,0-1.587-.3957-1.587-0.89V45.9838c0-.4947.7053-0.8907,1.587-0.8907s1.5868,0.396,1.5868.8907v13.778C58.8383,60.2565,58.133,60.6523,57.2515,60.6523Z" transform="translate(-31.5505 -26.5819)"/></svg></a></div> ' +
		'<input type="hidden" name="PRODUCT[ID]" value="${MID}"/> ' +
		'</li>';
	
		
	$.template( "checkoutbasketTemplate", checkoutbasketTemplate );
	$.tmpl( 'checkoutbasketTemplate', data.BasketElements ).prependTo('.order-content');
	setTimeout(function(){
		checkoutamount();
	}, 500);
	var resultids = [];
	var resultamounts = [];
	$('[name="PRODUCT[ID]"]').each(function(index){
		resultids.push($(this).val());
	});
	$('.buttons .amount').each(function(index){
		resultamounts.push($(this).text());
	});
	$('[name="IDS"]').val(resultids);
	$('[name="AMOUNTS"]').val(resultamounts);
	checkoutprice(data);
	renderSummary(data);
	$('[name="ORDER[PERSONS]"]').val('');
	$('[name="ORDER[PERSONS]"]').val(data.PersonCount);
	};
};  

$(document).ready(function(){
	var $form = $('#checkout-form');
	var $basket_item = $('.basket-item .change-person-btn').closest('.basket-item');
	$.ajax({
		type: 'post',
		data: $form.serialize(),
		dataType: "json",
		url: '/bd/checkout/?validatedelivery',
		success: function(data){
			console.log(data);
				$basket_item.find('.buttons').find('input[type="hidden"]').val(data.PersonCount);
				$basket_item.find('.buttons').find('.personamount').text(data.PersonCount)
		}
	}); 
	$('.basket-item .change-person-btn').on('click',function(e){
		e.preventDefault();
		var $basket_item = $(this).closest('.basket-item');
		var current_val = $basket_item.find('.buttons').find('input[type="hidden"]').val();
		var new_val = parseInt(current_val);
		if($(this).hasClass('plus')){
			if (new_val < 1) new_val= 1;
			new_val++
			$basket_item.find('.buttons').find('input[type="hidden"]').val(new_val);
			$basket_item.find('.buttons').find('.personamount').text(new_val)
		}else{
			new_val--
			if(new_val<=0){
			new_val = 1;
		}
			$basket_item.find('.buttons').find('input[type="hidden"]').val(new_val);
			$basket_item.find('.buttons').find('.personamount').text(new_val)
		}
		var $form = $('#checkout-form');
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/bd/checkout/?validatedelivery',
			success: function(data){
				console.log(data);
				$basket_item.find('.buttons').find('input[type="hidden"]').val(data.PersonCount);
				$basket_item.find('.buttons').find('.personamount').text(data.PersonCount)
			}
		});
	});
});

function checkoutamount(){
	// $('.basket-item .change-amount-btn').on('click',function(e){
	// 	e.preventDefault();
	// 	var $basket_item = $(this).closest('.basket-item');
	// 	var current_val = $basket_item.find('.buttons').find('input[type="hidden"]').val();
	// 	var new_val = parseInt(current_val);
	// 	var product_id = $basket_item.data('id');
	// 	var price = parseInt($basket_item.data('price'));
	// 	if($(this).hasClass('plus')){
	// 		new_val++;
	// 	}else{
	// 		new_val--;
	// 	}
	// 	if(new_val==0){
	// 		new_val = 1;
	// 		$(this).tooltip({trigger: 'hover', title: 'Если вы хотите удалить позицию, воспользуйтесь кнопкой справа', delay: {hide: 3000}})
	// 		$(this).tooltip('show');
	// 		setTimeout(function() {
	// 		$('.tooltip').remove();
	// 		}, 3000);
	// 	}else{
	// 	$(this).closest('.basket-item').find('.amount').text(new_val)

	// 	$('[name="AMOUNTS"]').val('');
	// 	var resultamounts = [];
	// 	$('.buttons .amount').each(function(index){
	// 	resultamounts.push($(this).text());
	// 	});
	// 	$('[name="AMOUNTS"]').val(resultamounts);
	// 	var $form = $('#checkout-form');
	// 	$.ajax({
	// 		type: 'post',
	// 		data: $form.serialize(),
	// 		dataType: "json",
	// 		url: '/bd/checkout/?validatedelivery',
	// 		success: function(data){
	// 			$('[name="IDS"]').val('');
	// 			$('[name="AMOUNTS"]').val('');
	// 			$('.order-content li:not(.person)').remove();
	// 			checkoutbasket(data);
	// 		}
	// 	});
	// 	}
	// 	return false;
	// });
	$('.remove-basket-item a').off().on('click',function(e){

		if($('.constructor-view').is(':visible')){
			$('.constructor-view .close-view').trigger('click');
		}
		e.preventDefault();
		var $basket_item = $(this).closest('.basket-item');
		var product_id = $basket_item.attr('data-id');
		if (window.yaCounter != undefined && window.yaCounter != null) {
			window.dataLayer.push({
				"ecommerce": {
					"remove": {
						"products": [
							{
								"id": product_id,
								"name": $basket_item.find('.name').text(),
								"price": $basket_item.attr('data-price'),
								"quantity": $basket_item.find('.amount').text()
							}
						]
					}
				}
			});

		}
		if(product_id=='gift' && $('.get-another-gift-btn').length){
			$('.product.gift').removeClass('active');
		}

		$('.product[data-id="'+$basket_item.attr('data-pid')+'"]').find('.add-to-cart-btn').removeClass('retry').text('В корзину');
		var new_val = '0';
		$(this).closest('.basket-item').find('.amount').text(new_val)
		$('[name="AMOUNTS"]').val('');
		var resultamounts = [];
		$('.buttons .amount').each(function(index){
		resultamounts.push($(this).text());
		});
		$('[name="AMOUNTS"]').val(resultamounts);
		var $form = $('#checkout-form');
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/bd/checkout/?validatedelivery',
			success: function(data){
				$('[name="IDS"]').val('');
				$('[name="AMOUNTS"]').val('');
				$('.order-content li:not(.person)').remove();
				checkoutbasket(data);
			}
		});
		return false;
	});
};

function checkoutuser(data){
	console.log(data);
	$('.value span').first().text(User.Bonuses);
};

function placemark(){
	
	$(document).on('click','#pickup',function(){
			$('.map-row').show();
			var val = $(this).val();
			var coordx = parseFloat($(this).data('x'));
			var coordy = parseFloat($(this).data('y'));
			var adress = $(this).data('adress');
			var placemark = [];
			placemark[val] = new ymaps.Placemark([coordx,coordy], {
			hintContent: adress,
			balloonContent: 'Адрес: '+adress+' <br /> Телефон: +7 473 229 58 54 <br /> Электронная почта: admin@anti-sushi.ru <br /> Режим работы: Работаем до с 10 утра до 2 ночи'
			});
			myMap.geoObjects.add(placemark[val]);
			myMap.setCenter(placemark[val].geometry.getCoordinates(), 16, {duration: 1000})
	})
	
};

$(document).ready(function(){
	if (window.location.pathname == '/checkout/'){
	
	var $form = $('#checkout-form');
	
	$('.value span').first().text(User.Bonuses);
	
	$(document).on('change','[name="ORDER[PROMO]"]',function(){
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/bd/checkout/?validatedelivery',
			success: function (data) {
				console.log(data);
			}
		});
	});
		
	$('input[name="ORDER[TOWN]"]').val('');
	$('input[name="ORDER[TOWNID]"]').val('');
	$.ajax({
		url: '/bd/?towns_awable',
		dataType: "json",
		success: function(data) {
			var town_data = $.map(data, function(item) {
				return {
					label: item.Name,
					value: item.Id
				};
			});
			var firsttown = data[0];
			var town = $('#town');
			town.val( town.val() + firsttown.Name );
			var townid = $('#townid');
			townid.val( townid.val() + firsttown.Id );
			streetstring(firsttown.Id);
		}   
	});
	
	$('#checkout-form').keydown(function(event){
		if(event.keyCode == 13) {
		  event.preventDefault();
		  return false;
	  }
	});
	
	$(document).on('change','[name="ORDER[DELIVERY_PICKUP_ID]"]',function(){
		console.log('3');
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/bd/checkout/?validatedelivery',
			success: function (data) {
				console.log(data);
			}
		});
	});
   

	$(document).on('change','[name="ORDER[TOWNID]"]',function(){
		if ($('[name="ORDER[TOWNID]"]').val() != ''){
			if ($('[name="ORDER[STREETID]"]').val() != ''){
				if ($('[name="ORDER[HOUSEID]"]').val() != ''){
					console.log('2');
					$.ajax({
						type: 'post',
						data: $form.serialize(),
						dataType: "json",
						url: '/bd/checkout/?validatedelivery',
						success: function (data) {
							console.log(data);
						}
					});
				}
			}   
		}
	});
		
	$(document).on('change','[name="ORDER[STREETID]"]',function(){
		if ($('[name="ORDER[TOWNID]"]').val() != ''){
			if ($('[name="ORDER[STREETID]"]').val() != ''){
				if ($('[name="ORDER[HOUSEID]"]').val() != ''){
					console.log('2');
					$.ajax({
						type: 'post',
						data: $form.serialize(),
						dataType: "json",
						url: '/bd/checkout/?validatedelivery',
						success: function (data) {
							console.log(data);
						}
					});
				}
			}   
		}
	});
	
	$(document).on('change','[name="ORDER[HOUSEID]"]',function(){
		if ($('[name="ORDER[TOWNID]"]').val() != ''){
			if ($('[name="ORDER[STREETID]"]').val() != ''){
				if ($('[name="ORDER[HOUSEID]"]').val() != ''){
					console.log('2');
					$.ajax({
						type: 'post',
						data: $form.serialize(),
						dataType: "json",
						url: '/bd/checkout/?validatedelivery',
						success: function (data) {
							console.log(data);
						}
					});
				}
			}   
		}
	});
	
	$(document).on('change','[name="ORDER[DISCOUNT_BONUSES]"]',function(){
		console.log('12');
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/bd/checkout/?validatedelivery',
			success: function (data) {
				console.log(data);
				$('.orderprice').text(number_format(data.TotalPrice, 0, '.', ' '));
			}
		});

	});
	
	};
	
	if ($('#townid').lenght > 0) {
		$('#street').prop('disabled', false);
	};
	$(document).on('change','#townid',function(){
		$('#streetid').val('');
		$('#street').val('');
		$('#houseid').val('');
		$('#house').val('');
		$('[name="ORDER[APARTMENT]"]').val('');
		$('[name="ORDER[PORCH]"]').val('');
		$('[name="ORDER[FLOOR]"]').val('');
		$('#street').prop('disabled', false);
	});
	$(document).on('change','#streetid',function(){
		$('#houseid').val('');
		$('#house').val('');
		$('[name="ORDER[APARTMENT]"]').val('');
		$('[name="ORDER[PORCH]"]').val('');
		$('[name="ORDER[FLOOR]"]').val('');
		$('#house').prop('disabled', false);
	});
	$(document).on('change','#housetid',function(){
		$('[name="ORDER[APARTMENT]"]').val('');
		$('[name="ORDER[PORCH]"]').val('');
		$('[name="ORDER[FLOOR]"]').val('');
	});
	
	$(document).on('click','#courier', function() {
	$(this).addClass('active');
	$('#pickup').removeClass('active');
	$('.delivery-type-tab-courier').show();
	$('.delivery-type-tab-pickup').hide();
	$('[name="ORDER[DELIVERY_TYPE]"]').val('courier');
  });
  $(document).on('click','#pickup', function() {
	$(this).addClass('active');
	$('#courier').removeClass('active');
	$('.delivery-type-tab-courier').hide();
	$('.delivery-type-tab-pickup').show();
	$('#delivery-type').val('pickup');
	});
	
	$(document).on('focusout','#namefield',function(){
		if ($('[name="ORDER[USER_NAME]"]').val() == ''){
			$('[name="ORDER[USER_NAME]"]').parent().addClass('error shake');
			$('[name="ORDER[USER_NAME]"]').parent().find('.help-block').show();
		}else{
			$('[name="ORDER[USER_NAME]"]').parent().removeClass('error shake');
			$('[name="ORDER[USER_NAME]"]').parent().find('.help-block').hide();
		}
		if ($('#phone').val() == ''){
			$('#phone').parent().addClass('error shake');
			$('#phone').parent().find('.help-block').text('Необходимо заполнить это поле!');
			$('#phone').parent().find('.help-block').show();
		}else{
			$('#phone').unmask();
			if ($('#phone').val().length < 10){
				$("#phone").mask("+7(999) 999-99-99");
				$('#phone').parent().addClass('error shake');
				$('#phone').parent().find('.help-block').text('Проверьте номер!');
				$('#phone').parent().find('.help-block').show();
			}else{
			$('#phone').parent().removeClass('error shake');
			$('#phone').parent().find('.help-block').hide();
			$("#phone").mask("+7(999) 999-99-99");
			}
		}
	});
	
	$(document).on('focusout','.delivery-type-tab-courier',function(){
		if ($('#town').val() == ''){
			$('#town').parent().addClass('error shake');
			$('#town').parent().find('.help-block').show();
			$('.send-order').prop('disabled', true);
			$('.send-order').addClass('disabled');
		}else{
			$('#town').parent().removeClass('error shake');
			$('#town').parent().find('.help-block').hide();
			$('.send-order').prop('disabled', false);
			$('.send-order').removeClass('disabled');
		}
		if ($('#street').val() == ''){
			$('#street').parent().addClass('error shake');
			$('#street').parent().find('.help-block').show();
			$('.send-order').prop('disabled', true);
			$('.send-order').addClass('disabled');
		}else{
			$('#street').parent().removeClass('error shake');
			$('#street').parent().find('.help-block').hide();
			$('.send-order').prop('disabled', false);
			$('.send-order').removeClass('disabled');
		}
		if ($('#house').val() == ''){
			$('#house').parent().addClass('error shake');
			$('#house').parent().find('.help-block').show();
			$('.send-order').prop('disabled', true);
			$('.send-order').addClass('disabled');
		}else{
			$('#house').parent().removeClass('error shake');
			$('#house').parent().find('.help-block').hide();
			$('.send-order').prop('disabled', false);
			$('.send-order').removeClass('disabled');
		}
		if ($('#PRIVATE_HOUSE:checked').length > 0){
			$('[name="ORDER[APARTMENT]"]').parent().removeClass('error shake');
			$('[name="ORDER[APARTMENT]"]').parent().find('.help-block').hide();
			$('[name="ORDER[PORCH]"]').parent().removeClass('error shake');
			$('[name="ORDER[PORCH]"]').parent().find('.help-block').hide();
			$('[name="ORDER[FLOOR]"]').parent().removeClass('error shake');
			$('[name="ORDER[FLOOR]"]').parent().find('.help-block').hide();
		}else{
			if ($('[name="ORDER[APARTMENT]"]').val() == ''){
				$('[name="ORDER[APARTMENT]"]').parent().addClass('error shake');
				$('[name="ORDER[APARTMENT]"]').parent().find('.help-block').show();
			}else{
				$('[name="ORDER[APARTMENT]"]').parent().removeClass('error shake');
				$('[name="ORDER[APARTMENT]"]').parent().find('.help-block').hide();
			}
			if ($('[name="ORDER[PORCH]"]').val() == ''){
				$('[name="ORDER[PORCH]"]').parent().addClass('error shake');
				$('[name="ORDER[PORCH]"]').parent().find('.help-block').show();
			}else{
				$('[name="ORDER[PORCH]"]').parent().removeClass('error shake');
				$('[name="ORDER[PORCH]"]').parent().find('.help-block').hide();
			}
			if ($('[name="ORDER[FLOOR]"]').val() == ''){
				$('[name="ORDER[FLOOR]"]').parent().addClass('error shake');
				$('[name="ORDER[FLOOR]"]').parent().find('.help-block').show();
			}else{
				$('[name="ORDER[FLOOR]"]').parent().removeClass('error shake');
				$('[name="ORDER[FLOOR]"]').parent().find('.help-block').hide();
			}
		}
	});
	
	$(document).on('click','#PRIVATE_HOUSE',function(){
		if ($('#PRIVATE_HOUSE:checked').length > 0){
			$('[name="ORDER[APARTMENT]"]').parent().removeClass('error shake');
			$('[name="ORDER[APARTMENT]"]').parent().find('.help-block').hide();
			$('[name="ORDER[PORCH]"]').parent().removeClass('error shake');
			$('[name="ORDER[PORCH]"]').parent().find('.help-block').hide();
			$('[name="ORDER[FLOOR]"]').parent().removeClass('error shake');
			$('[name="ORDER[FLOOR]"]').parent().find('.help-block').hide();
		}
	});
	
	$(document).on('focusout','.bonuses-block',function(){
		var bonustotal = (User.Bonuses);
		var bonus = $('[name="ORDER[DISCOUNT_BONUSES]"]').val();
		var halfprice = Math.floor((Basket.BasketPrice)/3.33);
		if (bonus > bonustotal){
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().addClass('error shake');
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').text('У вас нет такого количества бонусов')
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').show();
			$('.send-order').prop('disabled', true);
			$('.send-order').addClass('disabled');
		}else{
			if (bonus > halfprice){
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().addClass('error shake');
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').text('Вы не можете использовать больше ' +halfprice+' бонусов')
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').show();
			$('.send-order').prop('disabled', true);
			$('.send-order').addClass('disabled');
			}else{
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().removeClass('error shake');
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').hide();
			$('.send-order').prop('disabled', false);
			$('.send-order').removeClass('disabled');
			}
		}
	});
	
//  $( document ).ajaxComplete(function( event, xhr, settings ) {
//      if ( settings.url === "/bd/checkout/?validatedelivery" ) {
			//console.log(xhr.responseText);
//      }
//  });
	
	$('.bd-input input,.bd-input textarea').off('focus').on('focus',function(){
	$("#phone").mask("+7(999) 999-99-99");
		var $cont = $(this).parents('.bd-input');
		if ($(this).attr('readonly') == undefined)
			$cont.addClass('focused').removeClass('error ok');
		;
		$cont.removeClass('filled');
		if($cont.closest('.input-row')){
			//$cont.closest('.input-row').css('margin-top',0);
		}
		if($cont.closest('.input-row-last')){
			//$cont.closest('.input-row-last').css('margin-top',0);
		}
	});
	$('.bd-input input,.bd-input textarea').off('blur').on('blur',function(){
		var $cont = $(this).parents('.bd-input');
		$cont.removeClass('focused');
		if($(this).val().trim().length>0){
			$cont.addClass('filled')
		}else{
			$cont.removeClass('filled');
		}
	});
	
	 $('.checkout-user-addresses').on('change',function(e){
		var $option = $(this).find('option:selected');
		if($option.data('town').toString().length)
			$('[name="ORDER[TOWN]"]').val($option.data('town')).parent().addClass('filled');

		if($option.data('street').toString().length)
			$('[name="ORDER[STREET]"]').val($option.data('street')).parent().addClass('filled');

		if($option.data('house').toString().length)
			$('[name="ORDER[HOUSE]"]').val($option.data('house')).parent().addClass('filled');

		if($option.data('apartment').toString().length)
			$('[name="ORDER[APARTMENT]"]').val($option.data('apartment')).parent().addClass('filled');

		if($option.data('porch').toString().length)
			$('[name="ORDER[PORCH]"]').val($option.data('porch')).parent().addClass('filled');

		if($option.data('floor').toString().length)
			$('[name="ORDER[FLOOR]"]').val($option.data('floor')).parent().addClass('filled');

		if($option.data('private').toString().length) {
			if($option.data('private') == "Y") {
				$('[name="PRIVATE_HOUSE"]').prop("checked", true).trigger("change");
			}else{
				$('[name="PRIVATE_HOUSE"]').prop("checked", false).trigger("change");
			}
		}
	});

	$('[name="custom_adress"]').on('change', function() {
   if(this.checked) {
	  $('.custom_address_config').show();
   }
   else {
	  $('.custom_address_config').hide();
   }
	});
	
	if($('[name="ORDER[PAYMENT_TYPE]"]').length){
		$('[name="ORDER[PAYMENT_TYPE]"]').on('change',function(){
			if($('[name="ORDER[PAYMENT_TYPE]"]').val()=='cash'){
				$('._change_row').show();
			}else{
				$('._change_row').hide();
			}   
		})
	}
	
	$('#checkout-form').on('submit',function(e){
		e = e.originalEvent;
		$("#phone").unmask();
		var $form = $(this);
		$('.send-order').prop('disabled', true);
		$('.send-order').addClass('disabled');
		setTimeout(function() {
		$('.send-order').prop('disabled', false);
		$('.send-order').removeClass('disabled');
		}, 3000);
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/bd/checkout/?validate',
			success: function (data) {
				if (data.status == 0) {
					$('body,html').animate({
						scrollTop: 0
					}, 400);
					$('.bd-input, .sod_select, .bd-select').removeClass('error shake');
					$.each(data.errors, function (i, item) {
						$('[name="ORDER[' + item + ']"]').parent().addClass('error shake');
						if (item == 'DELIVERY_PICKUP_ID') {
							$('[name="ORDER[' + item + ']"]').parents('.bd-select').addClass('error');
						}
						setTimeout(function () {
							$('[name="ORDER[' + item + ']"]').parent().removeClass('shake');
						}, 2000);
					})
					$('.send-order').prop('disabled', false);
				} else {
					$form[0].submit()
				}
			}
		});
		$("#phone").mask("+7(999) 999-99-99");
		e.preventDefault();
		return false;
	});
});

function townstring(){
	$.ajax({
		url: '/bd/?towns_awable',
		dataType: "json",
		success: function(data) {
			var town_data = $.map(data, function(item) {
				return {
					label: item.Name,
					value: item.Id
				};
			});
			var townid = $('#townid');
			$("#town").autocomplete({
				autoFocus: true,
				delay: 0,
				source: town_data,
				minLength: 2,
				select: function (event, ui) {
				this.value = ui.item.label;
				townid.val('');
				townid.val( townid.val() + ui.item.value);
				townid.change();
				event.preventDefault();
				streetstring(ui.item.value);
				},
				focus: function(event, ui) {
				event.preventDefault();
				},
				change: function (event, ui) {
				if (ui.item == null){
				$(this).val((ui.item ? ui.item.id : ""));
				}
				}
			});
		}
	});
};

function streetstring(data){
	$.ajax({
		type: 'post',
		dataType: "json",
		url: '/bd/?streets_awable',
		data: { TownID: data},
		success: function(data) {
			var street_data = $.map(data, function(item) {
				return {
					label: item.Name,
					value: item.Id
				};
			});
			var streetid = $('#streetid');
			$("#street").autocomplete({
				autoFocus: true,
				delay: 0,
				source: street_data,
				minLength: 2,
				select: function (event, ui) {
				this.value = ui.item.label;
				streetid.val('');
				streetid.val( streetid.val() + ui.item.value);
				streetid.change();
				event.preventDefault();
				housestring(ui.item.value);
				},
				focus: function(event, ui) {
				event.preventDefault();
				},
				change: function (event, ui) {
				if (ui.item == null){
				$(this).val((ui.item ? ui.item.id : ""));
				}
				}
			});
		}
	});
};  
	
function housestring(data){
	$.ajax({
		type: 'post',
		dataType: "json",
		url: '/bd/?house_awable',
		data: { StreetID: data},
		success: function(data) {
			var house_data = $.map(data, function(item) {
				return {
					label: item.Name,
					value: item.Id
				};
			});
			var houseid = $('#houseid');
			$("#house").autocomplete({
				autoFocus: true,
				delay: 0,
				source: house_data,
				minLength: 0,
				select: function (event, ui) {
				this.value = ui.item.label;
				houseid.val('');
				houseid.val( houseid.val() + ui.item.value);
				houseid.change();
				event.preventDefault();
				housecoord(ui.item.value);
				},
				focus: function(event, ui) {
				event.preventDefault();
				},
				change: function (event, ui) {
				if (ui.item == null){
				$(this).val((ui.item ? ui.item.id : ""));
				}
				}
			});
		}
	});
};

function housecoord(data){
	
};

function checkoutprice(data){
	$('.orderprice').text(number_format(data.TotalPrice, 0, '.', ' '));
	$('.basketsum').text(number_format(data.BasketPrice, 0, '.', ' '));
	if (data.AddingBonus != 0){
		$('.user-bonus-append').show();
		$('.addbonus').text(number_format(data.AddingBonus, 0, '.', ' '));
	};
};


$(function(){
	if (window.location.pathname == '/checkout/'){
	
	$( document ).ajaxComplete(function( event, xhr, settings ) {
		if ( settings.url === "/bd/checkout/?validatedelivery" ) {
			//console.log(xhr.responseText);
		}
	});
		
//  if($('[name="custom_adress"]').is(':checked')){    //.prop('checked', true).trigger('change')){
//      $('.custom_address_config').show();
//  }else{
//      $('.custom_address_config').hide();
//  }
	
	}
});

// checkouttime

$(function(){
	
	var $form = $('#checkout-form');
	
	 if($('.delivery-time-type_').length){
		$('#type_1').on('change',function(e){
		  
		  if($(this).prop('checked')){
			//$('.delivery-time-type_').addClass('nopadl');
			$('[name="ORDER[DELIVERY_TIME_TYPE]"]').val('current');
			$('.delivery-time-type_').addClass('current_')
			$('.hour-select-cont').hide();
			console.log('5');
			$.ajax({
				type: 'post',
				data: $form.serialize(),
				dataType: "json",
				url: '/bd/checkout/?validatedelivery',
				success: function (data) {
					console.log(data);
				}
			});         
		  }else{
			//$('.delivery-time-type_').removeClass('nopadl');
			$('[name="ORDER[DELIVERY_TIME_TYPE]"]').val('exacttime');
			$('.delivery-time-type_').removeClass('current_')
			$('.hour-select-cont').show();
			//$('select[name="ORDER[HOUR]"]').val(window.currentHour).trigger('change');
			$('select[name="ORDER[HOUR]"]').prop('selectedIndex', -1);//.val('');//.trigger('change');
			//$('select[name="ORDER[HOUR]"]').parent().find('.sod_option[data-value="'+window.currentHour+'"]').trigger('click');

			
			$('select[name="ORDER[MINUTE]"]').prop('selectedIndex', -1);//.val('');//.trigger('change');
			//$('select[name="ORDER[MINUTE]"]').parent().find('.sod_option[data-value="00"]').trigger('click')

		  }
		  //$('[name="ORDER[DELIVERY_DATE]"]').trigger('change')
		  $('[name="ORDER[DELIVERY_DATE]"]').prop('selectedIndex', -1);//.val('');
		})
	}
	
		
	$(document).on('change','#selecthour',function(){
		if (!$('[name="ORDER[HOUR]"]').val() == ''){
			if (!$('[name="ORDER[MINUTE]"]').val() == ''){
				if (!$('[name="ORDER[DELIVERY_DATE]"]').val() == ''){
					console.log('7');
					$.ajax({
						type: 'post',
						data: $form.serialize(),
						dataType: "json",
						url: '/bd/checkout/?validatedelivery',
						success: function (data) {
							console.log(data);
						}
					});
				}
			}
		}
	});
	
	$(document).on('change','[name="ORDER[MINUTE]"]',function(){
		if (!$('[name="ORDER[HOUR]"]').val() == ''){
			if (!$('[name="ORDER[MINUTE]"]').val() == ''){
				if (!$('[name="ORDER[DELIVERY_DATE]"]').val() == ''){
					console.log('7');
					$.ajax({
						type: 'post',
						data: $form.serialize(),
						dataType: "json",
						url: '/bd/checkout/?validatedelivery',
						success: function (data) {
							console.log(data);
						}
					});
				}
			}
		}
	});
	
	$(document).on('change','[name="ORDER[DELIVERY_DATE]"]',function(){
		if (!$('[name="ORDER[HOUR]"]').val() == ''){
			if (!$('[name="ORDER[MINUTE]"]').val() == ''){
				if (!$('[name="ORDER[DELIVERY_DATE]"]').val() == ''){
					console.log('7');
					$.ajax({
						type: 'post',
						data: $form.serialize(),
						dataType: "json",
						url: '/bd/checkout/?validatedelivery',
						success: function (data) {
							console.log(data);
						}
					});
				}
			}
		}
	});
	
	var resulthours = [];                      
	var nowHour = new Date().getHours();
	for(var i = nowHour; i <= 23; i++){
		if (i > 11){
		resulthours.push(i/24+i%24);
		}
	};
	for(var i = 0; i <= 2; i++){
		resulthours.push(i/24+i%24);
	};
	$('#selecthour').empty();
	$.each(resulthours, function(i, p) {
			$('#selecthour').append($('<option></option>').val(Math.floor(p)).html(Math.floor(p)));
	});
	
	var minutes = [00,15,30,45]

	$('#selectminutes').empty();
	$.each(minutes, function(i, p) {
	$('#selectminutes').append($('<option></option>').val(p).html(p));
	});
	
	const monthNames = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
	var resultdates = [];
	var dates = [];
	var months = [];
	
	for(i = 0; i <= 3; i++){
		var d = new Date();
		var nowmonth = monthNames[d.getMonth()];
		d.setDate(d.getDate() + i);
		resultdates.push(d.getDate()+' '+nowmonth);
		dates.push(d.getDate());
		months.push(d.getMonth());      
	};
	
	$('#selectdate').empty();
	$.each(resultdates, function(i, p) {
		$('#selectdate').append($('<option data-date="" data-month=""></option>').val(i).html(p));
	}); 
	$.each(dates, function(i, p) {
		$('#selectdate option[value='+i+']').attr('data-date', p);      
	});
	$.each(months, function(i, p) {
		$('#selectdate option[value='+i+']').attr('data-month', p);     
	});
	
	if ($('#selectdate').val()){
		$('[name="ORDER[DATE]"]').val($('#selectdate :selected').data('date'));
		$(document).on('click','#selectdate',function(e){
			$('[name="ORDER[DATE]"]').val($('#selectdate :selected').data('date'));
		});
	}
	if ($('#selectdate').val()){
		$('[name="ORDER[MONTH]"]').val($('#selectdate :selected').data('month'));
		$(document).on('click','#selectdate',function(e){
			$('[name="ORDER[MONTH]"]').val($('#selectdate :selected').data('month'));
		});
	}
});


// filter
$(document).ready(function(){
if($('.filter-params').length){
		$('.param-item .icon-param,.param-item span').on('click',function(e){
			e.preventDefault();
			var $parent = $(this).parent();
			var $param = $(this).closest('.param-item');
			var $form = $('#ingridients-filter form');
			if(!$(this).hasClass('selected')){
				$param.find('.icon-param').removeClass('selected');
				$(this).addClass('selected');
				$param.find('input[type="hidden"]').val('Y');
				if($(this)[0].tagName=='SPAN'){
					$param.find('.add_param').addClass('selected');
				}
				if($(this).hasClass('remove-param')){
					$param.find('input[type="hidden"]').val('E');
					$param.find('span').removeClass('checked');
					$param.find('span').addClass('unchecked');
				}else{
					$param.find('input[type="hidden"]').val('Y');
					$param.find('span').removeClass('unchecked');
					$param.find('span').addClass('checked');
				}
			}else{
				$param.find('input[type="hidden"]').val('N');
				$(this).removeClass('selected');
				if($(this)[0].tagName=='SPAN'){
					$param.find('.add_param').removeClass('selected');
				}
				$param.find('span').removeClass('unchecked');
				$param.find('span').removeClass('checked');
			}
			smartFilter.click($param.find('input[type="hidden"]')[0]);
			return false;
		});
		$('.apply-filter').on('click',function(e){
		   $('.clear-filter-btn').show();
		   $('.ingridients-filter-btn').addClass('active');
		});
		$('.clear-filter-btn,.clear-filter').on('click',function(e){
			$('.clear-filter-btn').hide();
			$('.ingridients-filter-btn').removeClass('active');
			$('.icon-param').removeClass('selected');
			$('.unchecked').removeClass('unchecked');
			$('.checked').removeClass('checked');
		});
	}
});
