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
			this.j_main = $("#"+main_id);
			this.player = player;
			this.board = new board(this);
			this.create_pieces();
			//this.rule = new rule(this);
			//console.log(this.rule.piece)
			//this.piece = new piece(this, 0);
		}
		,player: 0
		,board: {}
		,pieces: []
		,j_main: ""
		,init: function()
		{
			
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