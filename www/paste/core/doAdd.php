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
</style>
<body>
      <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>
    <?php

include 'menu.php'; // 导入网站的导航栏
?>

<br>
        <?php
// 执行留言信息添加操作

// 1.获取要添加的留言信息，并且补上其他辅助消息（IP地址，添加时间）
$title = $_POST['title']; // 获取留言标题
$author = $_POST["author"]; // 获取留言者
$content = $_POST["content"]; // 留言内容
$ip = $_SERVER["REMOTE_ADDR"]; // IP地址
$biscuit = substr(sha1($ip), 0, 8); //8位哈希值饼干
$addtime = time(); // 添加时间 （时间戳的格式）

// 2.拼装（组装）留言信息
$ly = "{$title}##{$author}##{$content}##{$ip}##{$addtime}##{$biscuit}@@@";

// 3.将留言信息追加到liuyan.txt文件中

$info = file_get_contents("comment.txt"); // 获取所有以前的留言
file_put_contents("comment.txt", $ly . $info); // 覆盖式的写入，会对原有数据进行覆盖

// 4.输出留言成功
echo "<h6>提交成功</h6>";

?> 

</body>

<script language="javascript">
parent.location.reload();
window.parent.location.href='../index.html';
</script>


</html>