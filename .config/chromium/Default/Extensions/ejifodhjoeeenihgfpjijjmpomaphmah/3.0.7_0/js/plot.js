function getPieData(stats)
{
    var i, value, time;
    var max = 0;
    var timeCombined = 0;
    var colors = getColorList();
    var data = [];

    for (i in stats)
    {
        value = stats[i];
        if (i < colors.length - 1)
        {
            max = Math.max(max, value[1]);
        }
        else
        {
            timeCombined += value[1];
        }
    }
    max = Math.max(max, timeCombined);

    for (i in stats)
    {
        if (i >= colors.length - 1)
        {
            break;
        }

        value = stats[i];
        time = formatTime(value[1]);
        data.push({
            label: [value[0], time],
            data: value[1],
            color: colors[i]
        });
    }

    if (timeCombined > 0)
    {
        time = formatTime(timeCombined);
        data.push({
            label: [chrome.i18n.getMessage('other'), time],
            data: timeCombined,
            color: colors.pop()
        });
    }

    return data;
}

function drawPieChart(selector, data)
{
    if (data.length == 0)
    {
        drawNoData(selector);
        return;
    }

    var onDashboard = $(selector).parents('#dashboard_category').length > 0;

    var plot = $.plot($(selector), data, {
		series: {
			pie: {
                show: true,
                radius: 1,
                label: {
                    show: true,
                    radius: 2/3,
                    formatter: function(label, series){
                        return '<div style="color: #fff; font-size: 80%;">'+ roundNumber(series.percent, 1) + '%</div>';
                    },
                    threshold: onDashboard ? 0.05 : 0.04
                }
            }
		},
		grid: {
			hoverable: true,
			clickable: true
		},
        legend: {
            show: true,
            labelBoxBorderColor: '#fff',
            position: onDashboard == true ? 'ne' : 'nw',
            margin: 0,
            labelFormatter: function(label, series) {
                if (isValidUrl(label[0]) == true)
                {
                    var tempClass = '';
                    var afterLink = '';
                    if(selector == '.chart_all'){
                        tempClass = 'class="legend_hover" rel="'+label[0]+'"';
                        afterLink = ' <img class="legend_stats" rel="'+label[0]+'" src="images/statistics.png" alt="" />';
                    }
                    return '<a '+tempClass+' href="http://' + label[0] + '" title="' + label[0] + '" target="_blank">' + label[0] + '</a>'+afterLink;
                }
                else
                {
                    return label[0];
                }
            }
        }
	});

    var events = $(selector).data('events');
    if (events == undefined ||
        events['plotclick'] == undefined)
    {
        //TODO xnasobny link
        $(selector).on("plotclick", pieClick);
    }
    if (events == undefined ||
        events['plothover'] == undefined)
    {
        $(selector).on("plothover", function(e,pos,obj){
            pieHover(e,pos,obj);
            //new
            try{
                renderPieTooltip(selector,obj.series.label[0]);
            }catch(e){}
        });
    }

    $(selector).find('.pieLabel').on('mousemove', function(e) {
        var id = $(this).attr('id').substring(8, 10);
        var obj = plot.getData()[id];
        pieHover(null, { pageX: e.pageX, pageY: e.pageY }, { dataIndex: 0, seriesIndex: id, series: { label: obj.label } });
    }).on('click', function(e) {
        var id = $(this).attr('id').substring(8, 10);
        var obj = plot.getData()[id];
        pieClick(null, null, { series: { label: obj.label } });
    });
    
    if(onDashboard == true)
    {
        var table = $(selector).find('table');
        $(selector).find('.legend').attr('style', $(table).attr('style'));
        $(table).css({height: 'auto', width: 'auto'});
        $(selector).find('.legend').children('div:first').remove();
        $(table).css('position', 'static');

        if ($(table).parents('.scrollable').length == 0)
        {
            var h = 285 - $(selector).position().top - parseInt($(selector).css('marginTop'));
            $(table).wrap('<div class="scrollable" style="height: ' + h + 'px" />');
        }
    }
}

