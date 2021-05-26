import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import MenuBar from '../MenuBar/MenuBar';
import { useHistory } from "react-router-dom";
import { useCreateTournamentMutation } from 'src/types/graphql-generated';
import { DateTime } from 'luxon';
import {
  DateTimePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flexGrow: 1,
    },
    left: {
      backgroundColor: 'black'
    },
    formBox: {
      marginTop: theme.spacing(10),
    },
    form: {
      padding: theme.spacing(5),
      textAlign: 'left'
    },
    formGrid: {
      margin: 'auto'
    },
    formTitle: {
      paddingBottom: theme.spacing(3),
      textAlign: 'center'
    },
    formButtons: {
      marginTop: theme.spacing(2)
    },
    textField: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    nameFieldContainer: {
      width: '100%',
      display: 'flex',
      marginBottom: theme.spacing(3),
    },
    nameField: {
      flex: '1 1 auto',
    },
    nameFieldSuffix: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(2),
    },
    dateField: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    createButton: {
      marginTop: theme.spacing(2),
      width: '100%',
    },
    errorText: {
      color: theme.palette.error.main,
    },
  }),
);

interface Inputs {
  name: string;
  startDate: DateTime,
  lastRoundDate: DateTime,
  roundsNumber: number,
  minutesBetweenRounds: number,
}

const schema = yup.object().shape({
  name: yup.string().max(15).min(5).required().label("Tournament's name"),
  startDate: yup.date().required().typeError('Invalid Date').label('Start date')
  .test('startDate-in-the-future', 'Start date cannot be in the past', (value, schema) => {
    return DateTime.now() < DateTime.fromJSDate(value);
  }),
  lastRoundDate: yup.date().required().typeError('Invalid Date').label("Last Round's date")
  .when('startDate', (value, schema) => {
    return schema.min(value, 'last round date must be after tournament start date');
  }),
  roundsNumber: yup.number().required().integer().min(1).max(32).label("Number of rounds"),
  minutesBetweenRounds: yup.number().required().integer().min(15).label("Minutes between rounds"),
}).test({
  name: 'scheduleIsValid',
  message: ({ value }) => {
    const firstRoundDate = DateTime.fromJSDate(value.lastRoundDate)
      .minus({ minutes: value.minutesBetweenRounds * (value.roundsNumber - 1) });
    return `With the provided schedule, the first round starts on ${firstRoundDate.toLocaleString(DateTime.DATETIME_FULL)}, which is exactly at or before the tournament start date.`
  },
  test: (value) => {
    const result = DateTime.fromJSDate(value.startDate)
      <
    DateTime.fromJSDate(value.lastRoundDate)
      .minus({ minutes: value.minutesBetweenRounds * (value.roundsNumber - 1) })
    return result;
  }
}
);

export default function TournamentCreationPage(props) {
  const classes = useStyles();
  const now = DateTime.now();
  const history = useHistory();

  const { register, handleSubmit, errors, control } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: now.plus({ hours: 1 }),
      lastRoundDate: now.plus({ hours: 4 }),
      roundsNumber: 9,
      minutesBetweenRounds: 15,
    }
  });

  const formState = useWatch<Inputs>({
    control,
  });

  const [firstRoundDate, setFirstRoundDate] = useState<DateTime>(undefined);
  const [validSchedule, setValidSchedule] = useState<boolean>(true);

  useEffect(() => {
    const firstRound = (formState.lastRoundDate as DateTime)?.minus({
      minutes: formState.minutesBetweenRounds * (formState.roundsNumber - 1)
    });
    setFirstRoundDate(firstRound);
    setValidSchedule(formState.startDate < firstRound);
  }, [formState.startDate, formState.lastRoundDate, formState.roundsNumber, formState.minutesBetweenRounds]);

  const [ createTournament ] = useCreateTournamentMutation({
    onCompleted: (data) => {
      history.replace(`/tournament/${data.createTournament.id}/info`)
    }
  });

  const onSubmit = async (data: Inputs) => {
    createTournament({
      variables: data
    });
  };

  return (
    <>
    <MenuBar showTournaments={true} />
    <div className={classes.root}>
      <Grid container xs={12} spacing={3} direction="row" justify="center">
        <Grid item xs={4}>
          <Paper className={classes.formBox} elevation={3}>

            <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <Typography className={classes.formTitle} variant="h4" component="h2" gutterBottom>
                Create a tournament
              </Typography>
              <div className={classes.nameFieldContainer}>
                <TextField inputRef={register} label="Name" name="name" variant="outlined"
                  error={errors?.name !== undefined} helperText={errors?.name?.message}
                  className={classes.nameField}
                />
                <Typography variant='body1' className={classes.nameFieldSuffix}>
                  Tournament
                </Typography>
              </div>
              <Controller
                name="startDate"
                control={control}
                render={({ ref, ...rest }) => (
                  <DateTimePicker
                    label="Start Date"
                    animateYearScrolling
                    invalidDateMessage="Invalid Date"
                    views={["year", "month", "date", "hours", "minutes"]}
                    cancelLabel="Cancel"
                    openTo="hours"
                    {...rest}
                    inputVariant='outlined'
                    className={classes.dateField}
                    error={errors?.startDate !== undefined || !validSchedule}
                    helperText={errors?.startDate && errors?.startDate['message']}
                  />
                )}
              />
              <Controller
                name="lastRoundDate"
                control={control}
                render={({ ref, ...rest }) => (
                  <DateTimePicker
                    label="Last Round Date"
                    animateYearScrolling
                    invalidDateMessage="Invalid Date"
                    views={["year", "month", "date", "hours", "minutes"]}
                    cancelLabel="Cancel"
                    openTo="hours"
                    {...rest}
                    inputVariant='outlined'
                    className={classes.dateField}
                    error={errors?.lastRoundDate !== undefined || !validSchedule}
                    helperText={errors?.lastRoundDate && errors?.lastRoundDate['message']}
                  />
                )}
              />
              <TextField inputRef={register} type="number"
                label="Number of Rounds" name="roundsNumber" variant="outlined"
                error={errors?.roundsNumber !== undefined || !validSchedule}
                helperText={errors?.roundsNumber?.message}
                className={classes.textField}
              />
              <TextField inputRef={register} type="number"
                label="Minutes between rounds" name="minutesBetweenRounds" variant="outlined"
                error={errors?.minutesBetweenRounds !== undefined || !validSchedule}
                helperText={errors?.minutesBetweenRounds?.message}
                className={classes.textField}
              />
              <div >
              <Typography variant='body1' className={!validSchedule && classes.errorText}>
                With this schedule the first round will be on {firstRoundDate?.toLocaleString(DateTime.DATETIME_FULL)}.
                {!validSchedule && ' The first round should be after the tournament start date.'}
              </Typography>
              </div>
              <Button variant="contained" color="primary" type="submit" className={classes.createButton}>
                Create
              </Button>
            </form>

          </Paper>
        </Grid>
      </Grid>
    </div>
    </>
  );
}