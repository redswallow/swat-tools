
/*
 * Overriding Dygraph Function
 */

Dygraph.hmsString_ = function(date) {
	var zeropad = Dygraph.zeropad;
	var d = new Date(date);
	return zeropad(d.getHours()) + ":" + zeropad(d.getMinutes());
};
Dygraph.numericTicks = function (H, G, s, c, m) {
    var w = function (i) {
            if (c && c.hasOwnProperty(i)) {
                return c[i]
            }
            return s.attr_(i)
        };
    var I = [];
    if (m) {
        for (var D = 0; D < m.length; D++) {
            I.push({
                v: m[D]
            })
        }
    } else {
        if (c && w("logscale")) {
            var r = w("pixelsPerYLabel");
            var z = Math.floor(s.height_ / r);
            var g = Dygraph.binarySearch(H, Dygraph.PREFERRED_LOG_TICK_VALUES, 1);
            var J = Dygraph.binarySearch(G, Dygraph.PREFERRED_LOG_TICK_VALUES, -1);
            if (g == -1) {
                g = 0
            }
            if (J == -1) {
                J = Dygraph.PREFERRED_LOG_TICK_VALUES.length - 1
            }
            var q = null;
            if (J - g >= z / 4) {
                var F = c.yAxisId;
                for (var p = J; p >= g; p--) {
                    var h = Dygraph.PREFERRED_LOG_TICK_VALUES[p];
                    var t = c.g.toDomYCoord(h, F);
                    var E = {
                        v: h
                    };
                    if (q == null) {
                        q = {
                            tickValue: h,
                            domCoord: t
                        }
                    } else {
                        if (t - q.domCoord >= r) {
                            q = {
                                tickValue: h,
                                domCoord: t
                            }
                        } else {
                            E.label = ""
                        }
                    }
                    I.push(E)
                }
                I.reverse()
            }
        }
        if (I.length == 0) {
            if (w("labelsKMG2")) {
                var l = [1, 2, 4, 8]
            } else {
                var l = [1, 2, 5]
            }
            var K, y, a, z;
            var r = w("pixelsPerYLabel");
            for (var D = -10; D < 50; D++) {
                if (w("labelsKMG2")) {
                    var e = Math.pow(16, D)
                } else {
                    var e = Math.pow(10, D)
                }
                for (var B = 0; B < l.length; B++) {
                    K = e * l[B];
                    y = Math.floor(H / K) * K;
                    a = Math.ceil(G / K) * K;
                    z = Math.abs(a - y) / K;
                    var d = s.height_ / z;
                    if (d > r) {
                        break
                    }
                }
                if (d > r) {
                    break
                }
            }
            if (y > a) {
                K *= -1
            }
            for (var D = 0; D < z; D++) {
                var o = y + D * K;
                I.push({
                    v: o
                })
            }
        }
    }
    var A;
    var v = [];
    if (w("labelsKMB")) {
        A = [1000,1000,1000,1000];
        v = ["K", "M", "B", "T"]
    }
    if (w("labelsKMG2")) {
        if (A) {
            s.warn("Setting both labelsKMB and labelsKMG2. Pick one!")
        }
        A = [1024,1024,1024,1024];
        v = ["k", "M", "G", "T"]
    }
    if (w("labelsSMH")) {
    	if (A) {
    		s.warn("Setting both labelsKMB/labelsKMG2 and labelsSMH. Pick one!")
    	}
    	A = [1000,60,60,1];
    	v = ["ms", "sec", "min","hr"]
    }
    var C = w("yAxisLabelFormatter") ? w("yAxisLabelFormatter") : w("yValueFormatter");
    var x = 0;
    for (var D = 0; D < I.length; D++) {
        x = Math.max(Dygraph.significantFigures(I[D].v), x)
    }
    for (var D = 0; D < I.length; D++) {
        if (I[D].label !== undefined) {
            continue
        }
        var o = I[D].v;
        var b = Math.abs(o);
        var f = (C !== undefined) ? C(o, x) : o.toPrecision(x);
        if (v.length > 0) {
            var u = A[0] * A[1] * A[2] * A[3];
            for (var B = 3; B >= 0; B--, u /= A[B]) {
                if (b >= u) {
                    f = C(o / u, x) + v[B];
                    break
                }
            }
        }
        I[D].label = f
    }
    return {
        ticks: I,
        numDigits: x
    };
};

//Root SRE Object
if(!SRE){
	var SRE = {DateUtils:{},g:[]};
}

SRE.pageId = {
	'HOME' 			: 2046240,
	'ERROR' 		: 2046241,
	'SINGLEERROR' 	: 2046242,
	'EVENT' 		: 2046243,
	'SINGLEEVENT' 	: 2046244,
	'SQL' 			: 2046245,
	'SINGLESQL' 	: 2046246,
	'URL' 			: 2046247,
	'SINGLEURL' 	: 2046248,
	'BUILD' 		: 2046249,
	'PERFMON' 		: 2046250,
	'SUMMARY' 		: 2046577
};
SRE.NO_DATA_FOUND = '<font color="red"><strong>No Graph Data Found for Selected Criteria</strong></font>';
SRE.SMF_COLO_ARR = ["sr-", "rc-", "sq-", "smf"];
SRE.DEN_COLO_ARR = ["ct-", "hr-", "den"];
SRE.PHX_COLO_ARR = ["ph-", "px-", "phx"];
SRE.LAX_COLO_ARR = ["la-" ];
SRE.SLC_COLO_ARR = ["sl-", "slc"];

