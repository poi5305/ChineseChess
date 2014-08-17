<?php

$FIELD = array();
///@brief for post method and cmd method
if(isset($_POST["cmd"]))
{
	$FIELD = $_POST;
}
else if(isset($_GET["cmd"]))
{
	$FIELD = $_GET;
}
elseif($argc > 1)
{
	// php this_file.php type=something value=something
	for($i=1;$i<$argc;$i++)
	{
		$tmp_arg = explode("=" , $argv[$i]);
		$FIELD[$tmp_arg[0]] = $tmp_arg[1];
	}
}

$Controller = new Controller($FIELD);





class Chess
{
	var $record_dir = "tmp";
	function Chess()
	{}
	
	function enter_room($room_id, $username)
	{
		$record_file = "{$this->record_dir}/chess_$room_id";
		$record = array();
		// 記錄檔案已經存在
		if(file_exists($record_file))
		{
			$file = FILE($record_file, FILE_IGNORE_NEW_LINES);
			$record = json_decode( array_shift($file) , true);
			if($record["player1"] == $username) // 是第一玩家，回傳記錄
			{
				$r = array("player"=>0, "record"=>$file);
				echo json_encode($r);
			}
			else if(isset($record["player2"])) // 第二玩家已經存在
			{
				if($record["player2"] == $username) // 是第二玩家，回傳記錄
				{
					$r = array("player"=>1, "record"=>$file);
					echo json_encode($r);
				}
				else //是第三玩家，回傳記錄
				{
					$r = array("player"=>0, "record"=>$file, "looking"=>true);
					echo json_encode($r);
				}
			}
			else //第二玩家
			{
				$record["player2"] = $username;
				file_put_contents($record_file, json_encode($record));
				echo '{"player":1}';
			}
		}
		else //第一玩家
		{
			$record["player1"] = $username;
			file_put_contents($record_file, json_encode($record));
			echo '{"player":0}';
		}
	}
	
};


class Controller
{
	// 4 for message, 3 for console log, 2 for warning, 1 for error (die), 0 for slice
	var $debug_level = 1;
	var $OUTPUT_PATH = "../output";
	var $FIELD = array();
	var $CONFIG = array();
	var $Chess;
	
	function Controller($field)
	{
		$this->FIELD = $field;
		$this->check_field();
		$this->CHESS = new Chess();
		
		$this->init();
	}
	public function enter_room()
	{
		//php chess.php cmd=enter_room room_id=100 username=andy
		$room_id = $this->get_field("room_id");
		$username = $this->get_field("username");
		$this->CHESS->enter_room($room_id, $username);
	}
	public function go()
	{
		//php chess.php cmd=go room_id=100 player=0 $message=1,2,2,2
		$room_id = $this->get_field("room_id");
		$player = $this->get_field("player");
		$message = $this->get_field("message");
		$record_file = "tmp/chess_$room_id";
		echo "$room_id $player $message";
		
		$msg = "\n".$player.":".$message;
		file_put_contents($record_file, $msg, FILE_APPEND);
		//shell_exec("echo $msg >> $record_file");
	}
	public function wait()
	{
		$room_id = $this->get_field("room_id");
		$player = $this->get_field("player");
		$record_file = "tmp/chess_$room_id";
		
		$line = $this->get_last_line($record_file);
		//$line = shell_exec("tail -n 1 $record_file");
		$line = explode(":", $line);
		if($player != $line[0] && ($line[0]=="0"||$line[0]=="1") )
			echo $line[1];
	}
	public function looking()
	{
		$room_id = $this->get_field("room_id");
		$record_file = "tmp/chess_$room_id";
		$line = $this->get_last_line($record_file);
		//$line = shell_exec("tail -n 1 $record_file");
		$tmp = explode(",", $line);
		if(count($tmp) == 4)
		{
			echo $line;
		}
	}
	
	private function get_last_line($filename)
	{
		$fp = fopen($filename, "r");
		fseek($fp, 0, SEEK_END); 
		$pos = ftell($fp);
		$LastLine = "";
		while((($C = fgetc($fp)) != "\n") && ($pos > 0)) {
		    $LastLine = $C.$LastLine;
		    fseek($fp, $pos--);
		}
		fclose($fp);
		return trim($LastLine);
	}
	private function init()
	{
		$method = $this->FIELD["cmd"];
		if(! method_exists($this, $method))
		{
		  $this->debug("No CMD method '$method' exist.");
		}
		$this->$method();
	}
	private function get_field($field_name)
	{
		if(! isset($this->FIELD[$field_name]))
		{
			$this->debug("No $field_name.");
		}
		return $this->FIELD[$field_name];
	}
	private function check_field()
	{
		if(count($this->FIELD) == 0)
		{
			$this->debug("No cmds.");
		}
		if(! isset($this->FIELD["cmd"]))
		{
			$this->debug("No CMD control.");
		}
	}
	private function debug($msg, $title="debug", $level=1)
	{
		if($level > $this->debug_level)
			return;
		echo "[Chess][$title][$level] - $msg\n";
		if($level == 1)
			die();
	}
}
	
?>