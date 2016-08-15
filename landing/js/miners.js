//alert(12);
$.getJSON('etcmining.php',function(d){ //http://139.162.174.10//
	console.log(d);

	var miners = JSON.parse(d);

	console.log(d);
});