// converts a json to Dygraph Compatible String
SRE.jsonToDyString = function(json) {

	var gcGraphStr = json.x.c + ',' + json.y.c
			+ (json.ywow ? ',1 week ago' : '') + '\n';

	var len = json.x.v.length;

	for ( var i = 0; i < len; i++) {
		gcGraphStr = gcGraphStr + json.x.v[i] + ',' + json.y.v[i]
				+ (json.ywow ? ',' + (json.ywow.v[i]) : '');

		if (i < len) {
			gcGraphStr = gcGraphStr + '\n';
		}
	}

	if (len == 0) {
		gcGraphStr += '0,0';
	}

	return gcGraphStr;
};
SRE.jsonToDyString2  = function(jsonString) {
	var timeLineLen = jsonString.x.v.length;
	var lbLen = jsonString.y.length;
	//form csv string
	var gcGraphStr = jsonString.x.c + ',';
	$.each(jsonString.y, function(i, lbInfo) {
		if(lbInfo.c.indexOf(jsonString.x.c ) == -1) {
			gcGraphStr = gcGraphStr +  lbInfo.c;
			gcGraphStr = gcGraphStr + ',';
		}
		
	});
	gcGraphStr = gcGraphStr.substring(0, gcGraphStr.lastIndexOf(","));
	gcGraphStr = gcGraphStr + '\n';
	var json = jsonString;
	for(var i = 0; i < timeLineLen ; i++) {
		gcGraphStr = gcGraphStr + json.x.v[i] + ',';
		for(var j = 0;j < lbLen; j++) {
			var yVal = json.y[j].v[i];
			yVal = (yVal == null || yVal == 'null') ? '0' : yVal;
			gcGraphStr = gcGraphStr + yVal + ',';
		}
		gcGraphStr = gcGraphStr.substring(0, gcGraphStr.lastIndexOf(","));
		if(i < timeLineLen) {
				gcGraphStr = gcGraphStr + '\n';
		}
	}
	return gcGraphStr;
};
SRE.jsonToDyString3 = function(jsonString) {
	var timeLineLen = jsonString.d[0].x.v.length;
	var metricsLen = jsonString.d.length;
	var gcGraphStr = jsonString.d[0].x.c;
	
	for(var m = 0; m < metricsLen; m++) {
		gcGraphStr = gcGraphStr + ',' + jsonString.d[m].y.c;
	}
	gcGraphStr = gcGraphStr + '\n';
	
	for(var i = 0; i < timeLineLen; i++) {
		var gcGraphStr =  gcGraphStr + jsonString.d[0].x.v[i];
		for(var m = 0; m < metricsLen; m++) {
			gcGraphStr = gcGraphStr + ',' + jsonString.d[m].y.v[i]; 
		}	                                           
		gcGraphStr = gcGraphStr + '\n';
	}
	return gcGraphStr;
};
SRE.getOverlayColors = function(jsonString) {
 	var overlayColors = new Array();
 	//form csv string
	if(jsonString.c.indexOf("Colocations") != -1) {
		$.each(jsonString.y, function(i, lbInfo) {
			if(lbInfo.c == 'SMF') {
				overlayColors.push('#FF69B4');
			} else if(lbInfo.c == 'DEN') {
				overlayColors.push('#00FF00');
			} else if(lbInfo.c == 'PHX') {
				overlayColors.push('#0000AA');
			} else if(lbInfo.c == 'LAX') {
				overlayColors.push('#7FFF00');
			} else if(lbInfo.c == 'SLC') {
				overlayColors.push('#228B22');
			} else {
				overlayColors.push('#00BBEE');
			}
		});
	} else if(jsonString.c.indexOf("Machines") != -1) {
		$.each(jsonString.y, function(i, lbInfo) {
				var subMachineInfo = lbInfo.c.substr(0, 3);
				if($.inArray(subMachineInfo, SRE.SMF_COLO_ARR) != -1) {
					if($.inArray("#FF69B4", overlayColors) == -1) {
						overlayColors.push('#FF69B4');
					} else if($.inArray("#444444", overlayColors) == -1) {
						overlayColors.push('#444444');
					} else {
						overlayColors.push('#99054F');
					}
				} else if($.inArray(subMachineInfo, SRE.DEN_COLO_ARR) != -1) {
					if($.inArray("#00FF00", overlayColors) == -1) {
						overlayColors.push('#00FF00');
					} else if($.inArray("#66FF66", overlayColors) == -1) {
						overlayColors.push('#66FF66');
					} else {
						overlayColors.push('#039603');
					}
				} else if($.inArray(subMachineInfo, SRE.PHX_COLO_ARR) != -1) {
					if($.inArray("#0000AA", overlayColors) == -1) {
						overlayColors.push('#0000AA');
					} else if($.inArray("#A52A2A", overlayColors) == -1) {
						overlayColors.push('#A52A2A');
					} else {
						overlayColors.push('#6666FF');
					}
				} else if($.inArray(subMachineInfo, SRE.LAX_COLO_ARR) != -1) {
					if($.inArray("#7FFF00", overlayColors) == -1) {
						overlayColors.push('#7FFF00');
					} else if($.inArray("#4D9900", overlayColors) == -1) {
						overlayColors.push('#4D9900');
					} else {
						overlayColors.push('#B3FF66');
					}
				} else if($.inArray(subMachineInfo, SRE.SLC_COLO_ARR) != -1) {
					if($.inArray("#228B22", overlayColors) == -1) {
						overlayColors.push('#228B22');
					} else if($.inArray("#8B008B", overlayColors) == -1) {
						overlayColors.push('#8B008B');
					} else {
						overlayColors.push('#84E184');
					}
				} else {
					if($.inArray("#00BBEE", overlayColors) == -1) {
						overlayColors.push('#00BBEE');
					} else if($.inArray("#DC143C", overlayColors) == -1) {
						overlayColors.push('#DC143C');
					} else {
						overlayColors.push('#66DEFF');
					}
				}
 		});
 	}
	return overlayColors;
};

