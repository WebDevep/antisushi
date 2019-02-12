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

// basket

function renderBasket(){
	$(".products-list.scroll-content").html('');
	$('.basket-items-col .spinner').show();
	var url = window.location.href;
	$.ajax({
		type: 'post',
		dataType: "json",
		url: '/bd/basket/?getBasket',
		data: {'url': url, 'Session': Session},
		success: renderBasketItems
	});
}

function renderBasketItems(data){
	if(data.TotalPrice){
		animateNumbers($('.basket-actions .bonuses-info span').first(),data.TotalPrice);
		animateNumbers($('.checkout-footer .bonuses-info span').first(),data.AddingBonus);
	}
//    if(data.promo || data.discount){
//        if(data.discount !== undefined && data.discount!==null && data.discount!==0){
//            $('.basket-actions .order-discount span').first().parent().show();
//            animateNumbers($('.basket-actions .order-discount span').first(),data.discount);
//            animateNumbers($('.checkout-footer .order-discount span').first(),data.discount);
//            $('.checkout-footer .order-discount span').first().parent().show();
//            $('.basket-actions .order-total').find('.summary-label').hide();
//            $('.checkout-footer .order-total').find('.summary-label').hide();
//
//            $('.ot-cont').addClass('with-promo');
//            $('.checkout-footer').addClass('with-promo');
//        }else{
//            $('.basket-actions .order-discount span').first().parent().hide();
//            $('.checkout-footer .order-total').find('.summary-label').show();
//            $('.basket-actions .order-total').find('.summary-label').show();
//
//            $('.ot-cont').removeClass('with-promo');
//            $('.checkout-footer').removeClass('with-promo');
//            $('.checkout-footer .order-discount').hide();
//            $('.basket-actions .order-discount').hide();
//        }
//        if(data.promo){
//            $('.basket-promo-code').val(data.promo).parent().addClass('filled ok');
//            $('.basket-promo-code').parent().find('.apply-code-btn').addClass('ok');
//        }else{
//            $('.basket-promo-code').val('').parent().removeClass('filled ok');
//            $('.basket-promo-code').parent().find('.apply-code-btn').removeClass('ok');
//        }
//    }else{
//        $('.checkout-footer .order-discount').hide();
//        $('.basket-actions .order-discount').hide();
//
//    }

	 var i = '<div class="basket-item row ${Type}"  data-pid="${MID}" data-id="${MID}" data-price="${ElementPrice}"> <div class="product-image-cont"> <div class="product-image"><img src="${PicUri}"><div class="${NoSale}" title="' +('На этот товар не действуют дополнительные скидки и акции') + '"></div></div> </div> <div class="name-cont"> <div class="name">${Name}</div> <div class="buttons"><a href="#" class="change-amount-btn minus">-</a><span class="amount">${Amount}</span> <input type="hidden" value="${Amount}"><a href="#" class="change-amount-btn plus">+</a> </div> </div> <div class="remove-basket-item"><span>&times;</span></div> <div class="price-block"><span class="product-sum font-fix"><span>${ElementPrice}</span><span class="currency">' + ('R') + '</span></span></div> </div> <div class="clearfix"></div><input type="hidden" name="PRODUCT[ID]" value="${MID}"/><input type="hidden" name="PRODUCT[AMOUNT]" value="${Amount}">';
	 $.template("basketTemplate", i);

	$(".basket .basket-view .products-list").html('');
	$.tmpl( "basketTemplate", data.BasketElements ).appendTo(".basket .basket-view .products-list");
	$('.basket-items-col .spinner').hide();
	setTimeout(function(){
		$('.basket-item .change-amount-btn').off().on('click',function(e){
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
			var url = window.location.href;
			$.ajax({
				type: 'post',
				data: {'PRODUCT_ID': product_id, 'AMOUNT': new_val, 'url': url, 'Session':Session},
				dataType: "json",
				 url: '/bd/basket/?changeAmount',
				success: function(data){
					var has_gift = false;
					$.each(data.products,function(i,item){
						if(item.MID=='gift'){
							has_gift = true;
						}
						$basket_item = $('.basket-item[data-id="'+item.MID+'"]');
						$basket_item.find('.buttons .amount').text(item.Amount);
						$basket_item.find('.buttons input[type="hidden"]').val(item.Amount);
						animateNumbers($basket_item.find('.product-sum span').first(),item.TotalPrice.replace(' ',''));
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
				}
			});
			}
			return false;
		});
		$('.remove-basket-item').off().on('click',function(e){
			if($('.constructor-view').is(':visible')){
				$('.constructor-view .close-view').trigger('click');
			}
			e.preventDefault();
			var $basket_item = $(this).closest('.basket-item');
			var product_id = $basket_item.attr('data-id');
			if(product_id=='gift' && $('.get-another-gift-btn').length){
				$('.get-another-gift-btn').trigger('click')
			}else{

				$('.product[data-id="'+$basket_item.attr('data-pid')+'"]').find('.add-to-cart-btn').removeClass('retry').text('В корзину');
				var new_val = '0';
				var url = window.location.href;
				$.ajax({
					type: 'post',
					data: {'PRODUCT_ID': product_id, 'AMOUNT': new_val, 'url': url, 'Session':Session},
					dataType: "json",
					url: '/bd/basket/?changeAmount',
					success: function(data){
						var has_gift = false;
						$.each(data.products,function(i,item) {
							if (item.INDEX == 'gift') {
								has_gift = true;
							}
							if(item.MID.indexOf('additional_')!==-1){
								$('.basket_item_is_additional[data-id="'+item.MID+'"] .buttons').find('.amount').text(item.Amount);
								$('.basket_item_is_additional[data-id="'+item.MID+'"] .buttons').find('input[type="hidden"]').val(item.Amount);
							}
						});


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
			}

			return false;
		});
		$('.basket-item .name,.basket-item .product-image').off().on('click',function(){

			if(!$(this).closest('.basket-item').hasClass('without_detail')){
				$(window).scrollTop(0);
				var id = $(this).closest('.basket-item').data('id');
				var url = window.location.href;
				$.ajax({
					type: 'post',
					data: {PRODUCT_ID: id, 'url': url, 'Session':Session},
					dataType: "json",
//                    url: '/bitrix/components/bd/basket/component.php?action=getBasketItemDetail',
					success: function(data){
						$('.basket-view .status-bar .title').html(data.NAME);
						$('.information-col .close-view').show();
						$('.information-col .apply-view').hide();
						$('.product-info-cont .constructor-view .product-image img').attr('src',data.PREVIEW_PICTURE_M.src);
						$('.product-info-cont .constructor-view .name').attr('data-id',id).html();
						if(data.TYPE=='native'){
							$('.product-info-cont .like-content span').text(data.LIKE_COUNTER);
							$('.basket-view.change-view .product-description').text(data.PREVIEW_TEXT);
							$('.product-info-cont .likes').attr('data-id',data.ID).show();
							if(data.isLiked==1){
								$('.product-info-cont .likes').addClass('liked');
							}else{
								$('.product-info-cont .likes').removeClass('liked');
							}
							$('.basket .change-view .product-options').html('');
							if(data.OPTIONS!=null){
								var ji = 0;
								$.each(data.BD_PROPS,function(key,item){
									var content = '<div class="options-row-select col-xl-'+parseInt(12/parseInt(data.BD_PROPS.length))+' col-lg-12"><select data-placeholder-option="true">';
									content += '<option value="null">'+data.OPTIONS_NAME[ji+1]+'</option>';
									$.each(item,function(skey,sitem){
										var selected = '';
										if(ji==0 && skey==parseInt(data.OPTIONS.OPTION_1)){
											selected = 'selected="selected"';
										}
										if(ji==1 && skey==parseInt(data.OPTIONS.OPTION_2)){
											selected = 'selected="selected"';
										}
										content+= '<option '+selected+' value="'+skey+'" data-price="'+sitem.PRICE+'" data-old-price="'+sitem.OLD_PRICE+'" data-weight="'+sitem.WEIGHT+'">'+sitem.VALUE+'</option>';
									});
									content +="</select></div>";
									$('.basket .change-view .product-options').append(content);
									ji++;
								});
								$('.change-view .product-actions').show();
							}else{
								$('.change-view .product-actions').hide();
							}
							$('.basket .basket-view.change-view .apply-view').attr('disabled','disabled');
							$('.basket .change-view .product-options select').on('change',function(){
								$('.basket .basket-view.change-view .apply-view').removeAttr('disabled');
							}).selectOrDie();
							$('.basket .change-view .product-prices .weight').text(data.G);
							registerLikes();
							$('.product-info-cont .constructor-view .constructor-scroll-content').hide();
							$('.product-info-cont .constructor-view .product-scroll-content').show();
						}else{
							$('.basket-view .back').attr('onclick','backToBasket()')
							$('.product-detail-cont').show();
							$('.product-info-cont .likes').hide();
							$('.product-info-cont .constructor-content .ingredients_list_').html('');
							$('.product-info-cont .constructor-content .base_value_').text(data.BASE);
							$('.product-info-cont .constructor-content .souse_value_').text(data.SOUSE);
							$.each(data.INGREDIENTS,function(i,item){
								$('.product-info-cont .constructor-content .ingredients_list_').append('<div class="property-value">'+item+'</div>')
							})

							$('.product-info-cont .constructor-view .constructor-scroll-content').last().show();
							$('.change-view .product-actions').hide();
						}
						$('.product-info-cont').show();
						$('.basket-view.main-view').hide();
					}
				});
			}
		});
	}, 1000);
	renderSummary(data);
}

function backToBasket(){
   $('.basket-view').hide();
   $('.basket-view.main-view').show();
}

function registerLikes(){
	 if($('.likes').length){
		$('.likes').on('click',function(e){
			console.log('321');
			e.preventDefault();
			var $cont = $(this).closest('.preview');
			if($cont.length == 0){
				$cont = $(this);
			}
			if(window.user_id!=0){
				if($(this).hasClass('liked')){
					$(this).removeClass('liked');
				}else{
					$(this).addClass('liked');
				}
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
				data: {'PRODUCT_ID': product_id, 'IsLiked': isliked, 'url': url, 'Session':Session},
				dataType: "json",
				url: 'bd/?likeItem',
				success: function(data){
					$cont.find('.like-content span').text(data);
				}
			});
			return false;
		});
	}
}
function renderSummary(data){
	if(data.BasketElements.length == 0){
		$('.close-basket').hide();
		$('.basket-toggle svg').show();
		$('.basket-header-sum span').first().text(0).parent().hide();
		$('.basket-toggle').removeClass('active_')
		$('.basket.basket-p').hide();
		$('#page').show();
		$('.header .title img').show();
	} 
	var min_order = parseInt($('.min-order-progress').data('min-order'));
	if(data.TotalPrice>=min_order){
		if($('.send-order').length){
			//$('.send-order').removeAttr('disabled');
			$('.send-order').prop('disabled', false);
		}
		$('.min-order-progress').hide();
		$('.min-order-progress').find('.progress-bar').css('width','100%');
		$('#checkout-form .checkout-btn,.checkout-cont').css('display','block');;
	}else{
		//$('#checkout-form .send-order').attr('disabled','disabled');
		$('.send-order').prop('disabled', true);
		$('.min-order-progress').show();
		$('.min-order-progress').find('.progress-bar').css('width',parseInt(data.basket_sum_native/min_order*100)+'%');
		$('#checkout-form .checkout-btn,.checkout-cont').css('display','none');
	}

	if(data.BasketElements.length>0){
		if(data.TotalPrice == 0){
			$('.close-basket').hide();
			$('.basket-header-sum span').first().text(0).parent().hide();
			$('.basket-header-sum').hide();
			$('.basket-toggle').removeClass('active_')
			$('.basket.basket-p').hide();
			$('#page').show();
			$('.basket-toggle svg').show();
			$('.header .title img').show();
			// && data.discount!==null && data.discount!==undefined
//            if(!isNaN(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val()) + data.TotalPrice - window.prev_delta))
//                $('[name="ORDER[DISCOUNT_BONUSES]"]').val(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val()) + data.TotalPrice - window.prev_delta);
//
//            window.prev_delta = 0;
//            if(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val())+data.TotalPrice > min_order){
//                //$('.send-order').removeAttr('disabled');
//                $('.send-order').prop('disabled', false);
//            }
		}
		if(data.TotalPrice < 0){
			$('[name="ORDER[DISCOUNT_BONUSES]"]').val(parseInt($('[name="ORDER[DISCOUNT_BONUSES]"]').val()) + data.TotalPrice );
			window.prev_delta = data.TotalPrice;
			data.TotalPrice = 0;
			//$('.send-order').removeAttr('disabled');
			$('.send-order').prop('disabled', false);
		}
		if(parseInt(data.TotalPrice) > min_order){
			//$('.send-order').removeAttr('disabled');
			$('.send-order').prop('disabled', false);
		}

		animateNumbers($('.basket-header-sum span').first(),data.TotalPrice);
		
		if(!$('.basket').is(':visible') || $('.h-order-view').is(':visible')){
			$('.basket-header-sum').show();
			if(data.BasketElements.length>0){
				$('.basket-toggle').addClass('active_').find('svg').hide();
			}else{
				$('.basket-toggle').removeClass('active_').find('svg').show();
			}
		}
		animateNumbers($('.basket-actions .bonuses-info span').first(),data.TotalPrice);
		animateNumbers($('.checkout-footer .bonuses-info span').first(),data.AddingBonus);
		if(data.promo!==undefined && $('.bonuses-with-promo-disabled').length){
			$('.bonuses-with-promo-disabled').show();
			$('.checkout-footer .bonuses-info .default-text').hide();
			$('.basket-actions .bonuses-info .default-text').hide();
		}else{
			$('.bonuses-with-promo-disabled').hide();
			$('.checkout-footer .bonuses-info .default-text').show();
			$('.basket-actions .bonuses-info .default-text').show();
		}
		animateNumbers($('.not-empty-basket').find('.basket-sum span').first(),data.TotalPrice);
		animateNumbers($('.basket-actions .order-sum span').first(),data.TotalPrice);
		animateNumbers($('.checkout-footer .order-sum span').first(),data.TotalPrice);
		if(data.basket_sum_gift >= window.limit1){
			var basket_has_gift = false;
			for(prod in data.products){
				if(data.products[prod].MID=='gift'){
					basket_has_gift = true;
				}
			}

			$('.gift-progress').hide();

//            if(basket_has_gift==true){
//                $('.gift-progress-complete a').html(BX.message('get_another_gift')).parent().show().addClass('reuse');
//            }else{
//                $('.gift-progress-complete a').html(BX.message('get_gift')).parent().show().removeClass('reuse').addClass('use');
//            }
		}else{
			var percent = parseInt(data.basket_sum_gift/window.limit1*100);

			$('.gift-progress').show().find('.progress-bar').css('width',percent+'%');
			animateNumbers($('.gift-progress .sum-to-gift span').first(),window.limit1-data.basket_sum_gift);
			$('.gift-progress-complete').hide();
			$('.gift-progress').show();
		}
	}else{
		$('body').trigger('click');
		$('.basket-sum span').first().text(0);
		$('.basket-toggle').show();
		$('.basket-header-sum').hide()
	}

//    calcGifts(data.basket_sum_gift);
}

function registerProductListeners(){
	if(window.user_id == 0 && $('.likes').length > 0){
		$('.likes').addClass('guest-likes');
	}
	$('.basket .change-view .apply-view').off().on('click',function (e) {
		e.preventDefault();
		var options = {};
		if($('.basket .change-view  .product-options select').length==1){
			options.OPTION_1 = $('.basket .change-view  .product-options select').first().val();
		}
		if($('.basket .change-view  .product-options select').length==2){
			options.OPTION_1 = $('.basket .change-view  .product-options select').first().val();
			options.OPTION_2 = $('.basket .change-view  .product-options select').last().val();
		}
		var url = window.location.href;
		$.ajax({
			type: 'post',
			data: {'PRODUCT_ID': $('.basket .change-view  .name').attr('data-id'), 'OPTIONS': options, 'url': url, 'Session':Session},
			dataType: "json",
//            url: '/bitrix/components/bd/basket/component.php?action=updateOptions',
			success: function(data){
				$('.basket .basket-view.change-view').hide();
				renderBasket();
			}
		});
		return false;
	})
	$('.product select').off().on('change',function(){
		var $product = $(this).closest('.product');
		var $prices = $(this).closest('.product').find('.product-prices');
		var mode = 1;
		if($(this).closest('.options-row-select').hasClass('options-length-2')){
			mode = 2;
		}
		var new_price, new_old_price, new_weight;


		new_price = parseInt($product.find('select').first().find('option:selected').data('price'));
		new_old_price = parseInt($product.find('select').first().find('option:selected').data('old-price'));
		new_weight = parseInt($product.find('select').first().find('option:selected').data('weight'));

		if(mode==2){
			new_price += parseInt($product.find('select').last().find('option:selected').data('price'));
			if(!isNaN(parseInt($product.find('select').last().find('option:selected').data('old-price'))))
				new_old_price += parseInt($product.find('select').last().find('option:selected').data('old-price'));
			new_weight += parseInt($product.find('select').last().find('option:selected').data('weight'));
		}

		if(!isNaN(new_price)){
			$prices.find('.current-price span').first().text(number_format(new_price,0, '.', ' '));
		}
		if(!isNaN(new_old_price)){
			$product.find('.product-footer').removeClass('base-price');
			$prices.find('.old-price .line-through').text(number_format(new_old_price,0, '.', ' ')).parent().show();
		}else{
			$product.find('.product-footer').addClass('base-price');
			$prices.find('.old-price').hide();
		}

		if(!isNaN(new_weight)){
			$prices.find('.weight').find('span').first().text(new_weight);
		}
		$(this).selectOrDie('update');

	});
}

$(document).ready(function () {
	$('body').on('click','.product-energy > a',function(e) {
		e.preventDefault();
		$(this).toggleClass('pop-active');
		$(this).parent().find('.energy-value-content').slideToggle();
		return false;        
	})
	$('.product-actions .add-to-cart-btn').off().on('click',function(e){
		if($('.lic').length) return;
		if($(this).closest('.product-actions').hasClass('progress-complete')) return false;
//        if(window.yaCounter!=undefined && window.yaCounter != null){
//            yaCounter.reachGoal('add-to-basket',{});
//        }
 //       if(ga!=undefined){
 //           ga('send', 'event', 'basket', 'add');
 //       }
		e.preventDefault();
		var $self = $(this);
		var options = {};
		if($self.closest('.product').find('select').length == 1){
			options.OPTION_1 = $self.closest('.product').find('select').first().val();
		}
		if($self.closest('.product').find('select').length == 2){
			options.OPTION_1 = $self.closest('.product').find('select').first().val();
			options.OPTION_2 = $self.closest('.product').find('select').last().val();
		}
		var $prod = $self.closest('.product');
		var data = ('product');
		
		if(validateProperties($prod)){
			var cart = $('.basket-btn-container');
			var url = window.location.href;
			$.ajax({
				type: 'post',
				data: {'PRODUCT_ID': $self.data('id'),options:options, Action: data, 'url': url, 'Session':Session},
				dataType: "json",
				url: '/bd/basket/?addToBasket',
				success: function(data){
					renderBasket();
					renderSummary(data);
				}
			});
			$('.product[data-id="'+$self.data('id')+'"]').find('.add-to-cart-btn').addClass('retry').text('Добавить еще');
			if(!$self.hasClass('retry'))
				$self.addClass('retry').text('Добавить еще');
		}
		return false;
	});
});

function validateProperties(product){
	var valid = [];
	if(product.find('select').length){
		product.find('select').each(function (i, item) {
			if($(item).val()==null || ($(item).val().toString()=='null')){
				valid.push(false);
				$(item).closest('.sod_select').addClass('error_ shake');
				setTimeout(function(){
					$(item).closest('.sod_select').removeClass('shake');
				},1500);
			}else{
				valid.push(true)
				$(item).closest('.sod_select').removeClass('error_ shake');
			}
		});
	}else{
		valid.push(true)
	}

	if(valid.indexOf(false)!==-1){
		return false;
	}else{
		return true;
	}
}

// slider

$(document).ready(function () {
	if($('.carousel').length){
		var $carousel = $('.carousel').flickity({
			cellAlign: 'center',
			contain: true,
			autoPlay: 3000,
			percentPosition: false,	
			prevNextButtons: false,
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

// menu


function openMainProfileNav(){
	var api = $("#menu").data("mmenu");
	api.close();
	$('#page').hide();
	$('.profile-view.main-view').show().css('margin-top','50px');
	$('.header a.mainmenu').removeClass('opened').html('');
	$('.header .title img').show();
//    $('.header .title span').text('ls').show();
}

$(document).ready(function () {

	$("#menu").mmenu({
		transitionDuration: 0,
			extensions: ["theme-white",  "effect-listitems-slide",  "border-offset"],
			navbars: [{
				height: 3,
				content: [
					window.top_navbar
				]
			}, true]
		}, {});
		
	
	
	var api = $("#menu").data("mmenu");
	api.bind("openPanel", function ($panel) {
		if($panel.attr("id")=='catalog-panel' || $panel.hasClass('mm-vertical')){
			$('body').addClass('catalog-opened');
		}else{
			$('body').removeClass('catalog-opened');
		}
	});
	
	
	$('.header a.mainmenu').on('click',function(e){
	   if($("#menu").hasClass('mm-opened')){
		   $('.mm-panels').hide();
		   api.close();
		   $('.header a.mainmenu').removeClass('opened').html('');
		   $('.header .title img').show();
		   $('.header .title span').hide();

		   $('.header .title span').text(window.default_title).hide();
	   }else{
		   $('.mm-panels').show();
		   api.open();
		   $('.header a.mainmenu').addClass('opened').html('&times;');
		   $('.header .title img').show();
//           $('.header .title span').text('js_menu').hide();
			if($('.basket').is(':visible')){
				$('.basket-toggle').trigger('click');
			}
	   }
	});
});

// data-section

$(function () {
	
	$('.main-tabs li:not(.catalog) a').on('click',function(e){
		e.preventDefault();
		$('.product-list').hide();
		$('.product-list[data-section="'+$(this).attr('data-section')+'"]').show();
		window.location.hash = '#section-'+$(this).attr('data-section');
		$(this).closest('ul').find('li').removeClass('active');
		$(this).parent().addClass('active');

		return false;
	});
});		

// product detail

$(function() {
	$('.product-image').on('click',function(e){
		e.preventDefault();
//		var W = $(window).width();
//		var H = $(window).height()
//		console.log(W);
//		console.log(H);
//		if ($(window).width()>$(window).height){
//			$(this).css({ width: 400+'px'});
//		}else{
//			$(this).css({ height: 400+'px'});
//		}
		var clickId = $(this).parents('.product').attr('id');
		$(this).parents('.product').find('.product-energy').toggle();
//		$(this).parents('.product').find('.preview-text').toggle();
//		$(this).parents('.product').find('.detail-text').toggle();
		return false;
	});
	
	
	registerLikes();
});

// basket-toggle

$(function() {
	var api = $("#menu").data("mmenu");
	api.bind("openPanel", function ($panel) {
		if($panel.attr("id")=='catalog-panel' || $panel.hasClass('mm-vertical')){
			$('body').addClass('catalog-opened');
		}else{
			$('body').removeClass('catalog-opened');
		}
	});
	$('.basket-toggle').on('click',function(e){
		if (window.location.pathname == '/checkout/'){
			$('.header a.mainmenu').removeClass('opened').text('')
			$('.header .title img').show();
			e.preventDefault();
			api.close();
			$(window).scrollTop(0)
			if(parseInt($('.basket-header-sum span').first().text())!==0){
				if(!$('.checkoutbasket-view').is(':visible') && $(this).hasClass('active_')){
					$('.header .title img').show();
					$('.basket-header-sum').show();
					getCheckoutView('checkoutbasket')
				}else{
					$('.header .title img').show();
					$('.basket-header-sum').show();
					getCheckoutView('main')
				}
			}
		}else{
			$('.header a.mainmenu').removeClass('opened').text('')
			$('.header .title img').show();
			e.preventDefault();
			api.close();
			$(window).scrollTop(0);
			if(parseInt($('.basket-header-sum span').first().text())!==0){
				if(!$('.basket.basket-p').is(':visible') && $(this).hasClass('active_')){
					backToBasket();
					$('.header .title img').show();
					$('.basket-header-sum').hide();
					$('.close-basket').show();
					$('.basket-toggle').removeClass('active_');
					$('.basket').show();
					$('#page').hide();
				}else{
					$('.header .title img').show();
					$('.basket-toggle').addClass('active_');
					$('.basket-header-sum').show();
					$('.close-basket').hide();
					$('.basket.basket-p').hide();
					$('#page').show();
				}
			}
		}
	});
});


// catalog-toggle

$(function () {
	$('.sub-categories-toggle').on('click', function(e) {
	e.preventDefault();
  var $li = $(this).closest('li');
  if ($li.hasClass('opened')) {
	$li.removeClass('opened');
	$li.find('ul').slideUp();
  } else {
	$li.addClass('opened');
	$li.find('ul').slideDown();
  }
  return false;
});
});

// cabinet

$(document).ready(function(){
	hashlink();
});

function hashlink(){
	var h = location.hash;
	console.log(h);	
	if(h == "#orders") {
		$('#cabinetmenu').hide();
		$('#profile').hide();
		$('#bonusprogram').hide();
		$('#orderhistory').show();
	}
	if(h == "#bonuses") {
		$('#cabinetmenu').hide();
		$('#profile').hide();
		$('#bonusprogram').show();
		$('#orderhistory').hide();
	}
	if(h == "#profile") {
		$('#cabinetmenu').hide();
		$('#profile').show();
		$('#bonusprogram').hide();
		$('#orderhistory').hide();
	}
	if(h == "#like"){
		$('.products-sub-menu-main a.likelink').click();
	}
}

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

$(document).ready(function(){
	if ($('.composition').length > 0) {
		$('.composition__item').each(function(){
			var roll_id = $(this).attr('data-roll-id');
			$(this).click(function(e){
				e.preventDefault();
				$('.composition__item__popover').hide();
				if ($(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').hasClass('show')) {
					$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').hide();
					$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').removeClass('show');
				} else {
					$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').show();
					$('.composition__item__popover').removeClass('show');
					$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').addClass('show');
				}

			});
			$(this).on('mouseenter', function(e){
				$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').show();
			});
			$(this).on('mouseleave', function(e){
				$(this).parents('.product-description').find('.composition__item__popover[data-roll-id="'+roll_id+'"]').hide();
			});
		});
	}
});

$(document).ready(function(){
	$('.main-last-container').hide();
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

function renderCheckout(data){
	$('[name="IDS"]').val('');
	$('[name="AMOUNTS"]').val('');
	var resultids = [];
	var resultamounts = [];
	$(data.BasketElements).each(function(i,item){
		resultids.push(item.MID);
		resultamounts.push(item.Amount);
	});
	$('[name="IDS"]').val(resultids);
	$('[name="AMOUNTS"]').val(resultamounts);
}

function checkoutbasket(data){
	if(data.TotalPrice){
		animateNumbers($('.basket-actions .bonuses-info span').first(),data.TotalPrice);
		animateNumbers($('.checkout-footer .bonuses-info span').first(),data.AddingBonus);
	}
	 var i = '<div class="basket-item row ${Type}"  data-pid="${MID}" data-id="${MID}" data-price="${ElementPrice}"> <div class="product-image-cont"> <div class="product-image"><img src="${PicUri}"><div class="${NoSale}" title="' +('На этот товар не действуют дополнительные скидки и акции') + '"></div></div> </div> <div class="name-cont"> <div class="name">${Name}</div> <div class="buttons"><a href="#" class="change-amount-btn minus">-</a><span class="amount">${Amount}</span> <input type="hidden" value="${Amount}"><a href="#" class="change-amount-btn plus">+</a> </div> </div> <div class="remove-basket-item"><span>&times;</span></div> <div class="price-block"><span class="product-sum font-fix"><span>${ElementPrice}</span><span class="currency">' + ('R') + '</span></span></div> </div> <div class="clearfix"></div><input type="hidden" name="PRODUCT[ID]" value="${MID}"/><input type="hidden" name="PRODUCT[AMOUNT]" value="${Amount}">';
	 $.template("basketTemplate", i);

	$(".checkoutbasket-view .products-list").html('');
	$.tmpl( "basketTemplate", data.BasketElements ).appendTo(".checkoutbasket-view .products-list");
	//$('.basket-items-col .spinner').hide();

	setTimeout(function(){
		$('.basket-item .change-amount-btn').off().on('click',function(e){
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
			var url = window.location.href;
			$.ajax({
				type: 'post',
				data: {'PRODUCT_ID': product_id, 'AMOUNT': new_val, 'url': url, 'Session':Session},
				dataType: "json",
				 url: '/bd/basket/?changeAmount',
				success: function(data){
					var has_gift = false;
					$.each(data.products,function(i,item){
						if(item.MID=='gift'){
							has_gift = true;
						}
						$basket_item = $('.basket-item[data-id="'+item.MID+'"]');
						$basket_item.find('.buttons .amount').text(item.Amount);
						$basket_item.find('.buttons input[type="hidden"]').val(item.Amount);
						animateNumbers($basket_item.find('.product-sum span').first(),item.TotalPrice.replace(' ',''));
					});
					var $gift_item = $('.basket-item[data-id="gift"]');
					if($gift_item.length>0 && !has_gift){
						$gift_item.remove();
						if($('.get-another-gift-btn').length){
							$('.get-another-gift-btn').trigger('click')
						}
					}
					
					checkoutbasket(data);
					renderCheckout(data);
					var $form = $('#checkout-form');
					console.log('1');
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
			});
			}
			return false;
		});
		$('.remove-basket-item').off().on('click',function(e){
			if($('.constructor-view').is(':visible')){
				$('.constructor-view .close-view').trigger('click');
			}
			e.preventDefault();
			var $basket_item = $(this).closest('.basket-item');
			var product_id = $basket_item.attr('data-id');
			if(product_id=='gift' && $('.get-another-gift-btn').length){
				$('.get-another-gift-btn').trigger('click')
			}else{

				$('.product[data-id="'+$basket_item.attr('data-pid')+'"]').find('.add-to-cart-btn').removeClass('retry').text('В корзину');
				var new_val = '0';
				var url = window.location.href;
				$.ajax({
					type: 'post',
					data: {'PRODUCT_ID': product_id, 'AMOUNT': new_val, 'url': url, 'Session':Session},
					dataType: "json",
					url: '/bd/basket/?changeAmount',
					success: function(data){
						var has_gift = false;
						$.each(data.products,function(i,item) {
							if (item.INDEX == 'gift') {
								has_gift = true;
							}
							if(item.MID.indexOf('additional_')!==-1){
								$('.basket_item_is_additional[data-id="'+item.MID+'"] .buttons').find('.amount').text(item.Amount);
								$('.basket_item_is_additional[data-id="'+item.MID+'"] .buttons').find('input[type="hidden"]').val(item.Amount);
							}
						});


						$basket_item.remove();
						var $gift_item = $('.basket-item[data-id="gift"]');
						if($gift_item.length>0 && !has_gift){
							$gift_item.remove();
							if($('.get-another-gift-btn').length){
								$('.get-another-gift-btn').trigger('click')
							}
						}
						checkoutbasket(data);
						renderCheckout(data);
						var $form = $('#checkout-form');
						console.log('1');
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
				});
			}

			return false;
		});
	}, 1000);
	renderSummary(data);
}

function placemarkmobile(){
	
	$(document).on('click','#pickuppoint',function(){
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

function getCheckoutView(viewName){
	$('.checkout-view').hide();
	$('.checkout-view.'+viewName+'-view').show();
	if(viewName == 'main'){
		$('.status-bar').hide();
		//$(window).scrollTop( window.order_scroll);
	}else{
		$('.status-bar').show();
		if(viewName=='my-adresses'){
			$('.status-bar .title').text('Выберите адрес');
		}
		if(viewName=='payment-type'){
			$('.status-bar .title').text('Способ оплаты');
		}
		if(viewName=='set-pickup'){
			$('.status-bar .title').text('Пункты самовывоза');
		}
		if(viewName=='new-address'){
			$('.status-bar .title').text('Адрес доставки');
		}
		if(viewName=='delivery-regions'){
			$('.status-bar .title').text('Район');
		}
		if(viewName=='order-date'){
			$('.status-bar .title').text('Выбрать дату');
		}
		if(viewName=='checkoutbasket'){
			$('.status-bar .title').text('Моя корзина');
		}
		if(viewName=='checkoutagreement'){
			$('.status-bar .title').text('Соглашение');
		}
	}
	if(viewName == 'my-adresses' || viewName == 'payment-type' || viewName == 'new-address' || viewName == 'set-pickup'){
		$('.back').attr('onclick','getCheckoutView("main")').attr('href','#');
	}
	if(viewName == 'order-date' || viewName == 'order-hour' || viewName == 'order-minute' || viewName == 'checkoutagreement'){
		$('.back').attr('onclick','getCheckoutView("main")').attr('href','#time');
	}
	if(viewName == 'delivery-regions'){
		$('.back').attr('onclick','getCheckoutView("new-address")').attr('href','#');
	}
	if(viewName == 'checkoutbasket'){
		$('.back').attr('onclick','getCheckoutView("main")').attr('href','#');
	}

}

function checkoutuser(data){
//	console.log(data);
	$('.user-balance span').first().text(data.Bonuses);
};


$(function(){
	if (window.location.pathname == '/checkout/'){
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
			townid.val('');
			townid.val( townid.val() + firsttown.Id );
			console.log(firsttown);
			streetstring(firsttown.Id);
		}	
	});
	};
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

$(document).ready(function(){
	
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
		validateAddress();
	});
	$(document).on('change','#streetid',function(){
		$('#houseid').val('');
		$('#house').val('');
		$('#house').prop('disabled', false);
		$('[name="ORDER[APARTMENT]"]').val('');
		$('[name="ORDER[PORCH]"]').val('');
		$('[name="ORDER[FLOOR]"]').val('');
		validateAddress();
	});
	$(document).on('change','#houseid',function(){
		$('[name="ORDER[APARTMENT]"]').val('');
		$('[name="ORDER[PORCH]"]').val('');
		$('[name="ORDER[FLOOR]"]').val('');
		validateAddress();
	});
});


function processAddress(){
	$('.delivery-type-tab-courier .config-item a').text($('[name="ORDER[STREET]"]').val()+' '+$('[name="ORDER[HOUSE]"]').val()+' кв. '+$('[name="ORDER[APARTMENT]"]').val());
	$('.back:visible').trigger('click');
	validatedeliveryorder();
}

function validateOrder(){
	if($('[name="ORDER[USER_NAME]"]').length > 0){
		var error = 0;
		if($('[name="ORDER[USER_NAME]"]').val().trim().length == 0){
			error = 1;
		}
		if($('[name="ORDER[USER_PHONE]"]').val().trim().length == 0){
			error = 1;
		}
		if($('[name="ORDER[PAYMENT_TYPE]"]').val().trim().length == 0){
			error = 1;
		}
		if($('[name="ORDER[DELIVERY_PICKUP_ID]"]').val().trim().length == 0){
			/*if($('[name="ORDER[DISTRICT_ID]"]').val().trim().length == 0){
				error = 1;
			}*/
			if($('[name="ORDER[STREET]"]').val().trim().length == 0){
				error = 1;
			}
			if($('[name="ORDER[HOUSE]"]').val().trim().length == 0){
				error = 1;
			}
			if($('[name="ORDER[APARTMENT]"]').val().trim().length == 0  &&  !$('[name="PRIVATE_HOUSE"]').is(':checked')){
				error = 1;
			}
		}
	}
}

function validateAddress(){
	var error = 0;
	if($('[name="ORDER[STREET]"]').val().trim().length == 0)
		error = 1;

	if($('[name="ORDER[HOUSE]"]').val().trim().length == 0)
		error = 1;

	if($('[name="ORDER[APARTMENT]"]').val().trim().length == 0 &&  !$('[name="PRIVATE_HOUSE"]').is(':checked'))
		error = 1;
	
	if($('[name="ORDER[PORCH]"]').val().trim().length == 0 &&  !$('[name="PRIVATE_HOUSE"]').is(':checked'))
		error = 1;
	
	if($('[name="ORDER[FLOOR]"]').val().trim().length == 0 &&  !$('[name="PRIVATE_HOUSE"]').is(':checked'))
		error = 1;
		
/*    if($('[name="ORDER[DISTRICT_ID]"]').val().trim().length == 0)
		error = 1;*/

	if(error == 0){
		$('.new-address-view button').removeAttr('disabled');
	}else{
		$('.new-address-view button').attr('disabled','disabled');
	}
	console.log(error);
};

function validatedeliveryorder(){
	var $form = $('#checkout-form');
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
}

$(document).ready(function () {
	if ($('.checkout-form__error__custom').length > 0) {
		$('.checkout-form__error__custom').remove();
	}

	$('[name="PRIVATE_HOUSE"]').on('change',function(e){
		if($(this).is(':checked')){
			$('.not_private_house_fields').hide();
		}else{
			$('.not_private_house_fields').show();
		}
		validateAddress();
	});
	
	$('.new-address-view input').on('keyup',function(){
		validateAddress();
	});
	
	$("#phone").mask("+7(999) 999-99-99");
	
	
	$(document).on('change','[name="ORDER[PROMO]"]',function(){
		var $form = $('#checkout-form'); 
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
});

$(document).ready(function(){
	if (window.location.pathname == '/checkout/'){

	$(document).on('change','[name="ORDER[DISCOUNT_BONUSES]"]',function(){
		var $form = $('#checkout-form');
		console.log('12');
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
	
	$(document).on('focusout','#namefield',function(){
		if ($('#namefield').val() == ''){
			$('[name="ORDER[USER_NAME]"]').parent().addClass('error');
			$('[name="ORDER[USER_NAME]"]').parent().find('.help-block').show();
		}else{
			$('[name="ORDER[USER_NAME]"').parent().removeClass('error');
			$('[name="ORDER[USER_NAME]"]').parent().find('.help-block').hide();
		}
	});
	$(document).on('focusout','#phone',function(){
		if ($('#phone').val() == ''){
			$('#phone').parent().addClass('error');
			$('#phone').parent().find('.help-block').text('Необходимо заполнить это поле!');
			$('#phone').parent().find('.help-block').show();
		}else{
			$('#phone').unmask();
			if ($('#phone').val().length < 10){
				$("#phone").mask("+7(999) 999-99-99");
				$('#phone').parent().addClass('error');
				$('#phone').parent().find('.help-block').text('Проверьте номер!');
				$('#phone').parent().find('.help-block').show();
			}else{
			$('#phone').parent().removeClass('error');
			$('#phone').parent().find('.help-block').hide();
			$("#phone").mask("+7(999) 999-99-99");
			}
		}
	});
	
	$(document).on('focusout','.use-bonuses',function(){
		var bonustotal = (User.Bonuses);
		var bonus = $('[name="ORDER[DISCOUNT_BONUSES]"]').val();
		var halfprice = (Basket.TotalPrice)/2;
		if (bonus > bonustotal){
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().addClass('error');
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').text('У вас нет такого количества бонусов')
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').show();
		}else{
			if (bonus > halfprice){
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().addClass('error');
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').text('Вы не можете использовать больше ' +halfprice+' бонусов')
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').show();
			}else{
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().removeClass('error');
			$('[name="ORDER[DISCOUNT_BONUSES]"]').parent().find('.help-block').hide();
			}
		}
	});
	
	
	$('#checkout-form').keydown(function(event){
		if(event.keyCode == 13) {
		  event.preventDefault();
		  return false;
	  }
	});

	$(document).on('click','.set-pickup-view .bd-row-checkbox',function(){
		var $form = $('#checkout-form');
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

	$(document).on('click','#type_1',function(){
		var $form = $('#checkout-form');
		var DELIVERY_TIME_TYPE = $('[name="ORDER[DELIVERY_TIME_TYPE]"]').val();
		if (DELIVERY_TIME_TYPE == 'current'){
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
		};
	});
	};
});


$(function(){
	
	$('.order-confirm-text a').on('click',function(){
//	    $('.auth-content').show();
//        $('#page').hide();
		getCheckoutView('checkoutagreement');
		return false; 
	});
	
	$('.use-bonuses button').on('click',function(e){
		$(this).closest('.use-bonuses').find('.bd-input').show();
	})
	
	 if($('.delivery-type-toggle').length>0){
		$('.delivery-type-toggle a').on('click',function(e){
			e.preventDefault();
			$('.delivery-type-toggle a').removeClass('active');
			$('.dt_cont_d').hide();
			$('[name="ORDER[DELIVERY_TYPE]"]').val($(this).data('type'));
			$('.dt_cont_d.delivery_time_cont_'+$(this).data('type')).show();
			$(this).addClass('active');
			$('.delivery-type-content > div').hide()
			$('.delivery-type-tab-'+$(this).data('type')).show();
		});
	}
	if($('.delivery-time-type-toggle').length>0){
		$('.delivery-time-type-toggle a').on('click',function(e){
			e.preventDefault();
			$('.delivery-time-type-toggle a').removeClass('active');
			$(this).addClass('active');	
			$('[name="ORDER[DELIVERY_TIME_TYPE]"]').val($(this).data('type'))
			if($(this).data('type')=='exacttime'){
				$('.delivery-time-cont').show();
			}else{
				$('.delivery-time-cont').hide();
			}
		});
	}
	
	if($('.bd-row-checkbox').length){
//        $('.bd-row-checkbox').on('click',function(e){
		 $(document).on('click','.bd-row-checkbox',function(e){
			if(!$(this).hasClass('multi'))
				$(this).closest('.checkboxes-mobile').find('.bd-row-checkbox').removeClass('active');

			if(!$(this).hasClass('active')){
				$('input[name="'+$(this).data('target')+'"]').val(1);
				$(this).addClass('active');
			}else{
				$('input[name="'+$(this).data('target')+'"]').val(0);
				$(this).removeClass('active');
			}

		});
	}
	
	$('.set-pickup-view .bd-row-checkbox').on('click',function(e) {
		e.preventDefault();
		$('[name="ORDER[DELIVERY_PICKUP_ID]"]').val($(this).attr('data-id'));
		$('.delivery-type-tab-2 .config-item a').text($(this).text())
		$('.map-row').show();
//        myMap.setCenter(window['myPlacemark_'+$(this).attr('data-id')].geometry.getCoordinates(), 16, {duration: 1000})
		validateOrder();
	});
		
	
	$('.payment-type-view .bd-row-checkbox').on('click',function(e){
		e.preventDefault();

		$('[name="ORDER[PAYMENT_TYPE]"]').val($(this).attr('data-id'));
		if($('[name="ORDER[PAYMENT_TYPE]"]').val()=='cash'){
			$('._change_row').show();
		}else{
			$('._change_row').hide();
		}
		$('.payment-type-ci a').text($(this).text());

		$('.back:visible').trigger('click');
		document.location.href = '#payment';
		validateOrder();

	});
	
	$('#checkout-form').on('submit',function(e){
		e = e.originalEvent;
		$("#phone").unmask();
		$('.send-order').prop('disabled', true);
		var $form = $(this);
		setTimeout(function() {
		$('.send-order').prop('disabled', false);
		$('.send-order').removeClass('disabled');
		}, 3000);
		$.ajax({
			type: 'post',
			data: $form.serialize(),
			dataType: "json",
			url: '/bd/checkout/?validate',
			success: function(data){
				if(data.status==0){
					console.log('errors')
					$('.bd-input,.sod_select').removeClass('error shake');
					$('.config-item').removeClass('error');
					$('.bd-input').removeClass('error');
					$.each(data.errors,function(i,item){
						if(/*item == 'DISTRICT_ID' || */item == 'STREET' || item == 'HOUSE' || item == 'APARTMENT'){
							$('.delivery-type-tab-1 .config-item').last().addClass('error');
						}
						if(item == 'PAYMENT_TYPE'){
							$('.payment-type-ci').addClass('error');
						}
						if(item == 'DELIVERY_PICKUP_ID'){
							$('.delivery-type-tab-2 .config-item').addClass('error');
						}
						if(item == 'USER_NAME'){
							$('[name="ORDER[USER_NAME]"').parent().addClass('error');
						}
						if(item == 'USER_PHONE'){
							$('[name="ORDER[USER_PHONE]"').parent().addClass('error');
						}
						if(item == 'DELIVERY_DATE'){
							$('.config-item.date_c').addClass('error');
						}
						if(item == 'HOUR'){
							$('.config-item.hour_c').addClass('error');
						}
						if(item == 'MINUTE'){
							$('.config-item.minute_c').addClass('error');
						}
					});

					setTimeout(function(){$(window).scrollTop($('#checkout-form').find('.error').first().offset().top-52);}, 500);
					//$('.send-order').removeAttr('disabled');
					$('.alert-errors').show();
					$('.send-order').prop('disabled', false);
				}else{
					$form[0].submit();
				}
			}
		});
		e.preventDefault();
		return false;
	});
	
});


// checkout time

$(function(){
	if (window.location.pathname == '/checkout/'){
		$('footer').hide();
	
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
	
	$('#hour').empty();
	var hourcontainer = document.getElementById("hour");
	for (var i = 0; i < resulthours.length; i++) {
	hourcontainer.innerHTML += '<div class="bd-row-checkbox" data-hour="'+Math.floor(resulthours[i])+'"><span>'+Math.floor(resulthours[i])+'</span><div class="base-image"><div class="image checkout_ico_checked">
						<svg viewBox="0 0 16 16"><path d="M54.04,48.75L50.106,53.2158H50.1044a0.9616,0.9616,0,0,1-.3215.2579v0.002a0.8512,0.8512,0,0,1-.7.0309,0.9307,0.9307,0,0,1-.2761-0.1678l-0.0017-.002-2.4466-2.3111a1.0781,1.0781,0,0,1-.3532-0.7056,1.1246,1.1246,0,0,1,.2041-0.7719h0a0.9164,0.9164,0,0,1,.06-0.0751l0.002-.0023a0.9131,0.9131,0,0,1,.5771-0.31,0.877,0.877,0,0,1,.6211.1655c0.0218,0.0156.0456,0.0349,0.0711,0.0573l1.7436,1.6948,3.3387-3.73c0.0116-.0142.0332-0.0374,0.0626-0.068a0.9059,0.9059,0,0,1,.5922-0.2792,0.8848,0.8848,0,0,1,.6137.2012l0.0008-.0017c0.0179,0.0147.0406,0.0352,0.0675,0.0612h0.0017a1.0961,1.0961,0,0,1,.3189.726,1.1129,1.1129,0,0,1-.2412.76L54.04,48.75h0Z" transform="translate(-42 -44)"/></svg>
					  </div>
					</div>
					</div>';	
	}

	var minutes = [00,15,30,45]
	$('#minute').empty();
	var minutecontainer = document.getElementById("minute");
	for (var i = 0; i < minutes.length; i++) {
	minutecontainer.innerHTML += '<div class="bd-row-checkbox" data-minute="'+minutes[i]+'"><span>'+minutes[i]+'</span><div class="base-image"><div class="image checkout_ico_checked">
						<svg viewBox="0 0 16 16"><path d="M54.04,48.75L50.106,53.2158H50.1044a0.9616,0.9616,0,0,1-.3215.2579v0.002a0.8512,0.8512,0,0,1-.7.0309,0.9307,0.9307,0,0,1-.2761-0.1678l-0.0017-.002-2.4466-2.3111a1.0781,1.0781,0,0,1-.3532-0.7056,1.1246,1.1246,0,0,1,.2041-0.7719h0a0.9164,0.9164,0,0,1,.06-0.0751l0.002-.0023a0.9131,0.9131,0,0,1,.5771-0.31,0.877,0.877,0,0,1,.6211.1655c0.0218,0.0156.0456,0.0349,0.0711,0.0573l1.7436,1.6948,3.3387-3.73c0.0116-.0142.0332-0.0374,0.0626-0.068a0.9059,0.9059,0,0,1,.5922-0.2792,0.8848,0.8848,0,0,1,.6137.2012l0.0008-.0017c0.0179,0.0147.0406,0.0352,0.0675,0.0612h0.0017a1.0961,1.0961,0,0,1,.3189.726,1.1129,1.1129,0,0,1-.2412.76L54.04,48.75h0Z" transform="translate(-42 -44)"/></svg>
					  </div>
					</div>
					</div>';	
	}
	
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
	$('#date').empty();
	var minutecontainer = document.getElementById("date");
	for (var i = 0; i < minutes.length; i++) {
	minutecontainer.innerHTML += '<div class="bd-row-checkbox" data-date="'+resultdates[i]+'" data-month="'+months[i]+'" data-day="'+dates[i]+'" data-value="'+i+' "><span>'+resultdates[i]+'</span><div class="base-image"><div class="image checkout_ico_checked">
						<svg viewBox="0 0 16 16"><path d="M54.04,48.75L50.106,53.2158H50.1044a0.9616,0.9616,0,0,1-.3215.2579v0.002a0.8512,0.8512,0,0,1-.7.0309,0.9307,0.9307,0,0,1-.2761-0.1678l-0.0017-.002-2.4466-2.3111a1.0781,1.0781,0,0,1-.3532-0.7056,1.1246,1.1246,0,0,1,.2041-0.7719h0a0.9164,0.9164,0,0,1,.06-0.0751l0.002-.0023a0.9131,0.9131,0,0,1,.5771-0.31,0.877,0.877,0,0,1,.6211.1655c0.0218,0.0156.0456,0.0349,0.0711,0.0573l1.7436,1.6948,3.3387-3.73c0.0116-.0142.0332-0.0374,0.0626-0.068a0.9059,0.9059,0,0,1,.5922-0.2792,0.8848,0.8848,0,0,1,.6137.2012l0.0008-.0017c0.0179,0.0147.0406,0.0352,0.0675,0.0612h0.0017a1.0961,1.0961,0,0,1,.3189.726,1.1129,1.1129,0,0,1-.2412.76L54.04,48.75h0Z" transform="translate(-42 -44)"/></svg>
					  </div>
					</div>
					</div>';	
	}
	
	var $form = $('#checkout-form');
	
	$(document).on('click','.order-date-view .bd-row-checkbox',function(e){
		$('.config-item.date_c a').text($(this).text());
		$('.config-item.date_c a').attr('data-value' ,$(this).data('value'));
		$('#currentmonth').val($(this).data('month'));
		$('#currentdate').val($(this).data('day'));
		$('[name="ORDER[DELIVERY_DATE]"]').val($(this).data('date'));
		$('[name="ORDER[DELIVERY_DATE]"]').trigger('change');
		$('.back:visible').trigger('click');
		document.location.href = '#time';
		validateOrder();
		if ($('[name="ORDER[HOUR]"]').val() != ''){
			if ($('[name="ORDER[MINUTE]"]').val() != ''){
				if ($('[name="ORDER[DELIVERY_DATE]"]').val() != ''){
					console.log('4');
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
	})
	
	$(document).on('click','.order-hour-view .bd-row-checkbox',function(e){
		$('.config-item.hour_c a').text($(this).text());
		$('[name="ORDER[HOUR]"]').val($(this).data('hour'));
		$('[name="ORDER[HOUR]"]').trigger('change');
		$('.back:visible').trigger('click');
		document.location.href = '#time';
		validateOrder();
		if ($('[name="ORDER[HOUR]"]').val() != ''){
			if ($('[name="ORDER[MINUTE]"]').val() != ''){
				if ($('[name="ORDER[DELIVERY_DATE]"]').val() != ''){
					console.log('4');
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
	})
	
	$(document).on('click','.order-minute-view .bd-row-checkbox',function(e){
		$('.config-item.minute_c a').text($(this).text());
		$('[name="ORDER[MINUTE]"]').val($(this).data('minute'));
		$('[name="ORDER[MINUTE]"]').trigger('change');
		$('.back:visible').trigger('click');
		document.location.href = '#time';     
		validateOrder();
		if ($('[name="ORDER[HOUR]"]').val() != ''){
			if ($('[name="ORDER[MINUTE]"]').val() != ''){
				if ($('[name="ORDER[DELIVERY_DATE]"]').val() != ''){
					console.log('4');
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
	})
	
	
	}
});


// auth

$(function(){
	$('.login-trigger').on('click',function(e){
		e.preventDefault();
		var api = $("#menu").data("mmenu");
		api.close();

		$('.auth-content').show();
		$('#page').hide();
//        var state = 'sign-in-default-state';
//        if(window.auth_type == 'email'){
//            state = 'sign-in-email-state';
//        }
		var state = 'sign-in-email-state';
		$('.header a.mainmenu').removeClass('opened').html('');
		setAuthState(state);
		$(window).scrollTop(0);
		return false;
	});
});

function setAuthState(state){
	$('.header .title a').show();
	$('.header .title span').text('Авторизация').show();
	$('.auth-state').hide();
	$('.auth-state.'+state).show();
	if(state == 'forgot-password-state' || state == 'phone-confirm-password-state' || state == 'set-new-password-state' || state == 'phone-confirm-password-state' || state == 'set-new-password-state' || state == 'agreement-state'){
		$('.auth-tabs').hide();
		$('.auth-status-bar .back').show();
		$('.auth-status-bar').css('height','48px');
	}else{
		$('.auth-status-bar .back').hide();
		$('.auth-tabs').show();
		$('.auth-status-bar').css('height','70px');
	}
	$('.status-bar .title').text('');
//    var type = window.auth_type;
	
//    if(state == 'forgot-password-state'){
//        if(type=='sms')
//            type = 'default'
//        $('.status-bar .title').text(BX.message('forgot_password'));
//        $('.status-bar .back').attr('onclick','setAuthState("sign-in-'+type+'-state")');
//    }
//  
	if(state == 'agreement-state'){
		if(type=='sms')
			type = 'phone'
		$('.status-bar .title').text('Соглашение');
		$('.status-bar .back').attr('onclick','setAuthState("sign-up-'+type+'-state")');
	}
}

$(function(){
	$(document).on('submit','.auth-state form',function(e){
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
//                                $('.confirm-email__message').show();
//                            }
//                        }else{
							window.location.reload();
//                        }
//                    }
//                }
			}
		})
		return false;
	})
});
