//alert(12);
$.getJSON('http://139.162.174.10//etcmining.php',function(d){
	console.log(d);

	var miners = JSON.parse(d);

	console.log(miners);
});