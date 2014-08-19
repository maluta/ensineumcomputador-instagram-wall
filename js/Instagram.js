/* inspirado na board da agência NakedBrasil, obrigado  */

/*

  >>> PARA MODIFICAR AS TAGS <<<

	Modifique no código abaixo:

	"tags" é uma lista. Palavras-chave devem estar entre aspas ('keyoword') e se tiver mais de uma separar por virgula (,). Tudo entre colchetes ([])

	"tagsMinIds" deve conter uma lista ([]) com vários "0" (número zero). A quantidade de zeros é igual ao tamanho (tags.length) da lista de tags

	"tagsFullName" deve ter o mesmo número de items de 'tags' e é o que aparece, de fato, na página.

	----
	Eu criei uma chave nova para nós usarmos em http://instagram.com/developer/clients/manage/
	Precisando de alguma informação me falem @maluta

*/


Instagram = {
	idImage : 0,
	marginTop : 0,
	flgFirstMove : 1,
	time: 1000,
	tags : ['tecnologia','ensinar','computador','codigofonte','codificar','ensineumcomputador','programae','programaê','aprendizado','scratch'],
  tagsMinIds : [0,0,0,0,0,0,0,0,0,0],
	backgrounds : ['red','blue','green','orange','yellow'],
	tagsFullName : ['Tecnologia','Ensinar','Computador','Código-Fonte','Codificar','ensineumcomputador','Programaê','Programaê','Aprendizado','Scratch'],
	backgroundsClasses : ['programae'],
	row:0,
	imageWidth: 306,
	imageHeight: 306,
	imageMargin:4,
	indexBg:-1,
	containerMove:'',

	init : function(){
			document.body.style.overflow = 'hidden';
			Instagram.containerMove = document.getElementById('divImages');
			Instagram.containerMove.style.marginTop = '0px';
			Instagram.getImages();
			Instagram.resize();
			$(window).resize(Instagram.resize);
	},

	getImages : function(){
		var index = Math.floor((Math.random()*Instagram.tags.length-1)+1);

		var indexColor = Math.floor((Math.random()*4)+1);
		var color = Instagram.backgrounds[indexColor];
		var search = decodeURIComponent(Instagram.tags[index]);
		Instagram.idImage = Instagram.tagsMinIds[index];
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			cache: false,
			url: "https://api.instagram.com/v1/tags/" + search + "/media/recent",
			data:{client_id:'8e530b8c64e9419586f87d5e8eb63f03',min_tag_id:Instagram.idImage},
			success : function(json){
				if(json.data.length==0){
					Instagram.getImages();
				}
				Instagram.indexBg = 0;
				console.log(Instagram.indexBg,Instagram.backgroundsClasses[Instagram.indexBg]);
				for(var i = 0; i < json.data.length ; i+=1) {
					if(i==0){
						var $title = $('<div class="title-word itemRemove '+ Instagram.backgroundsClasses[Instagram.indexBg] +'"><span><b>#</b>' + Instagram.tagsFullName[index] + '</span></div>');
						$('#divImages').append($title);

					}
					var $foto = $('<div class="image itemRemove"><span class="name">@'+json.data[i].user.username+'</span><img src="' + json.data[i].images.low_resolution.url +'" alt="" style="display:none;" /></div>');
					var $fotoLabel = $($foto.find('span')[0]);
					$('#divImages').append($foto);
					$($foto.find('img')).data('index',i);
					$($foto.find('img')).bind('load',function(){
						var img = $(this);
						$(this).css('display','block');
						img.fadeTo(0,0);
						var index = img.data('index');
						setTimeout(function(){
							img.fadeTo(300,1);
						},100*index);
					});

				}

				Instagram.tagsMinIds[index] = json.pagination.next_min_id;
				if($('#divImages').children().length < 40){
					Instagram.getImages();
				}else {
					Instagram.controlMoveImages(false);
				}


			}
		});
	},


	controlMoveImages : function(){
		if(Instagram.flgFirstMove==1){
			Instagram.flgFirstMove = 0;
			document.getElementById('imgLoading').style.display='none';
			Instagram.moveImages(true);
		}
	},

	moveImages : function(loop){
		var vel = 1;
		Instagram.marginTop = Instagram.marginTop-vel;

		if(Math.abs(Instagram.marginTop) >= Instagram.imageHeight+Instagram.imageMargin*2){
			Instagram.removeRow();
			Instagram.marginTop = 4;
		}
		Instagram.containerMove.style.marginTop = Instagram.marginTop.toString() + 'px';
		if(loop){
			requestAnimFrame(function(){
				Instagram.moveImages(true);
			});
		}

	},
	resize : function(){
		Instagram.row = Math.floor($(window).width()/(Instagram.imageWidth+Instagram.imageMargin*2));
	},
	removeRow : function() {
		for (var i = 0; i < Instagram.row; i++) {
			$('.itemRemove:first').remove();
		};
		if($('#divImages').children().length < 40){
			Instagram.getImages();
		}
	}
}
window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
 	};
})();
