/*!
*	+---------------------------------------------------------------+
*	|																|
*	|	__PLUGIN DETAILS__											|
*	|	------------------------------------------------------------|
*	|	------------------------------------------------------------|
*	|																|
*	|	JQuery Plugin for Form Validation							|
*	|	Plugin Name : formValidate									|
*	|	Author: Abhijeet Karmakar									|
*	|	Date of creation : 17/01/2013 to 24/01/2013					|
*	|	Description : "formValidate" works on all form elements	 	|
*	|				with HTML5 form tag's all attributes Support.	|
*	|																|
*	|	Note for non-HTML5 browsers:								|
*	|		Need to attach "html5shiv.js" script					|
*	|		Need to attach "modernizr.js" script					|
*	|																|
*	|	Browsers : Firefox, Chrome, Safari (Tested)					|
*	|				[ Not too Old Versions ]						|
*	|																|
*	|	Copyright @ Abhijeet, 2013			 						|
*	|																|
*	+---------------------------------------------------------------+
*/

(function($){

	$.fn.formValidate = function( options, event ){
		
		var settings = $.extend({
			/*! HTML5 Elements Compatibility Test */
			required : true,
			email : true,
			pattern : false,
			
			/*! Patterns */
			nameRX : /(^[A-Za-z]+([\s]{1}([A-Za-z]+)){1,2}$)/i,
			mailRX : /(\w[^\s]+@+(gmail|yahoo|rediffmail|hotmail)+.+(com|in|co.in)$)/i,
			usernameRX : /(^\w[^\s]+\w$)/i,
			
			/*! Error Handling Variables */
			error : false,
			msgText : '',
			
			/*! Error Message Style */
			overlayColor : 'rgba(0, 0, 0, 0.6)',
			msgFont : '12px/17px Verdana',
			msgFirstColor : '#f5f5f6',
			msgLastColor : '#e0dfe3',
			msgColor : '#0f0f0f',
			
			/*! Error Message Texts */
			requiredText : 'Please fill out this field.',
			selectText : 'Please select an item in the list',
			emailText : 'Please enter an email address.',
			patternText : 'Please match the requested format.',
			
			stayTime : 8000
		}, options);
		
		var $this, $e;
		var methods = {
			_init: function(event){
				settings.required = Modernizr.input.required;
				settings.pattern = Modernizr.input.pattern;
				settings.email = Modernizr.inputtypes.email;

				$this = $(this);
				$e = $(event);
				
				methods.__fixPlaceholders();
				
				$this.on('submit', methods._validate);
				return this;
			},
			
			_validate : function(){
				settings.error = false;
				if( $('.validation-error-msg').html() ){ $('.validation-error-msg').remove(); }
				
				if(! settings.required ){
					$this.find('input,select').each(methods.__isLeft);
				}
				if(! settings.pattern ){
					$this.find('input').each(methods.__checkPatterns);
				}
				$this.find('input[type="email"]').each(methods.__checkMail);
				methods.__checkName();
				methods.__checkUsername();
				//alert(settings.error);

				if( $('.form-error-logger').html() == undefined ){
					$('body').append('<p class="form-error-logger" style="display:none;" />');
				}
				$('.form-error-logger').text('Error');
				if(! settings.error ){ $('.form-error-logger').text('No Error'); }
				
				return !settings.error;
			},
			
			__isLeft : function(i, m){
				
				if( $(m).attr('required') != undefined && ($(m).val() === '' || $(m).val() === $(m).attr('placeholder')) ){
					$(m).parent().append('<div class="validation-error-msg html5-required elem-'+i+'" />');
					settings.error = true;
				}
				methods.__styleMessage();
				if( $(m).prop('tagName').toLowerCase() == 'input' ){		/*! .eq(n) selector is not supported by IE8(Tested) */
					$('.html5-required.elem-'+i).text(settings.requiredText);
				}else{
					$('.html5-required.elem-'+i).text(settings.selectText);
				}
				
				return this;
			},
			
			__fixPlaceholders : function(){		/*! Placeholder attribute Fix for old browsers */
			
				//if( $.browser !== undefined ){
					//if( $.browser.msie && (parseFloat($.browser.version) <= 9 )){
					if( Modernizr.input.placeholder == undefined ){
						$('form input:not([type="submit"])').each(function(i, p){
							if( $(p).attr('placeholder') != 'undefined' && $(p).val() === '' ){
								$(this).val($(this).attr('placeholder')).css({'font-style': 'italic', color: '#8f8f8f'});
								
								$('input:not([type="submit"])').bind('focus', function(){ if($(this).val() === $(this).attr('placeholder')){$(this).val('').css({'font-style':'normal',color:'#000'}); }}).bind('blur', function(){ if($(this).val() === ''){$(this).val($(this).attr('placeholder')).css({'font-style': 'italic', color: '#8f8f8f'}); }});
							}
						});
					}
					return this;
				//}
			},
			
			__checkPatterns : function(i, elem){

				if( $(elem).val() !== '' && $(elem).val() !== $(elem).attr('placeholder') ){
					if( $(elem).attr('pattern') != undefined ){
						var pattern = new RegExp($(elem).attr('pattern'));
						if(! pattern.test($(elem).val()) ){
							$(elem).select().parent().append('<div class="validation-error-msg invalid-field-pattern" />');
							
							settings.error = true;
						}
					}
				}
				methods.__styleMessage();
				$('.invalid-field-pattern').text(settings.patternText);
				
				return this;
			},
			
			__checkMail : function(i, mail){
				
				if( $(mail).val() !== '' && $(mail).val() !== $(mail).attr('placeholder') ){
					if(! settings.mailRX.test($(mail).val()) ){
						$(mail).select().parent().append('<div class="validation-error-msg invalid-email-pattern" />');
						methods.__styleMessage();
						$('.invalid-email-pattern').html(settings.emailText + '<span class="mail-input-help" />');
						
						$('.mail-input-help').css({
							display: 'inline-block',
							background: '#4e8',
							padding: 5,
							cursor: 'pointer',
							color: '#fff',
							font: '14px Verdana',
							fontWeight: 800
						}).text('?').click(function(){
							alert('Only following email clients are supported\n\rgmail, yahoo, rediffmail, hotmail\n\rExample: user@gmail.com');
						});
						settings.error = true;
					}
				}
				return this;
			},
			
			__checkName : function(){
				var name = $this.find('input[role="name"]');
				
				if( $(name).val() !== '' && $(name).val() !== $(name).attr('placeholder') ){
					if(! settings.nameRX.test($(name).val())){
						$(name).select().parent().append('<div class="validation-error-msg invalid-name-pattern" />');
						methods.__styleMessage();
						$('.invalid-name-pattern').html(settings.patternText + '<span class="name-input-help" />');
						
						$('.name-input-help').css({
							display: 'inline-block',
							background: '#4e8',
							padding: 5,
							cursor: 'pointer',
							color: '#fff',
							font: '14px Verdana',
							fontWeight: 800
						}).text('?').click(function(){
							alert('Only Following Name Format is supported\n\rFirstname {Middlename} Lastname\n\r\n\rNo unnecessary blank space should be entered');
						});
						
						settings.error = true;
					}
				}
			},
			
			__checkUsername : function(){
				var username = $this.find('input[role="username"]');
				
				if( $(username).val() !== '' && $(username).val() !== $(username).attr('placeholder') ){
					if(! settings.usernameRX.test($(username).val())){
						$(username).select().parent().append('<div class="validation-error-msg invalid-username-pattern" />');
						methods.__styleMessage();
						$('.invalid-username-pattern').html(settings.patternText + '<span class="username-input-help" />');
						
						$('.username-input-help').css({
							display: 'inline-block',
							background: '#4e8',
							padding: 5,
							cursor: 'pointer',
							color: '#fff',
							font: '14px Verdana',
							fontWeight: 800
						}).text('?').click(function(){
							alert('No Space Should be there in Username');
						});
						
						settings.error = true;
					}
				}
			},
			
			__styleMessage : function(){
				$('.validation-error-msg').css({
					position: 'absolute',
					display: 'block',
					right: 10,
					padding: '10px',
					color: settings.msgColor,
					background: settings.msgLastColor,
					/*background: '-moz-linear-gradient(top, '+ settings.msgFirstColor +' 0%, '+ settings.msgLastColor +' 100%)',
					background: '-webkit-linear-gradient(top, '+ settings.msgFirstColor +' 0%, '+ settings.msgLastColor +' 100%)',
					background: '-o-linear-gradient(top, '+ settings.msgFirstColor +' 0%, '+ settings.msgLastColor +' 100%)',
					background: 'linear-gradient(top, '+ settings.msgFirstColor +' 0%, '+ settings.msgLastColor +' 100%)',*/
					filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="'+ settings.msgFirstColor +'", endColorstr="'+ settings.msgLastColor +'", GradientType=0)',
					textShadow: '1px 1px #fff',
					font: settings.msgFont
				}).fadeOut(settings.stayTime);
			}
		};

		if( methods[options] ){
			return methods[options]._init.apply(this, Array.prototype.slice.call(arguments, 1));
		}else if( ! options || typeof options==='object' ){
			return methods._init.apply(this, arguments);
		}else{
			$.error('Method ' + options + ' Doesn\'t Exist on jQuery.formValidator...');
		}
	};
		
})(jQuery);