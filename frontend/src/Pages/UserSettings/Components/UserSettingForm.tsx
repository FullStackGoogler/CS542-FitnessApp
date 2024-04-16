import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { UserSettingItem } from "../Interfaces/UserSettingItem";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (UserSettingItem: UserSettingItem) => void;
    editItem: UserSettingItem;
}

const UserSettingForm: React.FC<Props> = ({ open, onClose, onSubmit, editItem}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bday, setBday] = useState("");
    const [weight, setWeight] = useState(0);

    //const [addEdit, setAddEdit] = useState("");
    //const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (open) {
            if(editItem != null){
                setUsername(editItem.username);
                setPassword(editItem.password);
                setFirstname(editItem.firstname);
                setLastname(editItem.lastname);
                setEmail(editItem.email);
                setPhone(editItem.phone);
                setBday(editItem.bday);
                setWeight(editItem.weight);
            }
        }
    }, [open]);

    const handleDiscard = () => {
        onClose();
    }

    const handleCreatePlanSubmit = () => {
        
        let id = 0;
        if(editItem != null){
            id = editItem.userid;
        }
        console.log("id: ", id);
        const UserSetting: UserSettingItem = {
            userid: editItem.userid,
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            bday: bday,
            weight: weight
        };

        console.log(UserSetting);

        onSubmit(UserSetting);
        onClose();
    };

   /* const handleCalorieGoalChange = (index: number, value: number) => {
        const updatedCalorieGoal = value;
        setCalorieGoal(updatedCalorieGoal);
    };

    const handleProteinGoalChange = (index: number, value: string) => {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[index].targetGroup = value;
        setWorkouts(updatedWorkouts);
    };

    const handleFatGoalChange = (index: number, value: string) => {
       
    };

    const handleCarbGoalChange = (index: number, value: string) => {
       
    };*/

    return (
        <Dialog open={open} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "600px",
                },
            },
        }}>
            <DialogTitle>Edit User Settings</DialogTitle>
            <DialogContent>
                <TextField
                    label="Username"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="First Name"
                    fullWidth
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Last Name"
                    fullWidth
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Phone"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Birthday"
                    fullWidth
                    value={bday}
                    onChange={(e) => setBday(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Weight"
                    fullWidth
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDiscard}>Discard Changes</Button>
                <Button onClick={handleCreatePlanSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserSettingForm;
