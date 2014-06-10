
$(document).on('ready', init1);

function init1(){

	waitForHover();
	reloadBullet();
}

function generateBG(){

	$('body').css({'background-color':'blue'})

}


var toggle =true;

function waitForHover(){

	
		$('#blah').on('mouseover', function(e){

			if(toggle === true){
				$('#blah').html("Let's learn some code");
				toggle=false;
			}
			else{
				$('#blah').html("Phoding");
				toggle=true;
			}

		})


		$('#blah').on('mouseout', function(e){

			$('#blah').html("Hello!");
			

		})
	

	

}


 function reloadBullet(){


        $('body').on('keypress', function(e){

           if(e.keyCode==32){

           	 countIt=false;
            setTimeout(function(){
                countIt=true;
            },1000)

            bulletCount =0;
            countIt=true;
            alert("reloaded!");

           }
        })
    }