SRE.togglePerfGraph = function(el) {
	var idStr = el.id.substr(2);
	var index = 1;
	SRE.g[index].setVisibility(parseInt(idStr), el.checked);
	return;
};
SRE.loadPerfmonUnifiedView = function(JSON) {
	//hide graphdivs other than graphdiv0 
	$("div#graphdiv").children("table").each(function(i){
		if(i > 0) {
			$(this).hide();
		}
	});
	//indexes of perf metrics loaded in definite arrays
	var perfCheckedArray = [0,2,4,5,6,8];
	var perfRightSideYArray = [1,2,3,7,8,13];
	var visibleSeries = [true,false,true,false,true,true,true,false,true,false,false,false,false,false,false];
	var index = 1;
	
	var labelCBStr = "<div style=\"width:auto;height:auto;position:relative;\">";
	for(var i = 0; i < JSON.d.length; i++) {
		labelCBStr = labelCBStr + '<div style=\"font-size:12px; font-weight:bold; color:'+perfmonColors[i]+';\">';
		var checked = (perfCheckedArray.indexOf(i) != -1)? "checked": "";
		var label = (perfRightSideYArray.indexOf(i) != -1) ? JSON.d[i].y.c + "<span style=\"color:red;font-size:15px;padding-left:5px;\">*</span>" : JSON.d[i].y.c;
		labelCBStr = labelCBStr + '<input type=\"checkbox\" '+checked+' id=\"cb'+i+'\" onclick=\'SRE.togglePerfGraph(this);\'/>'+label+'</div>';
	}
	labelCBStr = labelCBStr + "</div>";
	labelCBStr = labelCBStr + "<div style=\"width:auto;height:auto;position:relative;\">";
	labelCBStr = labelCBStr + "<span style=\"color:red;font-size:15px;padding-left:5px;\">* - </span><span style=\"color:#777777;font-size:10px;font-weight:bold;pading:5px;\">Aligned with 'RIGHT SIDE Y-AXIS' </span></div>";
	
	$("div#metricFilterBlock").hide();
	var gcGraphStr = SRE.jsonToDyString3(JSON);
	
	if(JSON.d.length > 0) {
		//new code
		SRE.g[index] = new Dygraph(document.getElementById("graphdiv" + index), gcGraphStr, {
			includeZero : false,
			colors : perfmonColors,
			rollPeriod : 1,
			rightGap : 5,
			highlightCircleSize : 3,
			strokeWidth : 1,
			fillGraph : true,
			width : 800,
			height : 300,
			title : JSON.d[0].c.substr(0, JSON.d[0].c.lastIndexOf("-")) + " - Unified View",
			labelsDiv : document.getElementById('status' + index),
			labelsSeparateLines : true,
			hideOverlayOnMouseOut : false,
			drawPoints : true,
			legend : 'always',
			axisLabelFontSize : 11,
			graphIndex : index,
			'Perfmon Error Count' : {
				axis : {
					labelsKMB: true
				}
			},
			'Perfmon JVM Memory Total (MB)' : {
				axis : 'Perfmon Error Count'
			},
			'Perfmon JVM Memory Used (MB)' : {
				axis : 'Perfmon Error Count'
			},
			'Perfmon JVM Memory Available (MB)' : {
				axis : 'Perfmon Error Count'
			},
			'Perfmon JVM Virtual Bytes (MB)' : {
				axis : 'Perfmon Error Count'
			},
			'Perfmon Transaction Time' : {
				axis : 'Perfmon Error Count'
			},
			visibility : visibleSeries,
			axes : {
				y2 : {
					valueRange: [0, 3000]
				}
			},connectSeparatedPoints:true
		});
	} else {
		$('#status'+index).attr('innerHTML', SRE.NO_DATA_FOUND);
	}
	$("div#graphdiv"+index).append(labelCBStr);
	$("div#status"+index).css('height','300');
};
SRE.loadDyGraph_drawGraph = function(iii,grJSON,width1,height1,function1,color1){	
	var labelsKMBflag = true;
	var labelsSMHflag = false;
	
	if (!color1){//default current and wow colors
		color1 = [ '#000088', '#990000' ];
	}
	
	if(grJSON.c.match(/duration/gi)){
		labelsKMBflag = false;
		labelsSMHflag = true;
	}else{
		labelsKMBflag = true;
		labelsSMHflag = false;
	}
	
	var gcGraphStr = SRE.jsonToDyString(grJSON);
	if(grJSON && grJSON.x && grJSON.x.v.length >0){
	SRE.g[iii] = new Dygraph(document.getElementById("graphdiv" + iii), gcGraphStr, {
		includeZero : false,
		rollPeriod : 1,
		rightGap : 5,
		highlightCircleSize : 3,
		colors : color1,
		strokeWidth : 1,
		fillGraph : true,
		width : width1,
		height : height1,
		title : grJSON.c,
		xlabel : grJSON.x.c,
		ylabel : grJSON.y.c,
		labelsDiv : document.getElementById('status' + iii),
		drawPoints : true,
		legend : 'always',
		labelsKMB : labelsKMBflag,
		labelsSMH : labelsSMHflag,
		axisLabelFontSize : 11,
		graphIndex:iii,
		zoomCallback : function1,connectSeparatedPoints:true
	});
	}else{
		$('#status'+iii).attr('innerHTML', SRE.NO_DATA_FOUND);
	}
};

