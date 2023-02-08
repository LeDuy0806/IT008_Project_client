import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    appBarSearch: {
        borderRadius: 4,
        marginTop: "1rem",
        display: "flex",
        padding: "24px",
        width: "75%",
        zIndex: 0,
    },
    pagination: {
        borderRadius: 4,
        marginTop: "1rem",
        padding: "16px",
    },
    gridContainer: {
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column-reverse",
        },
    },
}));
