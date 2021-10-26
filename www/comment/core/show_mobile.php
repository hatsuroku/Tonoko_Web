 <!DOCTYPE html>
  <html>
    <head>
    <title>我的留言板</title>
      <!--Import Google Icon Font-->
      <!--<link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">-->
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style type="text/css">
   		 th{padding:15px 5px;}
   		 tr{padding:15px 5px;}
   		 td{padding:8px 5px;}
		.nui-scroll{
            border: 0px solid #000; 
            width: auto;
            height: 100%;
            overflow: auto;
        }
        .nui-scroll::-webkit-scrollbar {
            width: 10px;
            height: 8px;
        }
        /*正常情况下滑块的样式*/
        .nui-scroll::-webkit-scrollbar-thumb {
            background-color: #bfbdaf;
        }
        /*鼠标悬浮在该类指向的控件上时滑块的样式
        .nui-scroll:hover::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,.1);
        }*/
        /*鼠标悬浮在滑块上时滑块的样式*/
        .nui-scroll::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0,0,0,.1);
        }
        /*正常时候的主干部分*/
        .nui-scroll::-webkit-scrollbar-track {
            background-color: #e1e0d9;
        }
        /*鼠标悬浮在滚动条上的主干部分
        .nui-scroll::-webkit-scrollbar-track:hover {
            background-color: rgba(0,0,0,0);
        }*/
		</style>
    </head>
    <style>
body{background: #FBFAFC;};
</style>
    <body>


      <!--Import jQuery before materialize.js-->
      <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>
    <div class="nui-scroll">
    <center>
    <?php


?>

        <table border="1" width="700">
            <tr>
                <th>留言人</th>
                <th>标题</th>
                <th>内容</th>
                
            </tr>
<br>
            
            <?php

// 获取留言信息，解析后输出到表格中
// 1,从留言liuyan.txt信息文件中获取留言信息
$info = file_get_contents("comment.txt");
// 2,取出留言内容最后的三个@@@符号
$info = rtrim($info, "@");//什么意思

if (strlen($info)>=8){

// 3,以@@@符合拆分留言信息为一条一条的（将留言信息以@@@的符号拆分成留言数组）
$lylist = explode("@@@", $info);
// 4,遍历留言信息数组，对每条留言做再次解析
foreach ($lylist as $key => $value) {
    $ly = explode("##", $value); // 将每条留言信息以##拆分成每个留言字段
    echo "<tr>";
    echo "<td>{$ly[1]}</td>";
    echo "<td>{$ly[0]}</td>";
    echo "<td>{$ly[2]}</td>"; // 字符串截取函数
   // echo "<td><a href='javascript:dodel({$key})'>删除</a></td>";
    // 如何进行链接传值
    echo "</tr>";

    // echo $value."<br>";
}
}
?>

            

        </table>
    </center>
    </div>
</body>
</html>