SRE.loadSiteChanges = function(JSON){
	var dtOverride = $('#dtOverride').attr('value');
	if("" == dtOverride){
		//short term solution, populate data type in JSON directly in the future
		var caption = JSON.d[0].c;
		if(caption.indexOf("One Minute") >= 0){
			dtOverride = 0;
		}else if(caption.indexOf("Ten Minute") >= 0){
			dtOverride = 1;
		}else if(caption.indexOf("Hourly") >= 0){
			dtOverride = 2;
		}else if(caption.indexOf("Daily") >= 0){
			dtOverride = 3;
		}
	}
	var url = "http://sjc-vts-220:7080/SiteEventTracker/svc/fetch?pool=" + $('#poolName').attr('value')
		+ "&startDate=" + $('#fromDate').attr('value').replace(/[\s]/g, "+").replace(/[:]/g, "%3A")
		+ "&endDate=" + $('#toDate').attr('value').replace(/[\s]/g, "+").replace(/[:]/g, "%3A")
		+ "&select=lvis&callback=?";
	$.ajax({
		url: url,
		dataType: 'jsonp',
		success: function(data){
			var format = "yyyy-MM-dd HH:mm";
			var annotations = [];
			for(var i=0;i<data.lvisRuleList.length;i++){
				var lvisRule = data.lvisRuleList[i];
				var date = new Date(lvisRule.startTime);
				var dateStr = $.format.date(date, format);
				if(1 == dtOverride){
					dateStr = dateStr.substring(0, dateStr.length-1) + "0";
				}else if(2 == dtOverride){
					dateStr = dateStr.substring(0, dateStr.length-2) + "00";
				}else if (3 == dtOverride){
					dateStr = dateStr.substring(0, dateStr.length-5) + "00:00";
				}
				annotations[i] = {
					series : "Error Count",
					x : dateStr,
					shortText : "L",
					text : "rolloutID:" + lvisRule.rolloutID
				};
			}
			SRE.g[1].setAnnotations(annotations);
		},
		error: function(jqXHR, textStatus, ex) {
			alert(textStatus + "," + ex + "," + jqXHR.responseText);
		}
	});	
};
// Load Graph
SRE.loadDyGraph = function() {
	var jsonString = $('#chartJson')[0].innerHTML;
	var JSON = $.parseJSON(jsonString);
	if(JSON.nograph){ return;}
	
	//SRE.loadSiteChanges(JSON);
	
	var iii=1;
	for (iii = 1; iii <= JSON.d.length; iii++) {
		///alert('plotting'+iii);
		var pageKey = $('#trendType').attr('value').toUpperCase();
		if($('#subType').attr('value'))
			pageKey = $('#subType').attr('value').toUpperCase() + pageKey;
		var colorObj = [ '#284785', '#1C1819' ];
		if(pageKey === 'SQL' || pageKey === 'SINGLESQL') {
			colorObj = ['#11A84B', '#1C1819' ];
		} else if(pageKey === 'EVENT' || pageKey === 'SINGLEEVENT') {
			colorObj = ['#D6185D', '#1C1819' ];
		} else if(pageKey === 'ERROR' || pageKey === 'SINGLEERROR') {
			colorObj = ['#A81D2D', '#1C1819' ];
		}
		if(!JSON.d[iii - 1].y.length) {
			SRE.loadDyGraph_drawGraph(iii,JSON.d[iii-1],550,300,function(minDate, maxDate, yRanges) {SRE.queryGraphData(minDate, maxDate);},colorObj);
		} else {
			SRE.loadLBWiseDyGraph(iii,JSON.d[iii-1]);
		}
	}
};
var perfmonColors = ['#6495ED','#FF4500','#00FF00','#000080','#00FFFF','#DC143C','#7FFF00','#000000','#6495ED','#00FFFF','#FFFF00','#FF0000','#8B008B','#A52A2A','#2E8B57'];
SRE.loadPerfmonPlot = function () {
	var jsonString = $('#chartJson')[0].innerHTML;
	var JSON = $.parseJSON(jsonString);
	var iii=0;
	if(!JSON.d[0].y) {
		alert(JSON.d);
		return;
	}
	for (iii = 1; iii <= JSON.d.length; iii++) {
		if(!JSON.d[iii - 1].y.length) {
			SRE.loadDyGraph_drawGraph(iii,JSON.d[iii-1],800,250,null,[ perfmonColors[iii-1], '#616536' ]);
		} else {
			SRE.loadOverlayPerfmonView(iii,JSON.d[iii-1]);
 		}
 	}
};
var labelArray = new Array();
SRE.loadBuildGraph_drawGraph = function(index, graphCaption, JSON, width, height) {
	if(!JSON || JSON.length===0 || JSON[0].length===0) {
		$('#status'+index).attr('innerHTML', SRE.NO_DATA_FOUND);
		return;
	}
	$('#status'+index).empty();
	var grphDiv = "graphdiv"+index;
	width = !width ? 520 : width;
	height = !height ? 370 : height;
	// construct data array and Label array
	var seriesArray = new Array();
	var currentTime = new Date();
	var offset = currentTime.getTimezoneOffset();
	for (i = 0; i < JSON.length; i++) {
		var labelObject = {
			label : JSON[i].c,
			shadow : false
		};
		for(j=0;j<JSON[i].xy.length;j++)
			JSON[i].xy[j][0] = JSON[i].xy[j][0]+(offset*60000)-(420*60000);
		labelArray.push(labelObject);
		seriesArray.push(JSON[i].xy);
	}
	$.jqplot.config.enablePlugins = true;
	$("#"+grphDiv).empty();
	$("#"+grphDiv).css('height', height);
	$("#"+grphDiv).css('width', width);
	
	plot2 = $.jqplot(grphDiv, seriesArray, {
		height : height,
		width : width,
		seriesColors: colorArr,
		grid : {
			drawGridlines : true,
			background : '#ffffff',
			borderWidth : 0,
			shadow : false
		},
		stackSeries : true,
		legend : {
			show : true,
			location : 's',
			placement : 'outsideGrid',
			marginTop: null,
			marginBottom: null,
			marginLeft: null,
			marginRight: null
		},
		title : graphCaption,
		seriesDefaults : {
			renderer : $.jqplot.BarRenderer,
			rendererOptions : {
			barWidth: null,
			barPadding: 5,
			barMargin: 5,highlightMouseOver:true			
			},
			shadowAngle : 0
		},
		series : labelArray,
		axes : {
			xaxis : {
				renderer : $.jqplot.DateAxisRenderer,
				rendererOptions : {
					tickRenderer : $.jqplot.CanvasAxisTickRenderer
				},

				tickOptions : {
					//formatString : '%b %Y',
					fontSize : '8pt',
					fontFamily : 'Tahoma',
					angle : -45,
					formatString : '%b %#d %R '
				}
			},
			yaxis : {
		          label:'Machine Count',
		          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
		          labelOptions: {
		              fontFamily: 'arial, arial',
		              fontSize: '12px'
		           }
		    }
		},
		cursor : {
			show : true,
			showTooltip : false,
			style : 'normal',
			zoom : true,
			looseZoom : true,
			followMouse : true
		},
		highlighter : {
			tooltipAxes : 'both',
			useAxesFormatters : true,
			formatString : '%s, %s',
			tooltipLocation : 'se'
		}
		
	});
};

SRE.loadJqPlot = function(index) {
	index = !index ? 1 : index;
	// load jqplot into - graphdiv
	// alert('load');
	var jsonString = $('#chartJson')[0].innerHTML;
	var JSON = $.parseJSON(jsonString);
	var graphCaption = JSON.c;
	JSON.d = JSON.d[0];
	SRE.loadBuildGraph_drawGraph(index, JSON.c, JSON.d);
};

SRE.loadRmonGraph = function(index) {
	// draw graphs
	SRE.loadDyGraph();
	
	//Get JSON DATA
	var jsonString = $('#chartJson')[0].innerHTML;
	var JSON = $.parseJSON(jsonString);
	if (JSON.nograph) {
		return;
	}
	
	// init popups
	$("#popupPanel").dialog({
		autoOpen : false,
		height : 300,
		width : 500,
		modal : false,
		closeOnEscape : true,
		title: "More Info"
	});
	
	var showPopup = function(data) {
		var index = this.id.substr(8)-1;		
		$("#popupPanel").dialog('close');
		//$("#popupPanel").dialog('option', 'position',[data.clientX,data.clientY+300]);
		//Set Popup Content
		var baseUrl = location.protocol + "//"+location.host +"/ex/";
		var rows ="";
		rows +="<tr><td>Pool Name</td><td class='bold'><a target='_blank' href='"+baseUrl+"?poolName="+JSON.d[index].poolName+"'><div width='100%'>"+JSON.d[index].poolName+"</div></a></td></tr>";
		$('#poolNameList').attr("disabled","disabled");
		rows +="<tr><td>Build Name</td><td>" +
				"<a target='_blank' href='"+baseUrl+"c/trend?poolName="+JSON.d[index].poolName+"&"+$('form[name="requestForm"]').serialize().replace(/=rmon/g,'=build')+"'>" +
				"<div width='100%'>"+JSON.d[index].buildName+"</div>" +
				"</a></td></tr>";
		rows +="<tr><td>Pool Error Trend</td><td>" +
				"<a target='_blank' href='"+baseUrl+"c/trend?poolName="+JSON.d[index].poolName+"&"+$('form[name="requestForm"]').serialize().replace(/=rmon/g,'=error')+"'>" +
				"<div width='100%'><span class='ui-icon ui-icon-image' ></span></div>" +
				"</a></td></tr>";
		$('#poolNameList').attr("disabled","");
		
		rows +="<tr><td>Rolling Machine Count</td><td>"+JSON.d[index].machineCount+"</td></tr>";
		var tdcontent="";
		for( i=0;i<JSON.d[index].machineList.length;i++){
			
			tdcontent+="<a href='http://"+JSON.d[index].machineList[i]+":8080/admin/v3console/ValidateInternals' target='_blank'>"+JSON.d[index].machineList[i]+"<br/>";
		}
		rows +="<tr><td valign='top'>Machine Names</td><td>"+tdcontent+"</td></tr>";
		var content="<table id='hor-minimalist-b'>" + rows + "</table>";
		$("#popupPanel")[0].innerHTML = content;
		$("#popupPanel").dialog('open');
		
	};

	// Tie Graphs to Popup
	var iii = 1;
	for (iii = 1; iii <= JSON.d.length; iii++) {
		$('#graphdiv' + iii).mouseenter(showPopup);
	}
	//auto Update 
	window.setTimeout(SRE.autoUpdate, 60000);
};

