var DATA_JSON = null;
var DATA_LASTSEARCH = "";

function xss(value)
{
	var lt = /</g, 
    gt = />/g, 
    ap = /'/g, 
    ic = /"/g;
	return value.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
}

function showHideItems(obj)
{
	if($(obj.target).parent().find(".directory_shop_items").is(":visible"))
	{
		$(obj.target).text("Afficher les produits");
		$(obj.target).parent().find(".directory_shop_items").slideUp();
	}
	else
	{
		$(obj.target).text("Cacher les produits");
		$(obj.target).parent().find(".directory_shop_items").slideDown();
	}
}

function displayShops()
{
	var display = '';

	DATA_JSON.shops.forEach(function (element)
	{
		display = display + "<div class='directory_shop'>";
		display = display + "<div class='directory_shop_name'>" + xss(element.name) + "</div>";
		display = display + "<div class='directory_shop_type'>" + xss(element.type) + "</div>";
		display = display + "<a class='directory_shop_phone' href='tel://"+ xss(element.phone) +"' target='_blanck'>" + xss(element.phone) + "</a>";

		if (element.web && element.web.length > 0)
			display = display + "<a class='directory_shop_internet' href='http://"+ xss(element.web) +"' target='_blanck'>" + xss(element.web) + "</a>";
		
		display = display + "<div class='directory_shop_delivery'>";
		if (element.zones && element.zones.length > 0)
		{
			element.zones.forEach(function (zone){ display = display + xss(zone); });
		}
		display = display + "</div>";

		if (element.uber && element.web.length > 0)
			display = display + "<div class='directory_shop_uber'>Commande possible via Uber Eats</div>";

		display = display + "<div class='directory_shop_address'>" + xss(element.address) + "</div>";
		

		if (element.items && element.items.length > 0)
		{
			display = display + "<div class='directory_shop_item_button' onclick='showHideItems(event);'>Afficher les produits</div>";
			
			display = display + "<div class='directory_shop_items' style='display:none;'>";
			display = display + "<hr />";
			element.items.forEach(function (item)
			{
				display = display + "<div class='directory_shop_item_price'>" + xss(item.price) + " Euros</div>";
				display = display + "<div class='directory_shop_item_name'>" + xss(item.name) + "</div>";
				if (item.description) display = display + "<div class='directory_shop_item_description'>" + xss(item.description) + "</div>";
			});

			display = display + "</div>";
		}
		
		display = display + "</div>";
	});

	
	display = display + "<div class='directory_shop directory_shop_not_found' style='display:none;'>";
	display = display + "<br />Aucun commerce n'a été trouvé avec vos critères de recherche<br /><br />";
	display = display + "</div>";

	$("#directory_display").html(display);
}


$(document).ready(function()
{
    $("#directory_search").unbind().on("change keyup paste click input", function()
	{
		var search = $("#directory_search").val().trim().toLowerCase();
		if (search != DATA_LASTSEARCH) 
		{
			DATA_LASTSEARCH = search;
			
			var count = 0;
			$(".directory_shop").each(function()
			{
				if ($(this).hasClass('directory_shop_not_found')) return;

				if (search.length == 0)
				{
					count++;
					$(this).slideDown('fast');
				}
				else
				{
					if ($(this).text().toLowerCase().search(search) == -1)
						$(this).slideUp('fast');
					else
					{
						count++;
						$(this).slideDown('fast');
					}
				}
			});
			
			if (count == 0) $(".directory_shop_not_found").show();
			else $(".directory_shop_not_found").hide();
		}
	});
});

//LOAD DATA
$.get("data.json", function(data)
{
	DATA_JSON = data;
	displayShops();
});