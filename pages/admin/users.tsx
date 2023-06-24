import { tesloApi } from '@/api';
import { AdminLayout } from '@/components/layout';
import { IUser } from '@/interfaces';
import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const UsersPage: NextPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users',{});
  const [ users, setUsers ] = useState<IUser[]>([]);

  useEffect(() => {
    if( data ){
      setUsers( data );
    }
  },[ data ])

  if( !data && !error ) return <></>;

  const onRoleUpdated = async ( userId: string, role: string) => {
    const prevUsers = users.map( user => ({ ...user }));
    const updatedUsers = users.map( user => ({
      ...user,
      role: userId === user._id ? role : user.role
    }))

    setUsers( updatedUsers as any);
    
    try {
      await tesloApi.put('/admin/users', { userId, role });
    } catch (error: any) {
      setUsers( prevUsers );
    }  
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Full Name', width: 300 },
    { 
      field: 'role', 
      headerName: 'Rol',  
      width: 300,
      renderCell: ( { row }: GridRenderCellParams ) => {
        return (
          <Select
            value={row.role}
            label='Rol'
            onChange={ ({ target }) => onRoleUpdated( row.id, target.value )}
            sx={{ width: '300px' }}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Client</MenuItem>
            <MenuItem value='super-user'>Super User</MenuItem>
            <MenuItem value='SEO'>SEO</MenuItem>
          </Select>
        )
      }
    },
  ]

  const rows = users.map( user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  return (
    <AdminLayout
      title='Users'
      subTitle='Maintenance of Users'
      icon={ <PeopleOutline /> }
    >
      <Grid sx={{ mt: 2 }} container className="fadeIn">
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid 
						rows={ rows }
						columns={ columns }
						pageSizeOptions={[10]}
					/>
				</Grid>
			</Grid>
    </AdminLayout>
  )
}

export default UsersPage