SRE.autoUpdate = function() {
	if($('#autoUpdate').attr('checked')){
		$('#toDate').attr("disabled","diabled");		
		$('#fromDate').attr("disabled","diabled");		
		$('form[name="requestForm"]')[0].submit();		
	}
};

SRE.loadRmonGraph.openTrend = function ( poolName, trendType){
	$('#poolNameList').attr("name","poolName");
	$('#poolNameList').attr("value",poolName);
	$('#trendType').attr("value",trendType);
	$('form[name="requestForm"]')[0].submit();
};

var _initPage = function(eve) {
	SRE.setPoolOwner('/ex/c/trend/poolOwner', 'poolName', 'poolOwner');
	trackFunc();
	_initInputFields();
	var graphType = $('#graphType').attr('value');
	if(graphType){
		eval('SRE.load'+ graphType + '()');
	}else{
		SRE.loadDyGraph();
	}	
		//loading the script and table
	$.getScript('/ex/scripts/jquery.dataTables.js', function() {
		SRE.initTable();
	});
	
	 $('#requestForm').each(function() {
	        $('input').keypress(function(e) {
	            // Enter pressed?
	            if(e.which == 10 || e.which == 13) {
	               SRE.formSubmit();
	            }
	        });
	 });
	
	
};

SRE.initTable = function() {
	var graphType = $('#graphType').attr('value');
	if(graphType){
		if( eval('SRE.load'+ graphType + 'table')){
			eval('SRE.load'+ graphType + 'table()');
		}
	}else{
		SRE.loadDataTable();
	}
};

SRE.loadDataTable = function() {
	// Sorting
	var sortColumnIndex =  $('#sortColumnIndex').attr('value');
	var numericColumnIndices =  $('#numericColumnIndices').attr('value');
	var numberOfColumns =  $('#numberOfColumns').attr('value');
	var formatWithUnit =  $('#formatWithUnit').attr('value');
	var formatWithUnitScale =  $('#formatWithUnitScale').attr('value');
	var columnsArray= new Array();
	if(numberOfColumns!=0 && numberOfColumns!=null){
			for(var i=0;i<numberOfColumns;i++){
				columnsArray.push(null);
			}
			if(numericColumnIndices!=null){
				var splitArray = numericColumnIndices.split(",");
				for(var j=0;j<splitArray.length;j++){
					columnsArray[splitArray[j]-1] = { "sType": 'numeric',"sClass": "right" };
				}
			}
	}
	$('#detailsTable')
	.dataTable(
			{
				"bProcessing" : true,
				"sDom" : '<"H"lipf>rt<"F"lipf><"clear">',
				"bJQueryUI" : true,
				"bDestroy": true,
				"bStateSave":true,
				"fnStateSaveCallback" : function(oSettings, sValue ){
					var newValue = SRE.removeField(sValue, "sFilter");
					return newValue;
				},
				"sAjaxSource" : 'trend/detailJSON',
				"sPaginationType" : "full_numbers",
				"aaSorting" : [ [ sortColumnIndex, "desc" ] ],
				//"aaSorting": [ [0,'desc'], [1,'desc']],
				"aoColumns": columnsArray,
				"iDisplayLength" : 100,
				"sEmptyTable" : "0 records",
				"sSearch" : "Filter:",
				"aLengthMenu" : [ [ 10, 100, 1000, -1 ],[ 10,100, 1000, "Show All" ] ],
				"fnRowCallback" : function(nRow, aData, iDisplayIndex) {
					var thArr = this[0].tHead.firstChild.children;
					for (var i = 0; i < thArr.length; i++) {
						var thisWeekIndex = -1;
						var lastWeekIndex = -1;
						title = thArr[i].firstChild.innerHTML;
						// match here regEX
						if (/1 Week Ago/.test(title) || (/\. wk ago/.test(title))) {
							thisWeekIndex = i - 1;	//the only way for now, need more framework
							lastWeekIndex = i;
						}
						if (thisWeekIndex < 0 || lastWeekIndex < 0) {
							continue;
						}
						var curr = parseFloat(aData[thisWeekIndex]);
						var last = parseFloat(aData[lastWeekIndex]);
						if(formatWithUnit == "true"){
							SRE.formatNumbersWithUnit(curr, last, nRow, thisWeekIndex, lastWeekIndex, aData, formatWithUnitScale);
							continue;
						}
						if (curr > last){
							$('td:eq(' + thisWeekIndex + ')', nRow)
									.html('<font color="#cc0000" ><b>' + aData[thisWeekIndex] + '</b></font>');
						} 
						else if (curr < last){
							$('td:eq(' + lastWeekIndex + ')', nRow)
									.html('<font color="#cc0000" ><b>' + aData[lastWeekIndex] + '</b></font>');
						}
					}
					return nRow;
				},
				"fnServerData" : function(sSource, aoData,
						fnCallback) {
					/* Adding http params */
					var pushParams = function(data, elId) {
						data.push( {
							"name" : $('#' + elId).attr('name'),
							"value" : $('#' + elId).attr('value')
						}); 
					};
					
					pushParams(aoData, 'poolName');
					pushParams(aoData, 'fromDate');
					pushParams(aoData, 'toDate');
					pushParams(aoData, 'wow');
					pushParams(aoData, 'trendType');
					pushParams(aoData, 'subType');
					pushParams(aoData, 'id');
					pushParams(aoData, 'dtOverride');
					pushParams(aoData, 'errorName');
					pushParams(aoData, 'appPoolNameList');
					$.getJSON(sSource, aoData,
							function(json) {
							// update counts
							$("#currCount").attr("innerHTML",json.currTotal);
							$("#pastCount").attr("innerHTML",json.pastTotal);							
							$("#EntirePoolInfo1").attr("style",	"font-size: 12px; visibility: visible;");
							if(json.title){
								$("#summaryPoolTableTitle").attr("innerHTML",json.title);							
							}							
							if(json.aaDetail){
								SRE.divergence.json = json;
							}
							fnCallback(json);
						});
				}
			});
};

