import { useState } from "react";
import { ListItem, ListItemText } from "@mui/material";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const WorkoutListItem = ({ workout, onClick }) => {
    const [isStarred, setIsStarred] = useState(false);

    function handleStarClick(event) {
        event.stopPropagation();
        setIsStarred(!isStarred);
    };

    return (
        <ListItem style={styles.listItem} onClick={onClick}>
            <div style={styles.leftContainer}>
                <div style={styles.titleContainer}>
                    {isStarred ? (
                        <StarIcon style={{ color: '#D1B000' }} onClick={handleStarClick} />
                    ) : (
                        <StarBorderIcon style={{ color: '#D1B000' }} onClick={handleStarClick} />
                    )}
                    <span style={styles.title}>{workout.userProgramName}</span>
                </div>
                <ListItemText primary={workout.userProgramDescription} />
                <ListItemText secondary={`${workout.daysPerWeek} days per week`} />
            </div>
            <div style={styles.imageContainer}>
                <img src={workout.image} alt={workout.title} style={styles.image} />
            </div>
        </ListItem>
    );
};

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
    },
    imageContainer: {
        flexShrink: 0,
        marginLeft: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 4,
    },
};

export default WorkoutListItem;
