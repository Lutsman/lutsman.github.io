	now = new Date();
	$.when(
    $.getJSON('http://139.162.174.10//etcseries.php?a=etc'),
    $.getJSON('http://139.162.174.10//etcseries.php?a=eth')
	).done(function(etc, eth) {
	
		$('.chart2').highcharts({
			chart: {
				type: 'spline'
			},
			title: {
				text: false,
			},
			legend: {
				enabled: true
			},
			tooltip: {
				pointFormat: '',
			},
			credits: {
				enabled: false
			},
			subtitle: {
				text: false,
			},
			xAxis: {
				type: 'datetime',
			
				labels: {
					enabled: false,
				},
				color: 'red',
			  
			},
			
			
			
			tooltip: {
				
				formatter: function () {
					return this.y;
				},
				shared: true
			}, 
			yAxis: [{ 
				//maxPadding: 0.07,
				title: {
					text: 'Value',
					style: {
						color: Highcharts.getOptions().colors[0]
					}
				},
				labels: {
					format: '{value} ETH',
					
				},
				opposite: true
			},{
				//max: 0.01,
				title: {
					text: true
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: 'rgba(255,255,255,0)'
				}]
			}
		
			],
			plotOptions: {
				spline: {
					lineWidth: 2,
					states: {
						hover: {
							lineWidth: 2
						}
					},
				}
			},
			series: [{
				name: 'Ethereum',
				yAxis: 1,
				data: eth[0].price_usd
			},{
				name: 'Classic',
				yAxis: 1,
				data: etc[0].price_usd,
				zIndex: 10
			},{
				name: 'ETC, Volume',
				data: etc[0].volume_usd,
				yAxis: 0,
				type:'column'
			}
			]
		}, function(chart) { });
	});

var dateNow = new Date();


Highcharts.createElement('link', {
    href: 'https://fonts.googleapis.com/css?family=Lato:400,700',
    rel: 'stylesheet',
    type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);


Highcharts.theme = {
    colors: ["rgba(255,255,255,0.3)", "#33cc2f", "gray", "red", "red", "red", "red", "red", "red", "red", "red"],
    chart: {
        backgroundColor: null,
        style: {
            fontFamily: "Lato, serif"
        },
		annotations: [{
			xAxis: 2,
			yAxis: 2,
			
			title: {
				text: "Ann4234234otated chart!"
			}
		  }]
    },
    title: {
        style: {
            color: '#071B33',
            fontSize: '18px',
            fontWeight: 'bold'
        }
    },
    subtitle: {
        style: {
            color: 'black'
        }
    },
    xAxis: {
        gridLineColor: 'rgba(255,255,255,0)',
        labels: {
            style: {
                color: 'rgba(255,255,255,0)'
            }
        },
        lineColor: 'rgba(255,255,255,0)',
        minorGridLineColor: 'rgba(255,255,255,0)',
        tickColor: 'rgba(255,255,255,0)',
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
	},
    yAxis: {
        gridLineColor: 'rgba(255,255,255,0)',
        labels: {
            style: {
                color: '#fff'
            }
        },
        lineColor: 'rgba(255,255,255,0)',
        minorGridLineColor: 'rgba(255,255,255,0)',
        tickColor: 'rgba(255,255,255,0)',
        tickWidth: 1,
        title: {
            style: {
                color: 'rgba(255,255,255,0)'
            }
        }
    },
    legend: {
        itemStyle: {
            fontWeight: 'bold',
            fontSize: '18px'
        }
    },
    tooltip: {
        backgroundColor: '#002C59',
        style: {
            color: '#F0F0F0'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#B0B0B3'
            },
            marker: {
                lineColor: 'rgba(255,255,255,0)'
            },
			connectNulls: true
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: 'white'
        },
        errorbar: {
            color: 'white'
        }
    },
    legend: {
        itemStyle: {
            color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    background2: '#fff'
};


Highcharts.setOptions(Highcharts.theme);
