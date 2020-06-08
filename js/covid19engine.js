/**
 * JS to interface with covid 19 tracking API(s).
 * [adapted from my Doomworld API code]
 */
var covid19engine = {
	PROXY_LOCATION : '/proxy/proxycv19_a.php',	
	container : null,
	init : function(container){
		let _container = 'covid19_api_a';
		if(container){
			_container = container;
		}
		
		this.loadCountries(_container);
		this.spinner = document.createElement('img');
		this.spinner.setAttribute('src','/images/spinner.gif');
	},
	
	loadCountries : function(container){
		console.log( container);
		let _url = this.PROXY_LOCATION;
		$('#'+container).find('div.spinner_wrapper').append($(covid19engine.spinner).clone());
		var _container = container;
		console.log(_url);
		$.ajax({
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url : _url
        }).done(function(data){
        	console.log(data);
       		covid19engine.buildCountryLinks(data,_container);
        }).fail(function(a,b,c){
        	console.log(a,b,c);
        });
	},

	buildCountryLinks : function(data, container){
		var _out = "";
		let _sel = document.createElement('select');
		var _ul = document.createElement('ul');
		_ul.setAttribute('class','doombrowser');
		
		console.log(data);
		for(let a=0;a<data.data.length;a++){
			let _opt = document.createElement('option');
			let _li = document.createElement('li');
			var _a1 = document.createElement('a');
			_a1.setAttribute('href',covid19engine.PROXY_LOCATION + "?code=" + data.data[a].code);
			_a1.setAttribute('data-countrycode',data.data[a].code);
			_opt.setAttribute('value',data.data[a].code);
			_opt.setAttribute('data-countrycode',data.data[a].code);
			var _txt = document.createTextNode(data.data[a].name);
			_a1.appendChild(_txt);
			_opt.appendChild(_txt);
			_li.appendChild(_a1);
			_ul.appendChild(_li);
			_sel.appendChild(_opt);
		}
		console.log(_ul);
		console.log(_sel);
		console.log('#'+container + " > div.panel-text")
		var _target = $('#'+container + " > div.panel-text");
		//_target.append(_ul);
		_target.append(_sel);
		$(_target).on('change',function(){
			let _elm = $('#covid19_api select')[0];
			console.log(_elm);
			let _selected = _elm[_elm.selectedIndex].value;
			
			console.log(_selected);
			covid19engine.loadCountryDetails(_selected,container);
		});
		
		this.buildCountryClickHandlers(container);
	},
	
	buildCountryClickHandlers : function(container){
		$('#'+container + " > div.panel-text").find('a').each(function(){
			$(this).click(function(){
				console.log($(this).attr('data-countrycode'));
				covid19engine.loadCountryDetails($(this).attr('data-countrycode'),container);
				return(false);
			});
		});
	},

	loadCountryDetails : function(cc,container){
		/*
		 * AJAX to get details:
		 * */
		
		$.ajax({
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url : covid19engine.PROXY_LOCATION + "?code=" + cc
        }).done(function(data){
       		//call func to build details panel
        	//console.log('#'+container + " > div.panel-text");
        	$('#'+container + " > div.panel-text").empty();
        	//$('#'+container + " > div.panel-text").append(covid19engine.buildCountryDetails(data));
        	
        	//D3 hook:
        	console.log('D3 hook start');
        	//see https://www.tutorialsteacher.com/d3js/create-svg-chart-in-d3js
        	let d3data = data.data.timeline;
        	
        	let width = 1200,
            scaleFactor = 1,
            barHeight = 20;
        	//let graph = d3.select("body").append('svg')
        	let graph = d3.select('#'+container + " > div.panel-text").append('svg')
            .attr("width", width)
            .attr("height", barHeight * d3data.length);

        	console.log(d3data.length);
        	 let bar = graph.selectAll("g")
             .data(d3data)
             .enter()
             .append("g")
             .attr("transform", function(d, i) {
                   return "translate(0," + i * barHeight + ")";
             });
        	
        	 
        	 bar.append("rect")
             .attr("width", function(d) {
            	 console.log(d['recovered']);
                 return d['recovered'] * scaleFactor;
		        })
		        .attr("height", barHeight - 1);
		
		     bar.append("text")
		        .attr("x", function(d) { return (d['recovered']*scaleFactor); })
		        .attr("y", barHeight / 2)
		        .attr("dy", ".35em")
		        .text(function(d) { return d['recovered']; });
		     
		     
		     
        	let _return = document.createElement('div');
        	_return.setAttribute('id','cv19_home');
        	let _txt = document.createTextNode('[Back]');
        	_return.appendChild(_txt);
        	$('#'+container + " > div.panel-text").append(_return);
        	//add handler for return:
        	$('#cv19_home').click(function(){
        		$('#'+container + " > div.panel-text").empty();
        		covid19engine.loadCountries(container);
        	});
        	//then apend a link to go back
        }).fail(function(a,b,c){
        	console.log(a,b,c);
        });
	},
	
	/**
	 * return HTML for dountry details
	 * 
	 * 17052020: Add D3 hooks:
	 *  - 
	 * 
	 * */
	buildCountryDetails : function(data){
		console.log(data);
		
		
		
		//summary:
		let _table1 = document.createElement('table');
		let _thead1 = document.createElement('thead');
		let _th1 = document.createElement('th');
		let _td1a = document.createElement('td');
		
		//quick and dirty...
		let _out = "<h3>"+data.data.name+"</h3>";
		_out += "<h4>Today</h4><ul>";
		_out += "<li>Deaths: "+data.data.today.deaths+"</li>";
		_out += "<li>Confirmed: "+data.data.today.confirmed+"</li>"
		_out += "</ul><h4>Latest data</h4><ul>";
		_out += "<li>Deaths: "+data.data.latest_data.deaths+"</li>";
		_out += "<li>Confirmed: "+data.data.latest_data.confirmed+"</li>";
		_out += "<li>Recovered: "+data.data.latest_data.recovered+"</li>";
		_out += "<li>Critical: "+data.data.latest_data.critical+"</li>";
		_out += "<li>Cases per million: "+data.data.latest_data.calculated.cases_per_million_population+"</li>";
		_out += "</ul><h4>Timeline</h4>";
		if(data.data.timeline.length){
			_out += "<table><thead><tr>"
				+ "<th>Date</th>"
				+ "<th>Deaths</th>"
				+ "<th>Confirmed</th>"
				+ "<th>Active</th>"
				+ "<th>Recovered</th>"
				+ "<th>New</th>"
				+ "<th>New recovered</th>"
				+ "<th>New deaths</th>"
				+ "</tr></thead>";
			for(let a=0;a<data.data.timeline.length;a++){
				_out += "<tbody><tr><td>"+data.data.timeline[a]['date']+"</td>"
					+ "<td>"+data.data.timeline[a]['deaths']+"</td>"
					+ "<td>"+data.data.timeline[a]['confirmed']+"</td>"
					+ "<td>"+data.data.timeline[a]['active']+"</td>"
					+ "<td>"+data.data.timeline[a]['recovered']+"</td>"
					+ "<td>"+data.data.timeline[a]['new_confirmed']+"</td>"
					+ "<td>"+data.data.timeline[a]['new_recovered']+"</td>"
					+ "<td>"+data.data.timeline[a]['new_deaths']+"</td></tr>";
				}
			}
		else{
			_out += "No timeline data found."
		}
		_out += "</tbody></table><div id='cv19_home'>[<a>back</a>]</div>";
		return(_out);
	},
	
	getQuerystring : function(){
		return(window.location.search);
	}
};