function pieClick(event, pos, obj)
{
	if (obj)
    {
        var url = obj.series.label[0];
        if (isValidUrl(url) == true)
        {
            chrome.tabs.create({"url": "http://" + url, "selected":true} );
        }
    }
}

var previousPoint = { series: null, data: null };
function plotHover(textFunction, pos, obj)
{
	if (obj)
    {
        if (previousPoint.series != obj.seriesIndex ||
            previousPoint.data != obj.dataIndex)
        {
            previousPoint.series = obj.seriesIndex;
            previousPoint.data = obj.dataIndex;

            $('#tooltip').remove();

            var text = window[textFunction](obj);
            $('<div id="tooltip">' + text + '</div>').appendTo('body');
        }

        var offset = {
            x: 15,
            y: 15
        };
        var x = pos.pageX + offset.x;
        var y = pos.pageY + offset.y;
        var w = $('#tooltip').outerWidth();
        var documentWidth = $(document).width() - 15;

        if (x + w > documentWidth)
        {
            x = documentWidth - w;
        }

        $('#tooltip').css({top: y, left: x});
    }
    else
    {
        $('#tooltip').remove();
        previousPoint.series = null;
        previousPoint.data = null;
    }
}

function getPieText(obj)
{
    return obj.series.label[0] + '<span>' + obj.series.label[1] + '</span>';
}

function pieHover(event, pos, obj)
{
	plotHover('getPieText', pos, obj);
}

