define(	["dojo/_base/declare"
		, "dojo/_base/lang"], 
function(declare, lang)
{
	return declare(null, 
	{
		constructor: function(parent)
		{
			console.log("Chinese Chess Board Created");
			this.parent = parent;
			this.create_board();
		}
		,current_selected: false
		,parent: {}
		,board: []
		,j_board: {}
		,config: 
		{
			board_h: 0
			,board_w: 0
			,padding_h: 0
			,padding_w: 0
			,cell_h: 0
			,cell_w: 0
			,locus_w: 0
			,locus_h: 0
			,locus_ratio: 0.6
		}
		,select: function(piece)
		{
			this.current_selected = piece;
			var x = piece.position[0];
			var y = piece.position[1];
			var walk = piece.movable;
			
			for(var walk_idx in walk)
			{
				var thisA = this;
				var nx = x + walk[walk_idx][0];
				var ny = y + walk[walk_idx][1];
				var is_attack = walk[walk_idx][2];
				var j_locus = this.board[nx][ny].j_locus;
				if(is_attack)
					j_locus.addClass("chess_locus_attack").data("attack", true);
				else
					j_locus.addClass("chess_locus_movable").data("attack", false);
				j_locus.bind("click", function(e){
					thisA.moveIn(e, thisA.current_selected, $(this));
				});
			}
		}
		,unselect: function(piece)
		{
			this.current_selected = false;
			for(var walk_idx in piece.movable)
			{
				var nx = piece.position[0] + piece.movable[walk_idx][0];
				var ny = piece.position[1] + piece.movable[walk_idx][1];
				this.board[nx][ny].j_locus
				.removeClass("chess_locus_movable")
				.removeClass("chess_locus_attack")
				.data("attack", false)
				.unbind("click");
			}
		}
		,moveIn: function(e, piece, j_locus)
		{
			var msg = (piece.position[0])+","+(piece.position[1])+","+(j_locus.data("x"))+","+(j_locus.data("y"));
			if(e)
				this.parent.go(msg);
			
			if(j_locus.data("attack"))
				piece.attackTo(j_locus);
			else
				piece.moveTo(j_locus);
			
		}
		,create_board: function()
		{
			//console.log(this.parent.j_main.height());
			this.config.board_h = this.parent.j_main.height();
			this.config.board_w = this.parent.j_main.width();
			this.config.padding_h = this.config.board_h/10;
			this.config.padding_w = this.config.board_w/9;
			this.config.cell_h = this.config.board_h/10;
			this.config.cell_w = this.config.board_w/9;
			this.config.locus_h = this.config.cell_h * this.config.locus_ratio;
			this.config.locus_w = this.config.cell_w * this.config.locus_ratio;
			
			this.create_board_cells();
			this.create_board_loci();
		}
		,create_board_cells: function() 
		{			
			this.j_board = $("<div id='chess_board'></div>").appendTo( this.parent.j_main );

			
			this.j_board.height(this.config.board_h - this.config.padding_h);
			this.j_board.width(this.config.board_w - this.config.padding_w);
			
			this.j_board.css("padding-left", (this.config.padding_w/2)  + "px"); // 25
			this.j_board.css("padding-top", (this.config.padding_h/2)  + "px"); // 25
			
			for(var y=8;y>=0;y--)
			{
				if(y == 4)
				{
					var j_cell = $("<div>楚河 漢界</div>").appendTo(this.j_board);
					j_cell
					.addClass("chess_cell")
					.addClass("cell_0_" + y)
					.css("font-size", this.config.cell_h*0.8)
					.css("line-height", this.config.cell_h + "px")
					.width( this.config.cell_w*8 - 2)
					.height( this.config.cell_h -2);
					continue;
				}
				for(var x=0;x<8;x++)
				{
					var j_cell = $("<div></div>").appendTo(this.j_board);
					j_cell
					.addClass("chess_cell")
					.addClass("cell_" + x + "_" + y)
					.width( this.config.cell_w - 2 )
					.height( this.config.cell_h - 2 );
				}
			}
			// 兩條斜線
			var line_w = Math.sqrt( Math.pow(this.config.cell_h*2, 2)+Math.pow(this.config.cell_w*2, 2) );
			var line_left = this.config.cell_w * 3.5 - (line_w - this.config.cell_w * 2) / 2;
			this.create_board_line(line_left, this.config.cell_h * 8.5, line_w);
			this.create_board_line(line_left, this.config.cell_h * 1.5, line_w);
			
			this.create_board_focus_all();
		}
		,create_board_line: function(left, top, width)
		{
			var j_line = $("<div></div>").appendTo(this.j_board);
			j_line
			.addClass("chess_line")
			.addClass("chess_line_45")
			.width(width)
			.css("left", left )
			.css("top", top )
			.clone()
			.appendTo(this.j_board)
			.removeClass("chess_line_45")
			.addClass("chess_line_315");
		}
		,create_board_focus_all: function()
		{
			this.create_board_focus($(".cell_0_1"), [2]);
			this.create_board_focus($(".cell_1_1"), [1]);
			this.create_board_focus($(".cell_6_1"), [2]);
			this.create_board_focus($(".cell_7_1"), [1]);
			
			this.create_board_focus($(".cell_0_2"), [1,4]);
			this.create_board_focus($(".cell_0_3"), [3]);
			
			this.create_board_focus($(".cell_1_2"), [2,3]);
			this.create_board_focus($(".cell_1_3"), [4]);
			
			this.create_board_focus($(".cell_2_2"), [1]);
			this.create_board_focus($(".cell_2_3"), [3]);
			
			this.create_board_focus($(".cell_3_2"), [2]);
			this.create_board_focus($(".cell_3_3"), [4]);
			
			this.create_board_focus($(".cell_4_2"), [1]);
			this.create_board_focus($(".cell_4_3"), [3]);
			
			this.create_board_focus($(".cell_5_2"), [2]);
			this.create_board_focus($(".cell_5_3"), [4]);
			
			this.create_board_focus($(".cell_6_2"), [1,4]);
			this.create_board_focus($(".cell_6_3"), [3]);
			
			this.create_board_focus($(".cell_7_2"), [2,3]);
			this.create_board_focus($(".cell_7_3"), [4]);
			
			
			this.create_board_focus($(".cell_0_7"), [4]);
			this.create_board_focus($(".cell_1_7"), [3]);
			this.create_board_focus($(".cell_6_7"), [4]);
			this.create_board_focus($(".cell_7_7"), [3]);
			
			this.create_board_focus($(".cell_0_5"), [1]);
			this.create_board_focus($(".cell_0_6"), [3,2]);
			
			this.create_board_focus($(".cell_1_5"), [2]);
			this.create_board_focus($(".cell_1_6"), [4,1]);

			this.create_board_focus($(".cell_2_5"), [1]);
			this.create_board_focus($(".cell_2_6"), [3]);
			
			this.create_board_focus($(".cell_3_5"), [2]);
			this.create_board_focus($(".cell_3_6"), [4]);
			
			this.create_board_focus($(".cell_4_5"), [1]);
			this.create_board_focus($(".cell_4_6"), [3]);
			
			this.create_board_focus($(".cell_5_5"), [2]);
			this.create_board_focus($(".cell_5_6"), [4]);
			
			this.create_board_focus($(".cell_6_5"), [1]);
			this.create_board_focus($(".cell_6_6"), [3,2]);
			
			this.create_board_focus($(".cell_7_5"), [2]);
			this.create_board_focus($(".cell_7_6"), [4,1]);
		}
		,create_board_focus: function(p_obj, border_list)
		{
			var cell_h = p_obj.height();
			var cell_w = p_obj.width();
			
			var focus = 
			$("<div></div>")
			.css("margin", (cell_h*0.06) + "px")
			.css("height", (cell_h*0.38-2) + "px")
			.css("width", (cell_h*0.38-2) + "px")
			.css("float", "left")
			.css("border", "1px solid #FFF")
			.clone().appendTo(p_obj)
			.clone().appendTo(p_obj)
			.clone().appendTo(p_obj)
			.clone().appendTo(p_obj)
			
			for(var i in border_list)
			{
				var border_type = border_list[i];
				switch(border_type)
				{
					case 4:
						p_obj.find("div").eq(border_type-1)
						.css("border-right", "1px solid #000")
						.css("border-bottom", "1px solid #000");
						break;
					case 3:
						p_obj.find("div").eq(border_type-1)
						.css("border-left", "1px solid #000")
						.css("border-bottom", "1px solid #000");
						break;
					case 2:
						p_obj.find("div").eq(border_type-1)
						.css("border-right", "1px solid #000")
						.css("border-top", "1px solid #000");
						break;
					case 1:
						p_obj.find("div").eq(border_type-1)
						.css("border-top", "1px solid #000")
						.css("border-left", "1px solid #000");
						break;
				}
			}
		}
		,create_board_loci: function()
		{
			for(var x=0;x<9;x++)
			{
				this.board.push( [] );
				for(var y=0;y<10;y++)
				{
					this.board[x].push({});
				}
			}
			for(var y=9;y>=0;y--)
			{
				for(var x=0;x<9;x++)
				{
					//var j_locus = $("<div>"+ x+","+y +"</div>").appendTo(this.j_board);
					var j_locus = $("<div></div>").appendTo(this.j_board);
					var top = ( (9 - y + (1 - this.config.locus_ratio)/2) * this.config.cell_h);
					var left = ( (x + (1 - this.config.locus_ratio)/2) * this.config.cell_w);
				
					j_locus
					.addClass("chess_loci")
					.addClass("loci_" + x + "_" + y)
					.data("x", x)
					.data("y", y)
					.width( this.config.locus_w )
					.height( this.config.locus_h )
					.css("top", top + "px")
					.css("left", left + "px");
					
					this.board[x][y].j_locus = j_locus;
				}
			}
			
			
		}
		
		
	});
});