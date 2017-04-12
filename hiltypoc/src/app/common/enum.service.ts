export enum Status { 
	Active,
	Inactive
};

export enum Tab {
	Project,
	Attributes,
	Hierarchy,
	Documents,
	Users
}

export const Enums = {
	App: {
		logo: 'data:image/png;base64,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',
		icons: {
			borderLeft: '<svg  xmlns=\'http://www.w3.org/2000/svg\' width=\'30\' height=\'30\'><defs><style>.a{fill:red;stroke:#95989a;}</style></defs><line class=\'a\' x2=\'2\' y2=\'157\'/><line class=\'a\' x2=\'87\' transform=\'translate(0 10)\'/></svg>',
			borderBottom: '<svg xmlns=\'http://www.w3.org/2000/svg\'><defs><style>.a{fill:none;stroke:#95989a;}</style></defs><line class=\'a\' x2=\'2\' y2=\'157\' /><line class=\'a\' x2=\'87\' transform=\'translate(0 20)\'/></svg>',
			borderTop: '<svg xmlns=\'http://www.w3.org/2000/svg\'><defs><style>.a{fill:none;stroke:#95989a;}</style></defs><line class=\'a\' x2=\'2\' y2=\'157\'/><line class=\'a\' x2=\'87\' transform=\'translate(0 0)\'/></svg>',
			corner: '<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 15 44\'><defs><style>.a{fill:none;stroke:#8ebbd9;}</style></defs><line class=\'a\' x2=\'15\' transform=\'translate(0 44)\'/><line class=\'a\' y1=\'44\'/></svg>',
			cornerSmall: '<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 15 26\'><defs><style>.a{fill:none;stroke:#8ebbd9;}</style></defs><line class=\'a\' x2=\'15\' transform=\'translate(0 26)\'/><line class=\'a\' y1=\'26\'/></svg>',
			whitePixel: '<svg xmlns=\'http://www.w3.org/2000/svg\'><defs><style>.a{fill:none;stroke:#fff;}</style></defs><line class=\'a\' y1=\'44\' /></svg>',
			bluePixel: '<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1 44\'><defs><style>.a{fill:none;stroke:#8ebbd9;}</style></defs><line class=\'a\' y1=\'44\'/></svg>'
		}
	},
	Data: {
		projects: [
			{
				id: 0,
				name: 'RMIM, Rems-Murr-Kreis-Immobilien-Management GmbH, Landratsamt Waiblingen Abschottungen',
				types: [
					{
						id: 0,
						name: 'Joints'
					},
					{
						id: 1,
						name: 'Penetration'
					}
				],
				status: Status.Active,
				building: 'Landratsamt Waiblingen Abschottungen',
				address: ['Mayenner Str. 55', 'Waiblingen', 'Baden-Württemberg'],
				attributes: [
					{
						name: 'Attribute item 1',
						value: 10
					},
					{
						name: 'Attribute item 2',
						value: 5
					},
					{
						name: 'Attribute item 3',
						value: 2
					},
					{
						name: 'Attribute item 4',
						value: 6
					},
					{
						name: 'Attribute item 5',
						value: 8
					}
				],
				hierarchy: {
					name: 'Building',
					children: [
						{
							name: 'Block A',
							children: [
								{
									name: 'Floor #1'
								},
								{
									name: 'Floor #2'
								}
							]
						},
						{
							name: 'Block B',
							children: [
								{
									name: 'Floor #1',
									children: [
										{
											name: 'Area B1A',
											children: [
												{
													name: 'Room A101'
												},
												{
													name: 'Room A102'
												},
												{
													name: 'Room A103'
												},
												{
													name: 'Room A104'
												},
												{
													name: 'Room A105'
												}
											]
										},
										{
											name: 'Area B1B',
											children: [
												{
													name: 'Room B111'
												},
												{
													name: 'Room B112'
												},
												{
													name: 'Room B113'
												},
												{
													name: 'Room B114'
												},
												{
													name: 'Room B115'
												}
											]
										},
										{
											name: 'Area B1C',
											children: [
												{
													name: 'Room - Open space #1'
												},
												{
													name: 'Room - Open space #2'
												}
											]
										}
									]
								},
								{
									name: 'Floor #2',
									children: [
										{
											name: 'Area B2A',
											children: [
												{
													name: 'Level 6'
												}
											]
										},
										{
											name: 'Area B2B',
											children: [
												{
													name: 'Level 6'
												}
											]
										},
										{
											name: 'Area B2C',
											children: [
												{
													name: 'Level 6'
												}
											]
										}
									]
								}
							]
						}
					]
				},
				documents: ['EG_DIN_A3_1_400', 'OG1_DIN_A3_1_400', 'OG2_DIN_A3_1_400'],
				users: ['John Doe', 'Bill Smith', 'Monica Toretto'],
				reports: ['Standard_Report_07.04.2017-08-03-27_no_filter.pdf', 'Standard_Report_11.04.2017-08-03-27_no_filter.pdf']
			},
			{
				id: 1,
				name: 'Test1, Businees Center A',
				types: [
					{
						id: 0,
						name: 'Penetration'
					}
				],
				hierarchy: {
					name: 'Building'
				},
				status: Status.Active
			},
			{
				id: 2,
				name: 'Test2, London Parliment',
				types: [
					{
						id: 0,
						name: 'Joints'
					}
				],
				hierarchy: {
					name: 'Building'
				},
				status: Status.Inactive
			}
		]
	}
}