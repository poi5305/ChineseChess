define(	["dojo/_base/declare"
		,"dojo/_base/lang"], 
function(declare, lang)
{
	return declare(null, 
	{
		constructor: function(parent, piece_type, player, position)
		{
			console.log("Chinese Chess Piece Created");
			this.parent = parent;
			this.piece_type = piece_type;
			this.rule = this.parent.r_pieces[piece_type];
			this.player = player;
			this.position = position;
			
			this.create_piece();
		}
		,is_selected: false
		,position: []
		,player: 0
		,rule: {}
		,parent: {}
		,piece_type: 0
		,movable: []
		,j_piece: {}
		,create_piece: function()
		{
			var thisA = this;
			var x = this.player == this.parent.player ? this.position[0]: 8-this.position[0];
			var y = this.player == this.parent.player ? this.position[1]: 9-this.position[1];
			this.position = [x, y];
			var j_piece = this.j_piece = $("<div><div>").appendTo(this.parent.board.board[x][y].j_locus);
			
			j_piece
			.addClass("chess_piece")
			.addClass("chess_player_" + this.player)
			.css("font-size",  Math.min(j_piece.height(), j_piece.width())*0.8)
			.css("line-height", j_piece.height()+"px")
			.html(this.rule.name[this.player])
			.bind("click", function(e){
				thisA.click_event(e);
			});
			
			this.parent.board.board[x][y].piece = this;
		}
		,click_event: function(e)
		{
			if(this.parent.status == "wait")
				return;
			//都還沒選
			if(this.parent.board.current_selected == false)
			{
				if(this.player != this.parent.player)
					return;
				this.select();
			}
			else
			{
				//已經選了自己，然後選自己其他
				if(this.player != this.parent.player)
					return;
				this.parent.board.current_selected.unselect();
				this.select();
			}
			//已經選了自己，然後選能走的位置
			
		}
		,select: function()
		{
			this.j_piece.addClass("chess_piece_selected");
			this.calculate_movable();
			this.parent.board.select(this);
		}
		,unselect: function()
		{
			this.j_piece.removeClass("chess_piece_selected");
			this.parent.board.unselect(this);
			this.movable = [];
		}
		,moveTo: function(j_locus)
		{
			var ox = this.position[0];
			var oy = this.position[1];
			var nx = j_locus.data("x");
			var ny = j_locus.data("y");
			
			if(this.player != this.parent.player)
				var message = this.rule.name[this.player] + " " + ox + "," + oy + " 走 " + nx + "," + ny;
			else
				var message = this.rule.name[this.player] + " " + (8-ox) + "," + (9-oy) + " 走 " + (8-nx) + "," + (9-ny);
			this.parent.log(message);
			
			this.unselect();
			this.position = [nx, ny];
			this.j_piece.appendTo(j_locus);
			
			this.parent.board.board[nx][ny].piece = this;
			delete this.parent.board.board[ox][oy].piece;
			
		}
		,attackTo: function(j_locus)
		{
			var nx = j_locus.data("x");
			var ny = j_locus.data("y");
			
			//var message = this.rule.name[this.player] + " " + this.position[0] + "," + this.position[1] + " 吃 ";
			//message += this.parent.board.board[nx][ny].piece.rule.name[(this.player+1)%2] + " " + nx + "," + ny;
			//this.parent.log(message);
			
			var j_piece = this.parent.board.board[nx][ny].piece.j_piece.unbind("click");
			this.piece_die_handler(j_piece);
			
			delete this.parent.board.board[nx][ny].piece;
			j_locus.data("attack", false);
			this.moveTo(j_locus);
		}
		,piece_die_handler: function(j_piece)
		{
			var j_death = $("<div></div>")
			.height(this.parent.board.config.locus_h)
			.width(this.parent.board.config.locus_w)
			.appendTo($("#death"))
			.append(j_piece);
		}
		,calculate_movable: function()
		{
			if(this.rule.walk_type == "basic")
			{
				var walk = this.calculate_movable_basic();
				var new_walk = [];
				// 馬 象 有絆腳
				if(this.piece_type == 3) //馬
				{
					for(var walk_idx in walk)
					{
						var new_pos = walk[walk_idx];
						var stone_axis = Math.abs(new_pos[0]) > Math.abs(new_pos[1]) ? 0 : 1;
						var stone_pos = [0, 0];
						stone_pos[stone_axis] = new_pos[stone_axis] > 0 ? 1 : -1;
						if( !this.parent.board.board[this.position[0]+stone_pos[0]][this.position[1]+stone_pos[1]].piece )
							new_walk.push( walk[walk_idx] );
						else
						{
							//console.log(this.position, stone_pos)
							//console.log(this.parent.board.board[this.position[0]+stone_pos[0]][this.position[1]+stone_pos[1]]);
						}
					}
					this.movable = new_walk;
				}
				else if(this.piece_type == 2) //象
				{
					for(var walk_idx in walk)
					{
						var new_pos = walk[walk_idx];
						var stone_pos = [new_pos[0]/2, new_pos[1]/2];
						if( !this.parent.board.board[this.position[0]+stone_pos[0]][this.position[1]+stone_pos[1]].piece )
							new_walk.push( walk[walk_idx] );
					}
					this.movable = new_walk;
				}
				else
				{
					this.movable = walk;
				}
			}
			else if(this.rule.walk_type == "4")
			{
				var walk = this.calculate_movable_4_and_5(0);
				this.movable = walk;
			}
			else if(this.rule.walk_type == "5")
			{
				var walk = this.calculate_movable_4_and_5(1);
				this.movable = walk;
			}
		}
		,calculate_movable_4_and_5: function(s)
		{
			var thisA = this;
			var x = this.position[0];
			var y = this.position[1];
			var walk = [];
			
			var stone = 0;
			var walk_test = function(nx, ny)
			{
				//無棋子
				if(!thisA.parent.board.board[nx][ny].piece)
				{
					if(stone == 0)
						walk.push([nx-x, ny-y, false]);
				}
				//有棋子，炮要停，之後跳
				else
				{
					if(thisA.parent.board.board[nx][ny].piece.player != thisA.player && stone == s)
						walk.push([nx-x, ny-y, true]);
					stone++;
				}
			}
			// x = -1
			stone = 0;
			for(var xi = x-1; xi >= 0; xi--)
				walk_test(xi, y);
			// x = 1
			stone = 0;
			for(var xi = x+1; xi <= 8; xi++)
				walk_test(xi, y);
			// y=-1
			stone = 0;
			for(var yi = y-1; yi >= 0; yi--)
				walk_test(x, yi);
			// y=1
			stone = 0;
			for(var yi = y+1; yi <= 9; yi++)
				walk_test(x, yi);
			return walk;
		}
		,calculate_movable_basic: function()
		{
			var region = this._in_which_region(this.rule.walk_region);
			var walk = this._walk_available(region);
			return walk;
		}
		,_in_which_region: function(region)
		{
			var x = this.position[0];
			var y = this.position[1];
			for(var region_idx in region)
			{
				var region_obj = region[region_idx];
				if( x >= region_obj.fm[0] 
					&& x <= region_obj.to[0] 
					&& y >= region_obj.fm[1]
					&& y <= region_obj.to[1]
				){
					return region_obj;
				}
			}
			return false;
		}
		,_walk_available: function(region_obj)
		{
			var x = this.position[0];
			var y = this.position[1];
			var walk = [];
			
			for(var walk_idx in region_obj.walk)
			{
				var w = region_obj.walk[walk_idx];
				if(w.length == 2) w.push(false);// 是否能攻擊
				var nx = x + w[0];
				var ny = y + w[1];
				
				if( nx >= region_obj.fm[0]
					&& nx <= region_obj.to[0]
					&& ny >= region_obj.fm[1]
					&& ny <= region_obj.to[1]
				){
					w[2] = false; 
					//判斷是否有己方棋子
					if(	this.parent.board.board[nx][ny].piece)
					{
						// 能走的地方有別的棋子，看看是不是敵人
						if(this.parent.board.board[nx][ny].piece.player != this.player)
						{
							// 是敵人能走，記錄
							w[2] = true;
							walk.push(w);
						}
					}
					else
					{
						// 沒有棋子，能走
						walk.push(w);
					}
				}
			}
			return walk;
		}
		
		
	});
});