SRE.removeField = function(sValue, field){
	var p1 = sValue.indexOf(field);
	if(p1 < 0){
		return sValue;
	}
	p1 += 10;	//length of sFilter":"
	p2 = sValue.indexOf("\"", p1);
	if(p2 < 0){
		return sValue;
	}
	return sValue.substring(0, p1) + sValue.substring(p2);
}

SRE.formatNumbersWithUnit = function(curr, last, nRow, thisWeekIndex, lastWeekIndex, aData, formatWithUnitScale){
	if (curr > last){
		$('td:eq(' + thisWeekIndex + ')', nRow)
				.html('<font color="#cc0000" ><b>' + SRE.formatNumber(aData[thisWeekIndex],  formatWithUnitScale) + '</b></font>');
		$('td:eq(' + lastWeekIndex + ')', nRow)
				.html(SRE.formatNumber(aData[lastWeekIndex], formatWithUnitScale));
	} 
	else if (curr < last){
		$('td:eq(' + lastWeekIndex + ')', nRow)
				.html('<font color="#cc0000" ><b>' + SRE.formatNumber(aData[lastWeekIndex],  formatWithUnitScale) + '</b></font>');
		$('td:eq(' + thisWeekIndex + ')', nRow)
				.html(SRE.formatNumber(aData[thisWeekIndex], formatWithUnitScale));
	}
	else{
		$('td:eq(' + lastWeekIndex + ')', nRow)
				.html(SRE.formatNumber(aData[lastWeekIndex], formatWithUnitScale));
		$('td:eq(' + thisWeekIndex + ')', nRow)
				.html(SRE.formatNumber(aData[thisWeekIndex], formatWithUnitScale));
	}	
};

SRE.formatNumber = function(value, formatWithUnitScale){
	var threshold = formatWithUnitScale * 1000 * 1000;
	if(value > threshold){
		return Math.floor(value / (1000 * 1000)) + " M";
	}
	threshold = formatWithUnitScale * 1000;
	if(value > threshold){
		return Math.floor(value / 1000) + " K";
	}
	return value;
};

var colorArr = [ '#A8FF57', '#2728FF', '#A52A2A', '#F13F5C', '#BCE5FF','#953579', '#4b5de4', '#d8b83f', '#ff5800', '#0085cc', '#4B4C67'];
SRE.loadBuildTable = function() {
	$('#detailsTable').dataTable({"fnDrawCallback": function ( oSettings ) {
			if ( oSettings.aiDisplay.length == 0 )
			{
				return;
				
			}
			
			var nTrs = $('tbody tr', oSettings.nTable);
			var iColspan = nTrs[0].getElementsByTagName('td').length;
			var sLastGroup = "";
			
			for ( var i=0 ; i<nTrs.length ; i++ )
			{
				var iDisplayIndex = oSettings._iDisplayStart + i;
				var sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData[0];
				var buildColor;
				var uncolored = 0;
				if ( sGroup != sLastGroup )
				{
					var buildLabel = sGroup.split('|')[0];
					var trimmedBuildLabel = buildLabel.replace(/\./g,"_");
					var nGroup = document.createElement( 'tr' );
					var nCell = document.createElement( 'td' );
					nCell.colSpan = iColspan;
					nCell.style.fontWeight = "bold";
					nCell.appendChild(document.createTextNode(sGroup));
					
					var machineCount = sGroup.split('|')[1];
					for(var j=0;j<labelArray.length;j++){
						if(buildLabel==labelArray[j].label) {
							buildColor = colorArr[j];
							break;
						}
						if(j+1==labelArray.length) {
							buildColor = colorArr[labelArray.length+(uncolored)];
							uncolored++;
						}
					}
					nCell.innerHTML =  '<h4 style="text-align:left;font-size:12px;font-color: #000000;font-family: arial;background:#E5E5E5" class="ui-state-default">'+"<img src='../images/expand_arrow.png' onclick='javascript: SRE.toggleVisiblity( \"" +     trimmedBuildLabel + "\", this)'>"+'&nbsp;&nbsp;&nbsp;<input disabled="disabled" style="width:12px;height:8px;border:1px solid white;background:'+buildColor+'"/>&nbsp;'+buildLabel+' ('+machineCount+' machines)&nbsp;&nbsp;&nbsp;</h4>';
					nGroup.appendChild( nCell );
					nTrs[i].parentNode.insertBefore( nGroup, nTrs[i] );
					sLastGroup = sGroup;
					trimmedLastGroup = trimmedBuildLabel;
				}
				nTrs[i].style.display = '';
				if(nTrs[i].className.indexOf(trimmedLastGroup) == -1){
					nTrs[i].className = nTrs[i].className + ' ' + trimmedLastGroup;
				}
			    
			}
		},
		"bProcessing" : true,
		"bSort": false,
		"bPaginate": false,
		"bDeferRender": true,
		"bInfo": false,
		"aoColumnDefs": [
			{ "bVisible": false, "aTargets": [ 0 ] }
		],
		"aLengthMenu" : [ [10, 100, 1000, -1],[ 10, 100, 1000, "Show All" ] ],
		"iDisplayLength" : -1,
		"sDom" : '<"H"lipf>rt<"F"lipf><"clear">'
	});
};


SRE.toggleVisiblity = function (className, img){
	var rows = $('#detailsTable').find('.'+className);
	var hiddenClassName = 'ui_hidden'; 
	if(img.src.indexOf("collapse") == -1){				
		img.src='../images/collapse_arrow.png';
	}else{				
		img.src='../images/expand_arrow.png';
	}
	rows.toggle();
	return ;
};