function drawLineTwoAxisChart(selector, data){
    var leftData = data[0];
    var rightData = data[1];

    /*$(selector).parent().find(".buttons_chart").children().each(function(idx, elm){
        $(elm).unbind("click");
        $(elm).click(function(){
            $(this).toggleClass("active");
            var buttons = $(this).parent().children();
            var isTotal = false, isAverage = false;
            $(buttons).each(function(idx, elm){
                var data, yAxis;
                if($(elm).hasClass("total")){
                    isTotal = $(elm).hasClass("active");
                }
                if($(elm).hasClass("average")){
                    isAverage = $(elm).hasClass("active");
                }
            });

            if (isTotal && isAverage) {
                doPlotBoth();
            } else if(isTotal) {
                data = {data: leftData.data, label: leftData.label, color: "blue"};
                yAxis = {alignTicksWithAxis: 1,
                    position: "left",
                    ticks: lineYAxisTicks};
                doPlotOne(data, yAxis);
            } else if(isAverage) {
                data = {data: rightData.data, label: rightData.label, color: "yellow"};
                yAxis = {alignTicksWithAxis: 1,
                    position: "right",
                    ticks: lineYAxisTicks};
                doPlotOne(data, yAxis);
            } else {
                yAxis = {min:0};
                doPlotOne({data: []}, yAxis);
            }
        })
    });*/

    var data, yAxis;
    /*var buttons = $(selector).parent().find(".buttons_chart").children();
    var isTotal = false, isAverage = false;
    $(buttons).each(function(idx, elm){
        var data, yAxis;
        if($(elm).hasClass("total")){
            isTotal = $(elm).hasClass("active");
        }
        isTotal = false;        
        if($(elm).hasClass("average")){
            isAverage = $(elm).hasClass("active");
        }
    });*/

    doPlotBoth();
    data = {data: rightData.data, label: rightData.label, color: "#3366CC"};
    yAxis = {alignTicksWithAxis: 1,
        position: "right",
        ticks: lineYAxisTicks};
    doPlotOne(data, yAxis);
    /*if (isTotal && isAverage) {
        doPlotBoth();
    } else if(isTotal) {
        data = {data: leftData.data, label: leftData.label, color: "blue"};
        yAxis = {alignTicksWithAxis: 1,
            position: "left",
            ticks: lineYAxisTicks};
        doPlotOne(data, yAxis);
    } else if(isAverage) {
        data = {data: rightData.data, label: rightData.label, color: "yellow"};
        yAxis = {alignTicksWithAxis: 1,
            position: "right",
            ticks: lineYAxisTicks};
        doPlotOne(data, yAxis);
    } else {
        yAxis = {min:0};
        doPlotOne({data: []}, yAxis);
    }*/

    function doPlotBoth(){
        var graph = $.plot(selector, [
            { data: leftData.data, label: leftData.label, color: "blue" },
            { data: rightData.data, label: rightData.label, color: "yellow", yaxis: 2 }
          ], {
            bars: {
					     show: true,
					     barWidth: 0.6,
					     align: "center"
				    },
            xaxes: [ {
                mode: "categories",
				        ticks: leftData.xAxis
            } ],
            yaxes: [ {
                min: 0,
                ticks: lineYAxisTicks
            }, {
                // align if we are to the right
                alignTicksWithAxis: 1,
                position: "right",
                ticks: lineYAxisTicks
            } ],
            legend: {
                position: "ne"
            }
        });
        
        var onDashboard = $(selector).parents('#dashboard_category').length > 0;
        if(!onDashboard && (selector == '.chart_months' || selector == '.chart_weekdays')){
            var graphy = 238;
            var graphx = $(selector).offset().left;
            graphx = graphx+20;
            if(selector == '.chart_months'){
                var graphy = 168;
                graphx = graphx - 5;
            }
            var points = graph.getData();
            $('.special_label_days_months').remove();
            for(var k = 0; k < points.length; k++){
              for(var m = 0; m < points[k].data.length; m++){
              	if(points[k].data[m][0] != null && points[k].data[m][1] != null){
              	  if(k == 0){
              		  showTooltip(graphx + points[k].xaxis.p2c(points[k].data[m][0]) - 15, graphy, formatTime(points[k].data[m][1]));
              	  }else{
              		  showTooltip(graphx + points[k].xaxis.p2c(points[k].data[m][0]) - 15, graphy + 16, formatTime(points[k].data[m][1]));
              	  }
              		
              	}
              }
            }
    		    function showTooltip(x,y,contents){
              $('<div class="special_label_days_months">' +  contents + '</div>').css({
                    position: 'absolute',
                    display: 'none',
                    top: y,
                    left: x,
                    color: '#222',
                    'max-width':'60px',
                    'font-size': '11px',
                    'overflow':'hidden',
                    height:'16px'
              }).appendTo("body").fadeIn(200);
            }
        }
    }

    function doPlotOne(dataObj, yAxis){
        $.plot(selector, [dataObj], {
            bars: {
					     show: true,
					     barWidth: 0.6,
               padding: 20,
					     align: "center",
               fill: true,
               fillColor: { colors: [  { opacity: 1}, {opacity: 1 } ] }
				    },
            xaxis: {
                mode: "categories",
				        ticks: leftData.xAxis,
                autoscaleMargin: 0.02
            },
            yaxis: yAxis,
            legend: false
        });
    }
}

function drawLineChart(selector, data)
{
    if (data.length == 0)
    {
        drawNoData(selector);
        return;
    }

    $.plot($(selector), [data], {
        series: {
            lines: {
                show: true
            },
            points: {
                show: data.length == 1
            }
        },
        legend: {
            show: false
        },
        grid: {
			hoverable: true,
            borderWidth: 0
		},
        xaxis: {
            mode: "time",
            timeformat: "%d.%m.%y",
            minTickSize: [1, "day"]
        },
        yaxis: {
            min: 0,
            ticks: lineYAxisTicks
        },
        colors: [ getColorList()[0] ]
    });

    $(selector).on("plothover", lineHover);
}

