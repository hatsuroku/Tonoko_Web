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
    </head>
    
    <style>
body{background: #FBFAFC;};
</style>

    <body>
      <!--Import jQuery before materialize.js-->
      <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>

      
      
    <center>
        <form action="doAdd.php" method="post">
            <table width="380" border="0" cellpadding="4">
                <tr>
                    <td>
                    <div class="input-field col s6">
       				   <input id="last_name" type="text" name="title">
      					    <label for="last_name">标题</label>
      				  </div>
      			    </td>
                </tr>
                <tr>
                    <td>
                    <div class="input-field col s6">
       				   <input id="last_name"" type="text" name="author">
      					    <label for="last_name">留言者</label>
      				  </div>
      			    </td>
                </tr>

                <tr>
                    <td>
                    <div class="input-field col s6">
       				   <input id="last_name" type="text" name="content">
      					    <label for="last_name">留言内容</label>
      				  </div>
      			    </td>
                </tr>

                <tr>
                    <td colspan="2" align="center">
<br>
                    <a class="waves-effect waves-light btn"><input type="submit" value="提交" /></a>&nbsp;
                    <a class="waves-effect waves-light btn"><input type="reset" value="重置" /></a></td>
                </tr>
            </table>
        </form>
    </center>
