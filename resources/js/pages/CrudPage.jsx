import {useEffect, useState} from "react";
import axios from "axios";
import {
    Container, TextField, Button, Table, TableHead,
    TableBody, TableRow, TableCell, Paper, Typography,
    Stack
} from '@mui/material';

const CrudPage = () => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({_id: '', firstName: "", lastName: "", email: "", phoneNumber: ""});
    const [isEditing, setIsEditing] = useState(false);
    const API = '/api/users';

    useEffect(() => {
        fetchData();
    },[])

    const fetchData = () => {
        axios.get(API)
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    };
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            _id: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: ''
        });
        setIsEditing(false);
    };


    const handleSubmit = () => {
        if (isEditing) {
            axios.put(`${API}/${formData._id}`, formData)
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

    const handleDelete = (_id) => {
        axios.delete(`${API}/${_id}`)
            .then(fetchData);
    };

    const handleImportUsers = () => {
        const array1 = [{
            "_id": "5f0f36345628b2bb08ddcf83",
            "firstName": "Marina",
            "lastName": "Orozco",
            "email": "marina@wiline.com"
        },
            {
                "_id": "5f0f3634a3357afc09a0333d",
                "firstName": "Kip",
                "lastName": "Winters",
                "email": "kip@wiline.com"
            },
            {
                "_id": "5f0f363455f1ad4632d8e4d3",
                "firstName": "Lorie",
                "lastName": "Avery",
                "email": "lorie@wiline.com"
            },
            {
                "_id": "5f0f36343311956754254404",
                "firstName": "Jasmin",
                "lastName": "Winters",
                "email": "jasmin@wiline.com"
            },
            {
                "_id": "5f0f36344285b38ab4e9187f",
                "firstName": "Emma",
                "lastName": "Hess",
                "email": "emma@wiline.com"
            },
            {
                "_id": "5f0f3634abaa863ab18ac741",
                "firstName": "Elvia",
                "lastName": "Acosta",
                "email": "elvia@wiline.com"
            },
            {
                "_id": "5f0f36342c501774010d92fa",
                "firstName": "Liliana",
                "lastName": "Sweeney",
                "email": "liliana@wiline.com"
            },
            {
                "_id": "5f0f3634987f2ae9d3c7c48a",
                "firstName": "Florencio",
                "lastName": "Acosta",
                "email": "florencio@wiline.com"
            },
            {
                "_id": "5f0f3634e8dfd9bbde33c703",
                "firstName": "Delores",
                "lastName": "Sanchez",
                "email": "delores@wiline.com"
            }
        ];

        const array2 = [
            {
                email: "liliana@wiline.com",
                phoneNumber: "051656592"
            },
            {
                "email": "florencio@wiline.com",
                "phoneNumber": "051329392"
            },
            {
                "email": "delores@wiline.com",
                "phoneNumber": "051334392"
            }
        ]



        axios.post('/api/users/import', {user : array1, phoneNumber: array2})
            .then(() => fetchData())
            .catch(err => console.error(err));
    };
    return (
        <Container sx={{py: 4}}>
            <Typography variant="h4" gutterBottom>CRUD - Contacts</Typography>

            <Paper sx={{p: 3, mb: 4}}>
                <Stack spacing={2}>
                    <TextField
                        label="ID"
                        name="id"
                        value={formData._id}
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
                            <TableRow key={user._id}>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(user)}>Edit</Button>
                                    <Button color="error" onClick={() => handleDelete(user._id)}>Delete</Button>
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
