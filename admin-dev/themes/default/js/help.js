/*
*
* NOTICE OF LICENSE
*
* This source file is subject to the Open Software License (OSL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/osl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2016 PrestaShop SA
*  @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

$(function() {

		var storage = false;

		if (typeof(getStorageAvailable) !== 'undefined') {
			storage = getStorageAvailable();
		}

		initHelp = function(){
			$('#main').addClass('helpOpen');
			//first time only
			if( $('#help-container').length === 0) {
				//add css
				// $('head').append('<link href="//help.thirtybees.com/css/help.css" rel="stylesheet">');
				//add container
				$('#main').after('<div id="help-container"></div>');
			}
			//init help (it use a global javascript variable to get actual controller)
			pushContent(help_class_name);
			$('#help-container').on('click', '.popup', function(e){
				e.preventDefault();
				if (storage)
					storage.setItem('helpOpen', false);
				$('.toolbarBox a.btn-help').trigger('click');
				var helpWindow = window.open("index.php?controller=" + help_class_name + "?token=" + token + "&ajax=1&action=OpenHelp", "helpWindow", "width=450, height=650, scrollbars=yes");
			});
		};


		//init
		$('.toolbarBox a.btn-help').on('click', function(e) {
			e.preventDefault();
			if( !$('#main').hasClass('helpOpen') && document.body.clientWidth > 1200) {
				if (storage)
					storage.setItem('helpOpen', true);
				$('.toolbarBox a.btn-help i').removeClass('process-icon-help').addClass('process-icon-loading');
				initHelp();
			} else if(!$('#main').hasClass('helpOpen') && document.body.clientWidth < 1200){
				var helpWindow = window.open("index.php?controller=" + help_class_name + "?token=" + token + "&ajax=1&action=OpenHelp", "helpWindow", "width=450, height=650, scrollbars=yes");
			} else {
				$('#main').removeClass('helpOpen');
				$('#help-container').html('');
				$('.toolbarBox a.btn-help i').removeClass('process-icon-close').addClass('process-icon-help');
				if (storage)
					storage.setItem('helpOpen', false);
			}
		});

		// Help persistency
		if (storage && storage.getItem('helpOpen') == "true") {
		 	$('a.btn-help').trigger('click');
		}

		//switch home
		var language = iso_user;
		var home;
		switch(language) {
			case 'en':
				home = '19726802';
				break;
			case 'fr':
				home = '20840479';
				break;
			default:
				language = 'en';
				home = '19726802';
		}

		//feedback
		var arr_feedback = {};
		arr_feedback.page = 'page';
		arr_feedback.helpful = 'helpful';

		//toc
		var toc = [];
		var lang = [
			['en','19726802'],
			['fr','20840479']
		];

	// change help icon
	function iconCloseHelp(){
		$('.toolbarBox a.btn-help i').removeClass('process-icon-loading').addClass('process-icon-close');
	}

	//get content
	function getHelp(pageController) {
		var d = new $.Deferred();
		$.ajax( {
			url: 'https://docs.thirtybees.com/api/1.0/'+ pageController,
			jsonp: 'callback',
			dataType: 'jsonp',
			success: function(data) {
				if (isCleanHtml(data))
				{
					$('#help-container').html(data);
					d.resolve();
				}
			}
		});
		return d.promise();
	}

	//update content
	function pushContent(target) {
		$('#help-container').removeClass('openHelpNav').html('');
		//@todo: track event
		getHelp(target)
		.then(iconCloseHelp);
	}
});
