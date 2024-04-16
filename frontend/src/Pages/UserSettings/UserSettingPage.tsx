import React, { useEffect, useState } from "react";

import { List, ListItemButton, ListItemSecondaryAction, Button, IconButton, Pagination} from "@mui/material";
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';

import TopBar from "../../Components/TopBar";
//import ListItem  from "./Components/UserSettingListItem";
import { ListItem, ListItemText} from "@mui/material";

import  UserSettingForm from "./Components/UserSettingForm";

import { isTemplateHead } from "typescript";
import { setMaxIdleHTTPParsers } from "http";


import { UserSettingItem } from "./Interfaces/UserSettingItem";

const UserSettingPage: React.FC = () => {
    const [selecteduserSetting, setSelecteduserSetting] = useState<UserSettingItem | null>(null);
    const [edituserSetting, setEdituserSetting] = useState<UserSettingItem|null>(null);
    let userSettingItemDefault = {
        userid: 0,
        username: "",
        password: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        bday: "",
        weight: 0
    }
    const [userSetting, setUserSetting] = useState<UserSettingItem>(userSettingItemDefault);

    const [edit, setEdit] = useState(false);
   
    useEffect(() => {
        fetch('http://localhost:9000/api/usertable/1')
            .then(response => response.json())
            .then(data => {
                    //console.log(data[0])
                    setUserSetting(data[0])
                    /*setUserSetting(data.map((user: any) => ({
                        userid: user.userid,
                        username: user.userid,
                        password: user.password,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        phone: user.phone,
                        bday: user.bday,
                        weight: user.weight
                    })))*/
                }
            )
    });

    /*const handleClick = (item: UserSettingItem) => {
        setSelecteduserSetting(item);
        console.log(item.userid);
        fetch(`http://localhost:9000/api/userSetting/${item.nutrition_plan_id}`)
            .then(response => response.json())
            .then(userSettingData => {
                    console.log(userSettingData)
                    setSelecteduserSetting(userSettingData);
                })
            .catch(error => console.error('Error fetching nutrition plan:', error));
    };  */ 

    const handleClose = () => {
        setEdit(false);
    };


    
    const handleEditPlanSubmit = async (userSetting: UserSettingItem) => {
        try {
            const response = await fetch('http://localhost:9000/api/userSettingEdit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userSetting)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('UserSettingItem successfully sent:', responseData);
            } else {
                console.error('Failed to send UserSettingItem:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error sending UserSettingItem:', error.message);
        }

        console.log("User Settings:", userSetting);
    }

    const handleEdit = async (userSetting: UserSettingItem) => {
        console.log("edit pressed");
        setEdit(true);
    }

    

    //TODO: Use CSS to better align these
    return (
        <div>
            <TopBar title="User Settings" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>User Settings</div>
                <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(userSetting)}>
                    <EditIcon />
                </IconButton>
            </div>
            <div style={{ position: 'absolute', top: '125px', bottom: '0', width: '100%' }}>
                <ListItem style={styles.listItem}>
                    <ListItemText primary= {'Username: ' + userSetting.username}/>
                </ListItem>
                <ListItem style={styles.listItem}>
                    <ListItemText primary= {'Password: ' + userSetting.password}/>
                </ListItem>
                <ListItem style={styles.listItem}>
                    <ListItemText primary={'First name: ' + userSetting.firstname} />
                </ListItem>
                <ListItem style={styles.listItem}>
                    <ListItemText primary={'Last name: ' + userSetting.lastname} />
                </ListItem>
                <ListItem style={styles.listItem}>
                    <ListItemText primary={'Email: ' + userSetting.email} />
                </ListItem>
                <ListItem style={styles.listItem}>
                    <ListItemText primary={'Phone: ' + userSetting.phone} />
                </ListItem>
                <ListItem style={styles.listItem}>
                    <ListItemText primary={'Birthday: ' + userSetting.bday} />
                </ListItem>
                <ListItem style={styles.listItem}>
                    <ListItemText primary={'Weight: ' + userSetting.weight} />
                </ListItem>
            </div>
            <UserSettingForm open={edit} onClose={handleClose} onSubmit={handleEditPlanSubmit} editItem={userSetting}/>
        </div>
    );
}    

const styles = {
    listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    starIcon: {
        marginRight: 8,
    },
    title: {
        fontSize: 20,
    }
};
export default UserSettingPage;