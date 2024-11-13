'use client';

import {useAudio} from '@/hooks/useAudio';
import {WordStore} from '@/store/word.store';
import {WordType} from '@/types/appTypes';
import {Add, Close, Edit, MoreVert, PlayArrow} from '@mui/icons-material';
import {
	Backdrop,
	Chip,
	CircularProgress,
	Fab,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Switch,
	Typography,
} from '@mui/material';
import {DataGrid, enUS, GridColDef} from '@mui/x-data-grid';
import {useRouter} from 'next/navigation';
import {useState, MouseEvent, useEffect} from 'react';

type CellType = {
	row: WordType;
};

type GetColumnsProps = {
	handleGoEdit: (value: string) => void;
	handleDelete: (value: string) => void;
	handleToggleLearn: (value: WordType) => void;
};

type GetActionProps = {
	id: string;
	handleGoEdit: (value: string) => void;
	handleDelete: (value: string) => void;
};

const GetActions = (props: GetActionProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const rowOptionsOpen = Boolean(anchorEl);

	const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleRowOptionsClose = () => {
		setAnchorEl(null);
	};

	const handleEdit = () => {
		props.handleGoEdit(props.id);
		setAnchorEl(null);
	};

	const handleDelete = () => {
		props.handleDelete(props.id);
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton size="small" onClick={handleRowOptionsClick}>
				<MoreVert sx={{color: '#DBDBEBDE'}} />
			</IconButton>

			<Menu
				keepMounted
				anchorEl={anchorEl}
				open={rowOptionsOpen}
				onClose={handleRowOptionsClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}>
				<MenuItem onClick={handleEdit} sx={{'& svg': {mr: 2}}}>
					<Edit sx={{color: '#333', fontSize: '18px'}} />
					<Typography sx={{color: '#333', fontSize: '13px !important'}}>Edit</Typography>
				</MenuItem>
				<MenuItem onClick={handleDelete} sx={{'& svg': {mr: 2}}}>
					<Close sx={{color: '#333', fontSize: '18px'}} />
					<Typography sx={{color: '#333', fontSize: '13px !important'}}>
						Remove
					</Typography>
				</MenuItem>
			</Menu>
		</>
	);
};

const GetColumns = (props: GetColumnsProps): GridColDef[] => {
	const [playing, setUrl] = useAudio();

	return [
		{
			flex: 0.05,
			minWidth: 50,
			type: 'string',
			filterable: false,
			hideable: false,
			headerAlign: 'left',
			align: 'left',
			sortable: false,
			field: 'actions',
			headerName: '',
			renderCell: ({row}: CellType) => {
				return GetActions({
					id: row.id!,
					handleDelete: props.handleDelete,
					handleGoEdit: props.handleGoEdit,
				});
			},
		},
		{
			flex: 0.1,
			type: 'string',
			minWidth: 100,
			filterable: true,
			headerAlign: 'left',
			align: 'left',
			sortable: true,
			field: 'englishText',
			headerName: `Word`,
			renderCell: ({row}: CellType) => (
				<Typography fontWeight={'bold'}>{row.englishText}</Typography>
			),
		},
		{
			flex: 0.15,
			type: 'string',
			minWidth: 100,
			filterable: true,
			headerAlign: 'left',
			align: 'left',
			sortable: true,
			field: 'translations',
			headerName: `Translations`,
			renderCell: ({row}: CellType) => (
				<Typography fontWeight={'bold'}>{row.translations?.join(', ')}</Typography>
			),
		},
		{
			flex: 0.06,
			type: 'string',
			minWidth: 60,
			filterable: true,
			headerAlign: 'left',
			align: 'left',
			sortable: true,
			field: 'isVerb',
			headerName: `Is verb?`,
			renderCell: ({row}: CellType) =>
				row.isVerb ? (
					<Typography color="#2e7d32">Yes</Typography>
				) : (
					<Typography color="#d32f2f">No</Typography>
				),
		},
		{
			flex: 0.08,
			type: 'string',
			minWidth: 80,
			filterable: true,
			headerAlign: 'left',
			align: 'left',
			sortable: true,
			field: 'learn',
			headerName: `Learn`,
			renderCell: ({row}: CellType) => (
				<Switch checked={row.learn} onChange={() => props.handleToggleLearn(row)} />
			),
		},
		{
			flex: 0.08,
			type: 'string',
			minWidth: 80,
			filterable: true,
			headerAlign: 'left',
			align: 'left',
			sortable: true,
			field: 'sound',
			headerName: `Sound`,
			renderCell: ({row}: CellType) => (
				<IconButton onClick={!playing ? () => setUrl(row.soundUrl ?? '') : undefined}>
					<PlayArrow sx={{color: '#DBDBEBDE'}} />
				</IconButton>
			),
		},
	];
};

export default function Words() {
	const [data, setData] = useState<WordType[]>([]);
	const [loading, setLoading] = useState(false);
	const [changeData, setChangeData] = useState(false);

	const router = useRouter();
	const wordStore = new WordStore();

	useEffect(() => {
		findData();
	}, [changeData]);

	const findData = async () => {
		setLoading(true);

		try {
			const result = await wordStore.get();
			if (result) setData(result);
		} finally {
			setLoading(false);
		}
	};

	const handleGoAdd = () => {
		router.push('/words/add');
	};

	const handleGoEdit = (id: string) => {
		router.push(`/words/edit/${id}`);
	};

	const handleDelete = async (id: string) => {
		setLoading(true);

		try {
			await wordStore.remove(id!);
			setChangeData(!changeData);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleLearn = async (value: WordType) => {
		setLoading(true);

		try {
			value.learn = !value.learn;
			await wordStore.update(value);
			setChangeData(!changeData);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Grid item md={12} className="mb-8">
				<DataGrid
					localeText={enUS.components.MuiDataGrid.defaultProps.localeText}
					autoHeight
					rows={data}
					getRowId={(row: WordType) => row.id ?? ''}
					disableRowSelectionOnClick
					columns={GetColumns({handleGoEdit, handleDelete, handleToggleLearn})}
					hideFooter={true}
				/>
			</Grid>

			<div
				className="fixed flex gap-3"
				style={{top: 'calc(100vh - 100px)', left: 'calc(70vw)'}}>
				<Fab color="primary" aria-label="add" onClick={handleGoAdd}>
					<Add />
				</Fab>
			</div>

			<Backdrop
				open={loading ?? false}
				sx={{
					position: 'fixed',
					color: 'common.white',
					zIndex: theme => theme.zIndex.mobileStepper - 1,
				}}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}
