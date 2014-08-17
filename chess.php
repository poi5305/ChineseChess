<?php


function enter_room()
{
	$room_id = $_GET["room_id"];
	$record_file = "tmp/chess_$room_id";
	if( file_exists($record_file) )
	{
		$record = json_decode(file_get_contents($record_file), true);
		$record["player2"] = $_GET["username"];
		$txt = json_encode($record);
		//shell_exec("echo $txt > $record_file");
		file_put_contents($record_file, json_encode($record)."\n");
		echo '{"player":1}';
	}
	else
	{
		$record = array();
		$record["player1"] = $_GET["username"];
		file_put_contents($record_file, json_encode($record));
		echo '{"player":0}';
	}
}
function go()
{
	$room_id = $_GET["room_id"];
	$record_file = "tmp/chess_$room_id";
	$player = $_GET["player"];
	$msg = "\\\n".$player.":".$_GET["message"];
	system("echo $msg >> $record_file");
}
function wait()
{
	$room_id = $_GET["room_id"];
	$record_file = "tmp/chess_$room_id";
	$player = $_GET["player"];
	$line = shell_exec("tail -n 1 $record_file");
	$line = explode(":", $line);
	if($player != $line[0] && ($line[0]=="0"||$line[0]=="1") )
		echo $line[1];
}


switch($_GET["cmd"])
{
	case "enter_room":
		enter_room();
		break;
	case "go":
		go();
		break;
	case "wait":
		wait();
		break;
}
	
	
?>