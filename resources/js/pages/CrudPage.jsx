import {useEffect, useState} from "react";
import axios from "axios";
import {
    Container, TextField, Button, Table, TableHead,
    TableBody, TableRow, TableCell, Paper, Typography,
    Stack
} from '@mui/material';

const CrudPage = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({id:'',firstName:"",lastName:"",email:"",phoneNumber:"" });
    const [isEditing, setIsEditing] = useState(false);
    const API = '/api/users';

    const fetchData = () => {
        axios.get(API)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: ''
        });
        setIsEditing(false);
    };



    const handleSubmit = () => {
        if (isEditing) {
            axios.put(`${API}/${formData.id}`, formData)
                .then(() => {
                    fetchData();
                    resetForm();
                });
        } else {
            axios.post(API, formData)
                .then(() => {
                    fetchData();
                    resetForm();
                });
        }
    };


    const handleEdit = (item) => {
        setFormData(item);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        axios.delete(`${API}/${id}`)
            .then(fetchData);
    };

    const handleImportUsers = () => {
        const array1 = [
            { id: 1, firstName: "Alice", lastName: "Smith", email: "alice@example.com", phoneNumber: "123456789" },
            { id: 2, firstName: "Bob", lastName: "Brown", email: "bob@example.com", phoneNumber: "987654321" }
        ];

        const array2 = [
            { id: 3, firstName: "Carol", lastName: "Johnson", email: "carol@example.com", phoneNumber: "111222333" }
        ];

        const usersToImport = [...array1, ...array2];

        axios.post('/api/users/import', { users: usersToImport })
            .then(() => fetchData())
            .catch(err => console.error(err));
    };
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>CRUD - Contacts</Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Stack spacing={2}>
                    <TextField
                        label="ID"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleSubmit}>
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleImportUsers}
                    >
                        Import Users
                    </Button>
                </Stack>
            </Paper>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(user)}>Edit</Button>
                                    <Button color="error" onClick={() => handleDelete(user.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default CrudPage;
