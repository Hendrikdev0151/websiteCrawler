import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";

import crawlRoutes from "../crawlRoutes";

const useStyles = makeStyles((theme) => ({
  root: {
    alignSelf: "center",
    width: 500,
    height: "100%",
  },
  header: {
    height: 75,
    width: "100%",
    display: "flex",
    backgroundColor: blue["A400"],
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 4,
    color: "white",
  },
  headerTitle: {
    flexGrow: 1,
  },
  body: {
    width: "100%",
    height: "100%",
  },
  bodyHead: {
    marginTop: 20,
    marginBottom: 10,
  },
  divider: {
    margin: 20,
  },
  progress: {
    margin: theme.spacing(8),
  },
}));

export default function CrawlList() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(url) {
    setLoading(true);
    await handleCrawl(url);
  }

  function handleCrawl(value) {
    console.log(value);
    fetch(`http://localhost:8099/crawlEntries/${value}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(() => setLoading(false))
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className={classes.root}>
      <Paper>
        <Box component="div" alignItems="center" className={classes.header}>
          <Typography variant="h5" className={classes.headerTitle}>
            Einträge laden
          </Typography>
        </Box>

        {!loading ? (
          <div className={classes.body}>
            {crawlRoutes.entries.map((n) => {
              return (
                <List
                  key={n.id}
                  component="nav"
                  aria-label="main mailbox folders"
                >
                  <ListItem
                    button
                    value={n.id}
                    onClick={(event) => handleSubmit(n.value)}
                  >
                    <ListItemIcon>{n.icon}</ListItemIcon>
                    <ListItemText primary={n.title} />
                  </ListItem>
                </List>
              );
            })}
          </div>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={classes.body}
          >
            <CircularProgress className={classes.progress} color="secondary" />
          </Box>
        )}
      </Paper>
    </div>
  );
}