SRE.loadJqPlottable = function() {
	var currentURL = (window.location.href).replace("trend", "trend/detailJSON");
	$.getJSON(currentURL,
			function(data) {
			// update counts
			var table = document.getElementById("detailsTable");
		    var tbody = table.getElementsByTagName("tbody");
		   if(tbody.length==0) {
		    	tbody = new Array();
		    	tbody[0] = document.createElement("TBODY");
		    	table.appendChild(tbody[0]);
		    }
		   var rowArray = new Array();
		   var uncolored = 0;
		    for(var i=0;i<data.buildLabel.length;i++) {
				var buildName = data.buildLabel[i].split("|")[0];
				var machineCount = data.buildLabel[i].split("|")[1];
				var k;
				for(k=0;k<labelArray.length;k++){
					if(buildName==labelArray[k].label) {
						rowArray[k] = new Array();
						break;
					}
					if(k+1==labelArray.length) {
						k += uncolored;
						uncolored++;
					}
				}
				for(var j=0;j<data.aaData[i].length;j++) {
					rowArray[k][j] = document.createElement("TR");
					var td1 = document.createElement("TD");
					var td2 = document.createElement("TD");
					var td3 = document.createElement("TD");
					var td4 = document.createElement("TD");
					td1.appendChild(document.createTextNode(buildName+'|'+machineCount));
					td3.innerHTML = '<div style="margin:0px 0px 0px 150px">'+data.aaData[i][j]+'</div>';
					rowArray[k][j].appendChild(td1);
					rowArray[k][j].appendChild(td2);
					rowArray[k][j].appendChild(td3);
					rowArray[k][j].appendChild(td4);
				}
			}
		    for(var i=rowArray.length-1;i>=0;i--)
		    	for(var j=0;rowArray[i] && j<rowArray[i].length;j++)
		    	tbody[0].appendChild(rowArray[i][j]);
		    $("div#DynamicTable table#detailsTable th").addClass('ui-state-default');
		    					
		    $("div#DynamicTable table#detailsTable th:nth-child(4)").css('color','#888888')
		     														 .css('font-size','11px')
		     														 .css('text-align','right');
		     														 		    
		    //$("div#DynamicTable table#detailsTable").css('border','url("images/ui-bg_highlight-soft_75_dddddd_1x100.png") repeat-x scroll 50% 50% #DDDDDD');
		    SRE.loadBuildTable();
		    
	});
	
};

var _initInputFields = function() {
	/*jQuery('#fromDate').datetimepicker( {
	dateFormat : 'yy-mm-dd',
	timeFormat: 'hh:mm',
	ampm: false
	});
	jQuery('#toDate').datetimepicker( {
		dateFormat : 'yy-mm-dd',
		timeFormat: 'hh:mm',
		ampm: false
	});
	*/
	Calendar.setup({
		trigger    : "fromDate",
		inputField : "fromDate",
		showTime   : 24,
		dateFormat : "%Y-%m-%d %H:%M",
		onSelect   : function() {this.hide();},
		animation  : false,
		onTimeChange: function(){
			this.refresh();
	        var a = this.inputField,
	            b = this.selection;
	        if (a) {
	            var c = b.print(this.dateFormat);
	            /input|textarea/i.test(a.tagName) ? a.value = c : a.innerHTML = c;
	        }
		}
	});

	Calendar.setup({
		trigger    : "toDate",
		inputField : "toDate",
		showTime   : 24,
		dateFormat : "%Y-%m-%d %H:%M",
		onSelect   : function() {this.hide();},
		animation  : false,
		onTimeChange: function(){
			this.refresh();
	        var a = this.inputField,
	            b = this.selection;
	        if (a) {
	            var c = b.print(this.dateFormat);
	            /input|textarea/i.test(a.tagName) ? a.value = c : a.innerHTML = c;
	        }
		}
		});

	$("button").button();
	
	//init auto complete
	var data = $("#poolNameList")[0].value.split(" ");
	$("#poolName").autocomplete({source: data,max:10});
};

SRE.validateForm = function(form) {
	var result = undefined;
	// validate date
	fromTime = SRE.DateUtils.getDate(form.fromDate.value);
	toTime = SRE.DateUtils.getDate(form.toDate.value);
	if (fromTime > toTime) {
		result = "To Date is earlier than From Date.";
	}
	//errorName = form.errorName.value;
	dataType = $('#dtOverride').attr('value');
	delta = toTime - fromTime;
	if (dataType === '0' && delta > (3600000 * 12)) {
		result = "For One Min granularity, Date rage should be less than 12 hrs.";
	}
	if (dataType === '1' && delta > (3600000 * 24 * 2)) {
		result = "For Ten Min granularity, Date rage should be less than 2 days.";
	}
	if (dataType === '2' && delta > (3600000 * 24 * 15)) {
		result = "For Hourly granularity, Date rage should be less than 15 days.";
	}
	return result;
};

SRE.formSubmit = function(deltaHour, deltaDay) {
	var validateResults = SRE.validateForm($('form[name="requestForm"]')[0]);
	if ( !validateResults ) {
		if (deltaHour) {
			toDateEl = $('#toDate')[0];
			fromDateEl = $('#fromDate')[0];
			toDateEl.value = SRE.DateUtils.addDelta(toDateEl.value, 3600000 * deltaHour);
			fromDateEl.value = SRE.DateUtils.addDelta(fromDateEl.value, 3600000 * deltaHour);
		}
		if (deltaDay) {
			toDateEl = $('#toDate')[0];
			fromDateEl = $('#fromDate')[0];
			toDateEl.value = SRE.DateUtils.addDelta(toDateEl.value, 3600000 * 24 * deltaDay);
			fromDateEl.value = SRE.DateUtils.addDelta(fromDateEl.value, 3600000 * 24 * deltaDay);
		}
		$("#spinnerette").attr("style", "visibility: visible;");
		$.cookie('visitedPoolName',$('#poolName').attr('value'));		
		if(window.location.search.indexOf("trendType=perfmon") != -1) {
			doOnPerfmonFilter();
	 		return;
 		}
		if(window.location.search.indexOf("trendType=application") != -1) {
			doOnApplicationFilter();
	 		return;
 		}
		$('form[name="requestForm"]')[0].submit();
	}else{
		alert(validateResults);
	}
};


SRE.queryGraphData = function(fromDate, toDate) {
	if ($('#dynaZoom').attr("checked")) {
		if (fromDate == SRE.queryGraphData.currDateRange.fromDate
				&& toDate == SRE.queryGraphData.currDateRange.toDate) {
			SRE.loadDyGraph();
		} else {
			$("#spinnerette").attr("style", "visibility: visible;");
			$('#fromDate').attr('value', SRE.DateUtils.getDateString(fromDate));
			$('#toDate').attr('value', SRE.DateUtils.getDateString(toDate));
			$('#dtOverride').attr('value', '');
			SRE.queryGraphData.currDateRange = {
				'fromDate' : fromDate,
				'toDate' : toDate
			};
			$.ajax( {
				url : "/ex/c/trend/graphJSON?" + $("#requestForm").serialize(),
				context : document.body,
				success : function(data, textStatus, jqXHR) {
					var jsonString = data;
					//var JSON = $.parseJSON(jsonString);
					var JSON = jsonString;
					for( i=1;i<=JSON.d.length;i++){
						grJSON = JSON.d[i-1];
						var gcGraphStr = "";
						if(!JSON.d[i - 1].y.length) {
							gcGraphStr = SRE.jsonToDyString(grJSON);
						} else {
							gcGraphStr = SRE.jsonToDyString2(grJSON);
						}
						SRE.g[i].updateOptions({
								file : gcGraphStr,
								dateWindow : [ fromDate, toDate ],
								title : grJSON.c
						});
						$("#spinnerette").attr("style", "visibility: hidden;");
					};
					
					//refresh detail table
					SRE.initTable();
					return data;
				},
				error : function(jqXHR, textStatus, errorThrown) {
					//alert('Error: ' + errorThrown);
				}
			});
		}
	}
};
SRE.queryGraphData.currDateRange ={};

