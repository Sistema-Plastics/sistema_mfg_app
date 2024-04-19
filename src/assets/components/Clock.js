import React, { Component } from "react";
import { Grid, Typography, Box, Container, Paper } from "@mui/material";
export class Clock extends Component {
  constructor() {
    super();

    this.state = {
      time: new Date(),
    };
  }

  componentDidMount() {
    this.update = setInterval(() => {
      this.setState({
        time: new Date(),
      });
    }, 1 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  render() {
    const { time } = this.state;
    const timeOpts = {
      timeZone: "Pacific/Auckland",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    };
    return (
      <React.Fragment>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
          }}
        >
          <Container
            style={{
              minWidth: "100%",
              height: "100vh",
              paddingTop: 10,
              // border: "solid",
              // backgroundColor: "yellow",
            }}
          >
            <Grid
              container
              style={{
                minWidth: "100%",
                height: "100vh",
                // border: "solid",
                // padding: 10,
                // backgroundColor: "green",
              }}
            >
              <Grid
                item
                style={{
                  minWidth: "100%",
                  height: "100%",
                  // border: "solid",
                  // padding: 10,
                  // backgroundColor: "orange",
                }}
              >
                <Paper
                  elevation={16}
                  style={{
                    minWidth: "90%",
                    height: "80vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // border: "solid",
                    // padding: 10,
                    // backgroundColor: "purple",
                  }}
                >
                  <Typography variant="h2">
                    Current Time :- {time.toLocaleTimeString("en-US", timeOpts)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </React.Fragment>
    );
  }
}

export default Clock;
