import React from 'react';
import "./InfoBox.css"
import {Card,CardContent,Typography} from '@material-ui/core';

function InfoBox({title,cases,active,isRed,total,...props}) {
    return (
        <Card
            onClick ={props.onClick}
            className ={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}
            >
            <CardContent>
                <Typography  className="infobox_title" colour="textSecondary" >{title}</Typography>
                <h2 className ={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>{cases} Today</h2>
                <Typography className = "infoBox_total">{total} Total</Typography>
            </CardContent>
        </Card>
        
    )
}

export default InfoBox