function lineYAxisTicks(axis)
{
    var i;
    var res = [], step = Math.ceil(axis.max / 10);

    for (i = axis.min; i <= axis.max; i += step)
    {
        res.push([i, formatTimeShortSuffix(i, axis.max)]);
    }

    return res;
}

function lineHover(event, pos, obj)
{
	plotHover('getLineText', pos, obj);
}

function getLineText(obj)
{
    var data = obj.series.data[obj.dataIndex];
    return data[2] + '<span>' + data[3] + '</span>';
}

function drawNoData(selector)
{
    $(selector).html('<p class="no_data">' + chrome.i18n.getMessage('no_data') + '</p>');
}

function drawBarChart(selector, data)
{
    if (data.length == 0)
    {
        drawNoData(selector);
        return;
    }

    var onDashboard = $(selector).parents('#dashboard_category').length > 0;
    var i, xAxisTicks = [];
    for (i in data)
    {
        xAxisTicks.push([i, data[i][onDashboard == true ? 4 : 2]]);
    }

    $.plot($(selector), [data], {
        series: {
            bars: {
                show: true,
                align:'center',
                barWidth: 0.6,
                fillColor: { colors: [ { opacity: 1 }, { opacity: 0.5 } ] }
            }
        },
        legend: {
            show: false
        },
        grid: {
			hoverable: true,
            borderWidth: 0
		},
        xaxis: {
            ticks: xAxisTicks
        },
        yaxis: {
            min: 0,
            ticks: lineYAxisTicks
        },
        colors: [ getColorList()[0] ]
    });

    $(selector).on("plothover", lineHover);
}

//new
var actualPieTooltip;
var lastShowTooltip = 0;
var lastShowTooltipControl = 0;
function renderPieTooltip(selector,url){
    if(actualPieTooltip != url){
        actualPieTooltip = url;
        if(selector == '.chart_all'){
            var ttElm = $(selector).parent().children('.tooltip');
            ttElm.empty().append('<img style="margin:27px 0 0 80px;" src="images/loading.gif">').show(0);
            lastShowTooltip = url;
            $.get('http://'+url,function(data){
                if(data && url==lastShowTooltip){
                    ttElm.empty().append('<p><img style="float:right;" src="http://www.google.com/s2/favicons?domain='+url+'"><strong style="font-size:14px;">'+url+'</strong></p>');
                    try{
                        var title = data.split('<title')[1].split('</title>')[0].split('>')[1];
                        var lang = data.split('lang="')[1].split('"')[0];
                        ttElm.append('<p>'+title+' ('+lang+')</p>');
                    }catch(e){}
                    var visits = getVisits();
                    var timeCount = 0;
                    var daysCount = 0;
                    for(var day in visits){
                        for(var web in visits[day]){
                            if(web == url){
                                daysCount ++;
                                timeCount += visits[day][web];
                            }
                        }
                    }
                    var average = Math.round(timeCount/daysCount);
                    ttElm.append('<p><strong>Total time: '+secondsToHourMinSec(timeCount)+'<br />Days visited: '+daysCount+'<br />Average time: '+secondsToHourMinSec(average)+'</strong></p>');
                }
            });
        }else if(selector == '.chart_domains'){
            var ttElm = $(selector).parent().children('.tooltip');
            ttElm.empty().append('<p><strong style="font-size:14px;">'+url+'</strong></p>').show(0)
            var visits = getVisits();
            var timeCount = 0;
            var daysCount = 0;
            for(var day in visits){
                for(var web in visits[day]){
                    if(web.indexOf('.'+url) != -1){
                        daysCount ++;
                        timeCount += visits[day][web];
                    }
                }
            }
            var average = Math.round(timeCount/daysCount);
            ttElm.append('<p><strong>Total time: '+secondsToHourMinSec(timeCount)+'<br />Days visited: '+daysCount+'<br />Average time: '+secondsToHourMinSec(average)+'</strong></p>');
        }
    }
}