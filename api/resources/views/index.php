<html>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script>
		
		// $.ajax({
  //                   url:'https://milkingparlor.bharmalsystems.net/api/auth/login',
  //                      // url:'https://dev.bharmalsystems.net/flysky/api/auth/login',
  //                   type:'POST',
  //                   data:{'login_name':'testing.bsd','login_password':'12345678'},
  //                   success:function(result){
  //                      console.log(result);
  //                   }
  //           });



var myUrl = 'https://milkingparlor.bharmalsystems.net/api/auth/login';
var myData = {
  login_name: 'testing.bsd',
  login_password: '12345678'
};
axios.post(myUrl, myData, {
    // headers: {
    //   'Content-Type': 'application/json',
    //   'key': '12345'
    // }
    // other configuration there
  })
  .then(function (response) {
    alert('yeah!');
    console.log(response);
  })
  .catch(function (error) {
    alert('oops');
    console.error('Error details:', error.response || error.message || error);
})
;


//   fetch('https://milkingparlor.bharmalsystems.net/api/', {
//     method: 'GET',
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));

	</script>
</html>