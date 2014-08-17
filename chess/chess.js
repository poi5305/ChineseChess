define(	["dojo/_base/declare"
		,"dojo/_base/lang"
		,"chess/chess_piece"
		,"chess/chess_board"
		,"chess/chess_rule"], 
function(declare, lang, piece, board, rule)
{
	return declare([rule], 
	{
		"constructor": function(main_id, log, death)
		{
			console.log("Chinese Chess Obj Created");
			if($("#name").val() == "" || $("#room_id").val() == "")
			{
				$("#"+main_id).html("Please input name and room_id");
				return;
			}
			this.username = $("#username").val();
			this.room_id = $("#room_id").val();
						
			this.j_main = $("#"+main_id);
			this.j_log = $("#"+log);
			this.j_death = $("#"+death);
			
			this.init();
		}
		,username: ""
		,room_id: ""
		,player: 0
		,board: {}
		,pieces: []
		,j_main: {}
		,j_log: {}
		,j_death: {}
		,init: function()
		{
			var thisA = this;
			$.get("chess.php", {cmd:"enter_room", room_id:this.room_id, username:this.username}, function(d)
			{
				console.log(d);
				var obj = JSON.parse(d);
				console.log(d, obj);
				
				thisA.player = obj.player;
				thisA.board = new board(thisA);
				thisA.create_pieces();
				var last_player = 1;
				if(obj.record)
				{
					last_player = thisA.resume(obj.record);
				}
				if(obj.looking)
				{
					thisA.looking(last_player);
					return;
				}
				if(thisA.player == last_player)
				{
					thisA.wait();
				}
			});
		}
		,resume: function(record)
		{
			var last_player = 1;
			for(var i in record)
			{
				var tmp = record[i].split(":");
				var player = last_player = tmp[0];
				var xxyy = tmp[1].split(",");
				if(this.player == player)
					this.piece_move(+xxyy[0], +xxyy[1], +xxyy[2], +xxyy[3]);
				else
					this.piece_move(8-(+xxyy[0]), 9-(+xxyy[1]), 8-(+xxyy[2]), 9-(+xxyy[3]));
			}
			return last_player;
		}
		,go: function(message)
		{
			var thisA = this;
			$.get("chess.php", {cmd:"go", room_id:this.room_id, player: this.player, "message": message}, function(d)
			{
				console.log(d);
				thisA.wait();
			});
		}
		,looking: function(last_player)
		{
			this.status = "wait";
			this.last_player = last_player;
			var thisA = this;
			var waiting = setInterval(function(){
				$.get("chess.php", {cmd:"looking", room_id:thisA.room_id}, function(d)
				{
					if(d != "")
					{
						console.log("looking...finish", thisA.last_player, d );
						var tmp = d.split(":");
						var player = tmp[0];
						var xxyy = tmp[1].split(",");
						if(thisA.last_player == player)
							return;
						console.log("looking...finish2", thisA.last_player , player)				
						if(player == 1)
							thisA.piece_move(8-(+xxyy[0]), 9-(+xxyy[1]), 8-(+xxyy[2]), 9-(+xxyy[3]));
						else
							thisA.piece_move(+xxyy[0], +xxyy[1], +xxyy[2], +xxyy[3]);
						thisA.last_player = player;
						
					}
				});
			},2500); 
		}
		,wait: function()
		{
			this.status = "wait";
			var thisA = this;
			var waiting = setInterval(function(){
				$.get("chess.php", {cmd:"wait", room_id:thisA.room_id, player: thisA.player}, function(d)
				{
					console.log("waiting...", d);
					if(d != "")
					{
						thisA.status = "go";
						console.log("waiting...finish", d);
						clearInterval(waiting);
						var tmp = d.split(",");
						//敵人下棋，座標反轉
						thisA.piece_move(8-(+tmp[0]), 9-(+tmp[1]), 8-(+tmp[2]), 9-(+tmp[3]));
					}
				});
			},2500); 
		}
		,piece_move: function(fmx, fmy, tox, toy)
		{
			console.log(fmx, fmy, tox, toy, this.board.board[tox][toy])
			var piece = this.board.board[fmx][fmy].piece;
			var j_locus = this.board.board[tox][toy].j_locus;
			if(this.board.board[tox][toy].piece && this.board.board[tox][toy].piece.player != piece.player)
				j_locus.data("attack", true);
			//console.log(j_locus.data("attack"));
			this.board.moveIn(undefined, piece, j_locus);
		}
		,log: function(message)
		{
			$("<div>"+message+"</div>").prependTo($(this.j_log));
			
			console.log(message);
		}
		,create_pieces: function()
		{
			for(var piece_type in this.r_pieces)
			{
				for(var pos_idx in this.r_pieces[piece_type].position)
				{
					this.pieces.push( new piece(this, piece_type, 0, this.r_pieces[piece_type].position[pos_idx] ) );
					this.pieces.push( new piece(this, piece_type, 1, this.r_pieces[piece_type].position[pos_idx] ) );
				}
			}
		}
	});
});