<?php 

?>

 <!DOCTYPE html>
  <html>
    <head>
    <title>留言板</title>
      <!--Import Google Icon Font-->
      <!--<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">-->
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style type="text/css">
		a{
            color:#FF8F00;
        }
         .input-field input[type=text]:focus + label {
     color: #ec8400;
   }
   .input-field input[type=text]:focus {
     border-bottom: 1px solid #ec8400;
     box-shadow: 0 1px 0 0 #ec8400;
   }

		</style>
    </head>
    
    <style>
    
</style>

    <body>
      <!--Import jQuery before materialize.js-->
      <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>

      
      
    <center>
        <form action="doAdd.php" method="post">
            <table width="100%" border="0" cellpadding="0">
                    <td><div class="input-field col d6">
        		  <input placeholder="存放剪贴的内容" type="text" name="content">
					</td>
                    <td style="width: 110px;"><a class="waves-effect waves-light btn amber darken-3"><input type="submit" value="粘上" /></a></td>
                </tr>
            </table>
        </form>
    </center>
