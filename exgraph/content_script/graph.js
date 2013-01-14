$(document).ready(function(){
	var graphnum=1;
	var first=true;
	CONTAINER_TEMPLATE = "<!-- Graph Container %d-->	\n"
	+ "	<table style='float: left'>	\n"
	+ "		<tr>					\n"
	+ "			<td class='chart'>	\n"
	+ "			<table>				\n"
	+ "				<tr>			\n"
	+ "					<td>		\n"
	+ "					<div id='graphdiv%d'></div> \n"
	+ "					</td>		\n"
	+ "					<td>        \n" 
	+ "<img id='spinnerette' style='visibility: hidden;' alt='' src='/ex/images/spinner.gif'>"
	+ "					</td>       \n"
	+ "				</tr>			\n"
	+ "				<tr>			\n"
	+ "					<td>		\n"
	+ "					<div id='status%d' \n"
	+ "						style='font-size: 12px; padding-top: 5px; text-align: right;'></div> \n"
	+ "					</td>		\n"
	+ "				</tr>			\n"
	+ "			</table>			\n"
	+ "			</td>				\n"
	+ "		</tr>					\n"
	+ "		<tr>					\n"
	+ "			<td id='EntirePoolInfo%d' class='chart' style='font-size: 12px; visibility: hidden;'>	\n"
	+ "				<b>Entire Pool:</b>&nbsp;&nbsp;&nbsp; Count: &nbsp; <b><font color='red' id='currCount'></font></b> &nbsp;&nbsp; 1 Weeks ago:&nbsp;<font color='green' id='pastCount'> </font> \n"
	+ "			</td>				\n" + "		</tr>					\n" + "	</table>					\n";

	$('#detailsTable a[title="Machine Level Trend"]').parent().append('<a id="addgraph" style="float:right;color:blue;cursor:pointer;">[add]</a>');
	$('#detailsTable #addgraph').click(function(){
	var singleurl=$(this).siblings().eq(0).clone()
	graphnum=graphnum+1;
	$('#graphdiv').append(CONTAINER_TEMPLATE.replace(/%d/g,graphnum.toString()))
	if(first){first=false;}
	getGraphJSON('http://sre.vip.ebay.com/ex/c/trend/graphJSON'+$(this).siblings().eq(0).attr("href"),graphnum)
	$('#EntirePoolInfo'+graphnum).html(singleurl)
	$('#EntirePoolInfo'+graphnum).attr('style','font-size:12px;')
})



function getGraphJSON(graphJSONUrl,graphnum){
	$.ajax( {
		url : graphJSONUrl,
		context : document.body,
		success : function(data, textStatus, jqXHR) {
				var JSON = data;
				var colorObj = ['#11A84B', '#1C1819' ]
				SRE.loadDyGraph_drawGraph(graphnum,JSON.d[0],550,300,function(minDate, maxDate, yRanges) {SRE.queryGraphData(minDate, maxDate);},colorObj);

		},
		error : function(jqXHR, textStatus, errorThrown) {
				//alert('Error: ' + errorThrown);
			}
	});		
}
})