function trackFunc(pageKey) {
	_rover.setAppId(1156);
	if(! pageKey){
		// Page Impression
		pageKey = $('#trendType').attr('value').toUpperCase();
		if($('#subType').attr('value')){
			pageKey = $('#subType').attr('value').toUpperCase() + pageKey;
		}
	}
	var pageImpEvent= SRE.pageId[pageKey];//2044893;
	var impEvt=_rover.createPageImpEvent(pageImpEvent);
	impEvt.setLVTrk(true);
	ebayLVTr.setPageImpEvent(pageImpEvent);
	_rover.track();
};

SRE.loadLBWiseDyGraph = function(index, jsonString) {
	var gcGraphStr = SRE.jsonToDyString2(jsonString);
	var lbColorArr = [ '#700A69', '#616536' , '#E70000', '#2E7378', '#73187B', '#0000CC' ];
	var coloColorArr =  [ '#0A6970', '#616536' , '#E70000', '#006500', '#909000', '#0000CC' ];
	                      
	if(jsonString && jsonString.x && jsonString.x.v.length >0) {
		SRE.g[index] = new Dygraph(document.getElementById("graphdiv" + index), gcGraphStr, {
			includeZero : false,
			rollPeriod : 1,
			rightGap : 5,
			highlightCircleSize : 3,
			colors : (jsonString.c.toLowerCase().indexOf("colo") != -1) ? coloColorArr : lbColorArr,
			strokeWidth : 1,
			fillGraph : true,
			width : 550,
			height : 300,
			title : jsonString.c,
			xlabel : jsonString.x.c,
			ylabel : "Url Count",
			labelsDiv : document.getElementById('status' + index),
			labelsSeparateLines : true,
			hideOverlayOnMouseOut : false,
			drawPoints : true,
			legend : 'always',
			labelsKMB : true,
			axisLabelFontSize : 11,
			graphIndex:index,
			zoomCallback : function(minDate, maxDate, yRanges) {
				SRE.queryGraphData(minDate, maxDate);
			},connectSeparatedPoints:true
		});
	} else {
		$('#status'+index).attr('innerHTML', SRE.NO_DATA_FOUND);
	}
};

SRE.toggleGraph = function(inputCBElement) {
	if($(inputCBElement).attr("id") == 'url_cb') {
		$('div#graphdiv table:eq(0)').toggle();
	}
	if($(inputCBElement).attr("id") == 'urllb_cb') {
		$('div#graphdiv table:eq(2)').toggle();
	}
	if($(inputCBElement).attr("id") == 'urlcolo_cb') {
		$('div#graphdiv table:eq(4)').toggle();
	}
	if($(inputCBElement).attr("id") == 'urlselectall_cb') {
		SRE.selectAllUrlTypeTrends(inputCBElement);
		if($(inputCBElement).attr("checked")) {
			$('div#graphdiv table:eq(0)').show();
			$('div#graphdiv table:eq(2)').show();
			$('div#graphdiv table:eq(4)').show();
		} else {
			$('div#graphdiv table:eq(0)').hide();
			$('div#graphdiv table:eq(2)').hide();
			$('div#graphdiv table:eq(4)').hide();
		}
	}
};

SRE.selectAllUrlTypeTrends = function(checkboxele) {
	if($(checkboxele).attr("checked")) {
		$("input#url_cb").attr("checked", true);
		$("input#urlcolo_cb").attr("checked", true);
		$("input#urllb_cb").attr("checked", true);
	} else {
		$("input#url_cb").attr("checked", false);
		$("input#urlcolo_cb").attr("checked", false);
		$("input#urllb_cb").attr("checked", false);
	}
};

SRE.divergence = {};
SRE.divergence.detail = function(key){
	var buildRow = function (json){
		var row = "<tr>";
		if(json ){
			for(i=0;i<json.length;i++){
				row+="<td>" + json[i] + "</td>";
			}
		}
		return row+"</tr>\n";
	};
	if(SRE.divergence.json.aaDetail[key]){
		var content = buildRow(SRE.divergence.json.aaDetail[key][0]);
		if(SRE.divergence.json.aaDetail[key].length>1){
			for(i=1;i< SRE.divergence.json.aaDetail[key].length;i++){
				content +=buildRow(SRE.divergence.json.aaDetail[key][i]);
			}
		}
		content="<table id='hor-minimalist-b'><tr><th>Build Name</th><th>GC</th><th>CPU</th><th>Memory</th></tr>" + content + "</table>";
	$("#popupPanel")[0].innerHTML = content;
		
	$("#popupPanel").dialog( {
		autoOpen : false,
		height : 300,
		width : 600,
		modal : true,
		closeOnEscape : true,
		position : 'center'
		
	});
	
	$('#popupPanel').dialog('open');
	//alert(key);
	}

};
SRE.loadOverlayPerfmonView = function(index, jsonString) {
	var overlayColors = SRE.getOverlayColors(jsonString); 
	var gcGraphStr = SRE.jsonToDyString2(jsonString);
	var title = jsonString.c;
	var yLabel = title.substring(title.lastIndexOf("-") + 1);
	if(jsonString && jsonString.x && jsonString.x.v.length > 0) {
		SRE.g[index] = new Dygraph(document.getElementById("graphdiv" + index), gcGraphStr, {
			includeZero : false,
			rollPeriod : 1,
			rightGap : 5,
			highlightCircleSize : 3,
			colors : overlayColors,
			strokeWidth : 1,
			fillGraph : true,
			width : 800,
			height : 250,
			title : title,
			xlabel : jsonString.x.c,
			ylabel : yLabel,
			labelsDiv : document.getElementById('status' + index),
			labelsSeparateLines : true,
			hideOverlayOnMouseOut : false,
			drawPoints : true,
			legend : 'always',
			labelsKMB : true,
			axisLabelFontSize : 11,
			graphIndex:index,
			zoomCallback : function(minDate, maxDate, yRanges) {
				SRE.queryGraphData(minDate, maxDate);
			}
		});
	} else {
		$('#status'+index).attr('innerHTML', SRE.NO_DATA_FOUND);
	}
	return;
};
