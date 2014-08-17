define(	["dojo/_base/declare"
		,"dojo/_base/lang"
		,"chess/chess_piece"
		,"chess/chess_board"
		,"chess/chess_rule"], 
function(declare, lang, piece, board, rule)
{
	return declare([rule], 
	{
		"constructor": function(main_id, player)
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
			
			this.init();
		}
		,username: ""
		,room_id: ""
		,player: 0
		,board: {}
		,pieces: []
		,j_main: ""
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
				if(thisA.player == 1)
				{
					thisA.wait();
				}
			});
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
						thisA.piece_move((+tmp[0]), (+tmp[1]), (+tmp[2]), (+tmp[3]));
					}
				});
			},2000); 
		}
		,piece_move: function(fmx, fmy, tox, toy)
		{
			console.log(fmx, fmy, tox, toy, this.board.board[tox][toy])
			var piece = this.board.board[fmx][fmy].piece;
			var j_locus = this.board.board[tox][toy].j_locus;
			if(this.board.board[tox][toy].piece && this.board.board[tox][toy].piece.player != piece.player)
				j_locus.data("attack", true);
			console.log(j_locus.data("attack"));
			this.board.moveIn(undefined, piece, j_locus);
		}
		,log: function(message)
		{
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