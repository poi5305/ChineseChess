define(	["dojo/_base/declare"
		, "dojo/_base/lang"], 
function(declare, lang)
{
	return declare(null, 
	{
		constructor: function(parent)
		{
			console.log("Chinese Chess Rule Created");
			this.parent = parent;
		}
		,parent: {}
		// 0將 1士 2象 3馬 4車 5包 6卒
		// 0帥 1仕 2像 3傌 4車 5炮 6兵
		,r_pieces: 
		[
			/* 0將 */
			{
				name: ["將", "帥"],
				position: [[4,0]],
				attack_type: "basic",
				walk_type: "basic",
				walk_region:
				[
					{
						fm: [3,0],
						to: [5,2],
						walk:
						[
							[1,0], [-1,0], [0,1], [0,-1]
						]
					},
				],
			},
			/* 1士 */
			{
				name: ["士", "仕"],
				position: [[3,0], [5,0]],
				attack_type: "basic",
				walk_type: "basic",
				walk_region:
				[
					{
						fm: [3,0],
						to: [5,2],
						walk:
						[
							[1,1], [-1,1], [1,-1], [-1,-1]
						]
					},
				],
			},
			/* 2象 */
			{
				name: ["象", "像"],
				position: [[2,0], [6,0]],
				attack_type: "basic",
				walk_type: "basic",
				walk_region:
				[
					{
						fm: [0,0],
						to: [8,4],
						walk:
						[
							[2,2], [-2,2], [2,-2], [-2,-2]
						]
					},
				],
			},
			/* 3馬 */
			{
				name: ["馬", "傌"],
				position: [[1,0], [7,0]],
				attack_type: "basic",
				walk_type: "basic",
				walk_region:
				[
					{
						fm: [0,0],
						to: [8,9],
						walk:
						[
							[2,1], [-2,1], [2,-1], [-2,-1],
							[1,2], [-1,2], [1,-2], [-1,-2],
						]
					},
				],
			},
			/* 4車 */
			{
				name: ["車", "俥"],
				position: [[0,0], [8,0]],
				attack_type: "4",
				walk_type: "4",
				walk_region:
				[
					{
						fm: [0,0],
						to: [8,9],
						walk: []
					},
				],
			},
			/* 5包 */
			{
				name: ["包", "炮"],
				position: [[1,2], [7,2]],
				attack_type: "5",
				walk_type: "5",
				walk_region:
				[
					{
						fm: [0,0],
						to: [8,9],
						walk: []
					},
				],
			},
			/* 6卒 */
			{
				name: ["卒", "兵"],
				position: [[0,3], [2,3], [4,3], [6,3], [8,3]],
				attack_type: "basic",
				walk_type: "basic",
				walk_region:
				[
					{
						fm: [0,5],
						to: [8,9],
						walk:
						[
							[1,0], [-1,0], [0,1]
						]
					},
					{
						fm: [0,0],
						to: [8,5],
						walk:
						[
							[0,1]
						]
					},
					
				],
			},
		]
	});
});