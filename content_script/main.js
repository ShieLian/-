function inBaseUrl(url)
{
	if (document.URL.toLowerCase().indexOf(url.toLowerCase()) < 0)
		return false;
	else
		return true;
}

function override_verifyList()
{
	jQuery("tr").remove('[class!="bg_color02"]');
	jQuery("form#person").remove();
	///html/body/div[4]/div[1]/text()[3]
	var recordline=jQuery("body").children("div.box").children("div:first").text();
	var reg=new RegExp("共[0-9\\s]+条记录");
	var recordline=reg.exec(recordline);
	num=new Number(new RegExp("[0-9]+").exec(recordline));
	jQuery("body").children("div.box").children("div:first").html(recordline);
	// jQuery("#YKTabCon2_10").hide();
	jQuery("h3").after(getSearchForm());
	// jQuery("body").append('<script>'+search.toString()+'</script>');
	jQuery("#search_button").click(search);
}

var infetch=false;
var num=0;
function search(num)
{
	var name=jQuery("#name").val(),school=jQuery("#school").val(),locate=jQuery("#locate").val();
	localStorage["name"]=name;
	localStorage["school"]=school;
	if(locate)
		localStorage["locate"]=locate;
	var url=document.URL.toLowerCase();
	var par=url.substring(url.indexOf('?'),url.length);
	if(!Boolean(localStorage[par]))
	{
		if(infetch) 
			alert("正在抓取，请稍候");
		else 
			fetch(url);
	}
	else display(name,school,locate);
	return false;
}

function display(name,school,locate)
{
	jQuery("#YKTabCon2_10 > tbody > tr[class!=bg_color02]").remove();
	var url=document.URL.toLowerCase();
	var par=url.substring(url.indexOf('?'),url.length);
	var string=localStorage[par+"_data"];
	var list=eval("["+string+"]");
	for(var i=0;i<list.length;++i)
	{
		var record=list[i];
		if(name!="")
			if(record[0]!=name)
				continue;
		if(school!="")
			if(record[2].indexOf(school)==-1&&school.indexOf(record[2])==-1)
				continue;
		if(locate!="")
			if(record[3]!=locate)
				continue;
		append(record);
	}
	
}

function append(record)
{
	tr="<tr><td>"+record[0]+"</td><td>"+record[1]+"</td><td>"+record[2]+"</td><td>"+record[3]+"</td></tr>";
	jQuery("table#YKTabCon2_10").append(tr);
}

function fetch(url)
{
	infetch=true;
	var list=new Array();
	var par=url.substring(url.indexOf('?'),url.length);
	for(var i=0;i<num;i+=30)
	{
		jQuery.get(url+"&start="+i,function f(data){jQuery(data).ready(parse(data,par,list));});
		for(var t=0;t<1000000;++t)
		{
			t+137;
		}
	}
	localStorage[par]=true;
	infetch=false;
}
var parser=new DOMParser();
function parse(data,par,list)
{
	var doc=parser.parseFromString(data,"text/xml");
	var trs=jQuery(data).find("tr[class!=bg_color02]");
	var entry;
	for(var i=0;i<trs.length;++i)
	{
		var tr=trs[i];
		var tds=jQuery(tr).children("td");
		entry=new Array('"'+tds[0].innerHTML+'"','"'+tds[1].innerHTML+'"','"'+tds[2].innerHTML+'"','"'+tds[3].innerHTML+'"').toString();
		entry="["+entry+"]";
		list.push(entry);
	}
	localStorage[par+"_data"]=list.toString();
}


function getSearchForm()
{
	var locate="",name="",school="";
	if(localStorage['locate']!=undefined)
		locate=localStorage['locate'];
	if(localStorage['name']!=undefined)
		name=localStorage['name'];
	if(localStorage['school']!=undefined)
		school=localStorage['school'];
	var table='<table id="serch_field" class="bg_color03" cellspacing=0><tbody><tr>'+
			'<td>姓名：</td> <td><input type="text" id="name" name="name" value="'+name+'"></td>'+
			'<td>学校:</td> <td><input type="text" id="school" name="school" value="'+school+'"></td>'+
			'<td>省市:</td><td><select id="locate" name="locate"><option value="'+locate+'">'+locate+'</option><option value="北京市">北京市</option><option value="浙江省">浙江省</option><option value="天津市">天津市</option><option value="安徽省">安徽省</option><option value="上海市">上海市</option><option value="福建省">福建省</option><option value="重庆市">重庆市</option><option value="江西省">江西省</option><option value="山东省">山东省</option><option value="河南省">河南省</option><option value="湖北省">湖北省</option><option value="湖南省">湖南省</option><option value="广东省">广东省</option><option value="海南省">海南省</option><option value="山西省">山西省</option><option value="青海省">青海省</option><option value="江苏省">江苏省</option><option value="辽宁省">辽宁省</option><option value="吉林省">吉林省</option><option value="台湾省">台湾省</option><option value="河北省">河北省</option><option value="贵州省">贵州省</option><option value="四川省">四川省</option><option value="云南省">云南省</option><option value="陕西省">陕西省</option><option value="甘肃省">甘肃省</option><option value="黑龙江省">黑龙江省</option><option value="香港特别行政区">香港特别行政区</option><option value="澳门特别行政区">澳门特别行政区</option><option value="广西壮族自治区">广西壮族自治区</option><option value="宁夏回族自治区">宁夏回族自治区</option><option value="新疆维吾尔自治区">新疆维吾尔自治区</option><option value="内蒙古自治区">内蒙古自治区</option><option value="西藏自治区">西藏自治区</option></select></td>'+
			'<td><button type="button" id="search_button">查找</button></td>'+
			'</tr></tbody></table>';
	return table;
}

function main()
{
	if(inBaseUrl("gaokao.chsi.com.cn/zzbm/mdgs/detail.action"))
		override_verifyList();
}

jQuery.noConflict();
jQuery(document).ready(main);